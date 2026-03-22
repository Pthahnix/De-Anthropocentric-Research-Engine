import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { unlinkSync } from "fs";
import { resolve } from "path";
import { webFetching } from "../src/tools/web_fetching.js";
import { webContent } from "../src/tools/web_content.js";
import { normUrl } from "../src/utils/misc.js";

const cacheDir = process.env.NEOCORTICA_CACHE || ".cache";

function cleanupTestFiles(normalizedUrls: string[]) {
  for (const nu of normalizedUrls) {
    const mdPath = resolve(cacheDir, "web", `${nu}.md`);
    const metaPath = resolve(cacheDir, "web", `${nu}.json`);
    try { unlinkSync(mdPath); } catch {}
    try { unlinkSync(metaPath); } catch {}
  }
}

describe("integration: real Apify API", () => {
  const testUrls: string[] = [];

  afterEach(() => {
    cleanupTestFiles(testUrls);
    testUrls.length = 0;
  });

  it("fetches a real web page and reads it from cache", { timeout: 120000 }, async () => {
    // Use a simple, stable page (httpbin returns predictable content)
    const url = "https://httpbin.org/html";
    const nu = normUrl(url);
    testUrls.push(nu);

    // Step 1: Fetch via Apify (real API call)
    const meta = await webFetching(
      { url, title: "httpbin HTML page" },
      undefined, // use real Apify client
      (info) => console.log(`  [progress] ${info.message}`),
    );

    assert.equal(meta.url, url);
    assert.equal(meta.normalizedUrl, nu);
    assert.ok(meta.markdownPath, "Should have markdownPath after successful fetch");
    assert.equal(meta.fetchFailed, undefined);

    // Step 2: Read from cache
    const content = webContent({ normalizedUrl: nu });
    assert.ok(content, "Should find page in cache");
    assert.ok(content!.content.length > 50, "Content should have substantial text");

    // Step 3: Second fetch should be cache hit (fast)
    const start = Date.now();
    const cached = await webFetching({ url });
    const elapsed = Date.now() - start;
    assert.ok(cached.markdownPath, "Cached fetch should have markdownPath");
    assert.ok(elapsed < 100, `Cache hit should be fast, was ${elapsed}ms`);
  });
});
