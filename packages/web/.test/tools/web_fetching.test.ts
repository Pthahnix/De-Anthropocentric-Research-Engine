import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { unlinkSync } from "fs";
import { resolve } from "path";
import { webFetching } from "../../src/tools/web_fetching.js";
import type { WebMeta } from "../../src/types.js";
import type { ApifyClient } from "../../src/utils/apify.js";

const cacheDir = process.env.DARE_CACHE || ".cache";

function cleanupTestFiles(normalizedUrls: string[]) {
  for (const nu of normalizedUrls) {
    const mdPath = resolve(cacheDir, "web", `${nu}.md`);
    const metaPath = resolve(cacheDir, "web", `${nu}.json`);
    try { unlinkSync(mdPath); } catch {}
    try { unlinkSync(metaPath); } catch {}
  }
}

/** Create a fake ApifyClient that returns preset markdown content. */
function fakeApifyClient(markdown: string, title?: string, description?: string): ApifyClient {
  return {
    async runActor() {
      return { id: "run-test", status: "READY", defaultDatasetId: "ds-test" };
    },
    async waitForRun() {
      return { id: "run-test", status: "SUCCEEDED", defaultDatasetId: "ds-test" };
    },
    async getDatasetItems() {
      return [{
        metadata: { title: title ?? "Test Page", description: description ?? "A test page" },
        markdown,
      }];
    },
  };
}

/** Create a fake ApifyClient that always fails. */
function failingApifyClient(errorMessage?: string): ApifyClient {
  return {
    async runActor() {
      throw new Error(errorMessage ?? "Apify actor failed");
    },
    async waitForRun() {
      throw new Error("should not be called");
    },
    async getDatasetItems() {
      throw new Error("should not be called");
    },
  };
}

/** Create a fake ApifyClient that returns empty results. */
function emptyApifyClient(): ApifyClient {
  return {
    async runActor() {
      return { id: "run-empty", status: "READY", defaultDatasetId: "ds-empty" };
    },
    async waitForRun() {
      return { id: "run-empty", status: "SUCCEEDED", defaultDatasetId: "ds-empty" };
    },
    async getDatasetItems() {
      return [];
    },
  };
}

describe("web_fetching", () => {
  const testUrls: string[] = [];

  afterEach(() => {
    cleanupTestFiles(testUrls);
    testUrls.length = 0;
  });

  it("fetches a page and caches markdown + meta", async () => {
    testUrls.push("zztest_example_com_fetching");
    const result = await webFetching(
      { url: "https://zztest-example.com/fetching", title: "Test Page" },
      fakeApifyClient("# Test Page\n\nSome content here."),
    );
    assert.equal(result.url, "https://zztest-example.com/fetching");
    assert.equal(result.normalizedUrl, "zztest_example_com_fetching");
    assert.ok(result.markdownPath);
    assert.ok(result.markdownPath!.endsWith("zztest_example_com_fetching.md"));
    assert.equal(result.fetchFailed, undefined);
    assert.equal(result.title, "Test Page");
  });

  it("returns cache hit without calling Apify", async () => {
    testUrls.push("zztest_cached_hit_page");
    // First call: populate cache
    await webFetching(
      { url: "https://zztest-cached-hit.page/" },
      fakeApifyClient("# Cached Page"),
    );
    // Second call: should hit cache, not Apify
    const calledApify = { called: false };
    const result = await webFetching(
      { url: "https://zztest-cached-hit.page/" },
      {
        async runActor() { calledApify.called = true; throw new Error("should not call"); },
        async waitForRun() { throw new Error("should not call"); },
        async getDatasetItems() { throw new Error("should not call"); },
      },
    );
    assert.equal(calledApify.called, false);
    assert.ok(result.markdownPath);
  });

  it("returns fetchFailed=true when Apify fails", async () => {
    testUrls.push("zztest_failing_page");
    const result = await webFetching(
      { url: "https://zztest-failing.page/" },
      failingApifyClient("anti-scrape blocked"),
    );
    assert.equal(result.fetchFailed, true);
    assert.equal(result.markdownPath, undefined);
  });

  it("returns fetchFailed=true when Apify returns empty results", async () => {
    testUrls.push("zztest_empty_result_page");
    const result = await webFetching(
      { url: "https://zztest-empty-result.page/" },
      emptyApifyClient(),
    );
    assert.equal(result.fetchFailed, true);
  });

  it("returns cached fetchFailed meta on second call (no retry)", async () => {
    testUrls.push("zztest_cached_fail_page");
    // First call: fails
    await webFetching(
      { url: "https://zztest-cached-fail.page/" },
      failingApifyClient(),
    );
    // Second call: should return cached failure
    const result = await webFetching(
      { url: "https://zztest-cached-fail.page/" },
      failingApifyClient("should not be called"),
    );
    assert.equal(result.fetchFailed, true);
  });

  it("extracts title from Apify response when not provided", async () => {
    testUrls.push("zztest_auto_title_page");
    const result = await webFetching(
      { url: "https://zztest-auto-title.page/" },
      fakeApifyClient("# Content", "Auto Discovered Title", "Page desc"),
    );
    assert.equal(result.title, "Auto Discovered Title");
    assert.equal(result.description, "Page desc");
  });

  it("prefers user-provided title over Apify response", async () => {
    testUrls.push("zztest_user_title_page");
    const result = await webFetching(
      { url: "https://zztest-user-title.page/", title: "User Provided" },
      fakeApifyClient("# Content", "Apify Title"),
    );
    assert.equal(result.title, "User Provided");
  });

  // ── Simulation ────────────────────────────────────────────────

  describe("simulation: batch fetch of 3 URLs from a Brave search", () => {
    it("processes 3 URLs sequentially, 2 succeed, 1 fails", async () => {
      const urls = [
        "zztest_batch_github_com_repo",
        "zztest_batch_blog_com_post",
        "zztest_batch_blocked_com_page",
      ];
      testUrls.push(...urls);

      const clients: Record<string, ApifyClient> = {
        "https://zztest-batch-github.com/repo": fakeApifyClient("# GitHub Repo\n\nREADME content", "GitHub Repo"),
        "https://zztest-batch-blog.com/post": fakeApifyClient("# Blog Post\n\nGreat article", "Blog Post"),
        "https://zztest-batch-blocked.com/page": failingApifyClient("403 Forbidden"),
      };

      const results: WebMeta[] = [];
      for (const [url, client] of Object.entries(clients)) {
        results.push(await webFetching({ url }, client));
      }

      // 2 succeeded
      assert.ok(results[0].markdownPath);
      assert.equal(results[0].title, "GitHub Repo");
      assert.ok(results[1].markdownPath);
      assert.equal(results[1].title, "Blog Post");

      // 1 failed
      assert.equal(results[2].fetchFailed, true);
      assert.equal(results[2].markdownPath, undefined);
    });
  });
});
