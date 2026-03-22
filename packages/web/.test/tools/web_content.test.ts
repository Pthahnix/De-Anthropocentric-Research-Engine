import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { unlinkSync } from "fs";
import { resolve } from "path";
import { webContent } from "../../src/tools/web_content.js";
import { saveMarkdown } from "../../src/utils/cache.js";

const cacheDir = process.env.NEOCORTICA_CACHE || ".cache";

function cleanupTestFiles(normalizedUrls: string[]) {
  for (const nu of normalizedUrls) {
    const mdPath = resolve(cacheDir, "web", `${nu}.md`);
    try { unlinkSync(mdPath); } catch {}
  }
}

describe("web_content", () => {
  const testUrls: string[] = [];

  afterEach(() => {
    cleanupTestFiles(testUrls);
    testUrls.length = 0;
  });

  it("returns content by normalizedUrl", () => {
    testUrls.push("zztest_content_example_com");
    saveMarkdown("zztest_content_example_com", "# Example\n\nPage content here.");
    const result = webContent({ normalizedUrl: "zztest_content_example_com" });
    assert.ok(result);
    assert.equal(result!.content, "# Example\n\nPage content here.");
  });

  it("derives normalizedUrl from url", () => {
    testUrls.push("zztest_content_github_com_page");
    saveMarkdown("zztest_content_github_com_page", "# GitHub Page");
    const result = webContent({ url: "https://zztest-content-github.com/page" });
    assert.ok(result);
    assert.equal(result!.content, "# GitHub Page");
  });

  it("returns null when page not cached", () => {
    const result = webContent({ normalizedUrl: "zztest_nonexistent_99999" });
    assert.equal(result, null);
  });

  it("returns null when neither url nor normalizedUrl provided", () => {
    const result = webContent({});
    assert.equal(result, null);
  });

  it("prefers normalizedUrl over url when both provided", () => {
    testUrls.push("zztest_prefer_normalized");
    saveMarkdown("zztest_prefer_normalized", "# Preferred Content");
    const result = webContent({
      url: "https://wrong-url.com/should-not-match",
      normalizedUrl: "zztest_prefer_normalized",
    });
    assert.ok(result);
    assert.equal(result!.content, "# Preferred Content");
  });

  it("handles markdown with unicode content", () => {
    testUrls.push("zztest_unicode_web");
    saveMarkdown("zztest_unicode_web", "# 中文标题\n\n数学公式: ∑∫∂");
    const result = webContent({ normalizedUrl: "zztest_unicode_web" });
    assert.ok(result);
    assert.equal(result!.content, "# 中文标题\n\n数学公式: ∑∫∂");
  });
});
