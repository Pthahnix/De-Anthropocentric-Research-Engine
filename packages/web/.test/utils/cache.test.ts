import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, unlinkSync } from "fs";
import { resolve } from "path";
import { saveMarkdown, saveMeta, loadMeta, loadMarkdownPath } from "../../src/utils/cache.js";
import type { WebMeta } from "../../src/types.js";

const cacheDir = process.env.DARE_CACHE || ".cache";

function cleanupTestFiles(normalizedUrls: string[]) {
  for (const nu of normalizedUrls) {
    const mdPath = resolve(cacheDir, "web", `${nu}.md`);
    const metaPath = resolve(cacheDir, "web", `${nu}.json`);
    try { unlinkSync(mdPath); } catch {}
    try { unlinkSync(metaPath); } catch {}
  }
}

describe("cache", () => {
  const testUrls: string[] = [];

  afterEach(() => {
    cleanupTestFiles(testUrls);
    testUrls.length = 0;
  });

  // ── saveMarkdown ──────────────────────────────────────────────

  describe("saveMarkdown", () => {
    it("saves markdown and returns absolute path", () => {
      testUrls.push("zztest_example_com_page");
      const path = saveMarkdown("zztest_example_com_page", "# Hello World");
      assert.ok(path.endsWith(".md"));
      assert.ok(existsSync(path));
      assert.equal(readFileSync(path, "utf-8"), "# Hello World");
    });

    it("overwrites existing file", () => {
      testUrls.push("zztest_overwrite_md");
      saveMarkdown("zztest_overwrite_md", "version 1");
      const path = saveMarkdown("zztest_overwrite_md", "version 2");
      assert.equal(readFileSync(path, "utf-8"), "version 2");
    });

    it("handles large markdown content", () => {
      testUrls.push("zztest_big_page");
      const bigContent = "# Page\n" + "Lorem ipsum dolor. ".repeat(10000);
      const path = saveMarkdown("zztest_big_page", bigContent);
      assert.equal(readFileSync(path, "utf-8"), bigContent);
    });

    it("handles unicode content", () => {
      testUrls.push("zztest_unicode_page");
      const content = "# 网页标题\n\nMathematical: ∑∫∂";
      const path = saveMarkdown("zztest_unicode_page", content);
      assert.equal(readFileSync(path, "utf-8"), content);
    });
  });

  // ── saveMeta / loadMeta ───────────────────────────────────────

  describe("saveMeta + loadMeta", () => {
    it("round-trips full WebMeta with all fields", () => {
      testUrls.push("zztest_github_com_full");
      const fullMeta: WebMeta = {
        url: "https://github.com/full",
        normalizedUrl: "zztest_github_com_full",
        title: "GitHub Full Page",
        description: "A full page description",
        snippet: "Some snippet text...",
        markdownPath: "/some/path/to/page.md",
      };
      saveMeta(fullMeta);
      const loaded = loadMeta("zztest_github_com_full");
      assert.deepEqual(loaded, fullMeta);
    });

    it("round-trips minimal WebMeta", () => {
      testUrls.push("zztest_minimal_page");
      const minimal: WebMeta = {
        url: "https://example.com/minimal",
        normalizedUrl: "zztest_minimal_page",
      };
      saveMeta(minimal);
      const loaded = loadMeta("zztest_minimal_page");
      assert.deepEqual(loaded, minimal);
    });

    it("round-trips WebMeta with fetchFailed=true", () => {
      testUrls.push("zztest_failed_page");
      const failed: WebMeta = {
        url: "https://blocked.com/page",
        normalizedUrl: "zztest_failed_page",
        fetchFailed: true,
      };
      saveMeta(failed);
      const loaded = loadMeta("zztest_failed_page");
      assert.deepEqual(loaded, failed);
      assert.equal(loaded?.fetchFailed, true);
    });

    it("returns null for nonexistent meta", () => {
      assert.equal(loadMeta("zztest_does_not_exist_99999"), null);
    });

    it("overwrites existing meta", () => {
      testUrls.push("zztest_overwrite_meta");
      const v1: WebMeta = { url: "https://example.com/v1", normalizedUrl: "zztest_overwrite_meta", title: "V1" };
      const v2: WebMeta = { url: "https://example.com/v1", normalizedUrl: "zztest_overwrite_meta", title: "V2" };
      saveMeta(v1);
      saveMeta(v2);
      const loaded = loadMeta("zztest_overwrite_meta");
      assert.equal(loaded?.title, "V2");
    });
  });

  // ── loadMarkdownPath ──────────────────────────────────────────

  describe("loadMarkdownPath", () => {
    it("returns path when markdown exists", () => {
      testUrls.push("zztest_cached_page");
      const saved = saveMarkdown("zztest_cached_page", "# content");
      const found = loadMarkdownPath("zztest_cached_page");
      assert.equal(found, saved);
    });

    it("returns null when markdown does not exist", () => {
      assert.equal(loadMarkdownPath("zztest_nonexistent_99999"), null);
    });
  });

  // ── Simulation: realistic workflow ────────────────────────────

  describe("simulation: web search → cache workflow", () => {
    it("simulates caching 4 web pages from a Brave search", () => {
      const urls = [
        "zztest_sim_github_com_anthropics",
        "zztest_sim_blog_example_com_post",
        "zztest_sim_docs_python_org_tutorial",
        "zztest_sim_en_wikipedia_org_llm",
      ];
      testUrls.push(...urls);

      const pages: WebMeta[] = [
        {
          url: "https://github.com/anthropics/claude-code",
          normalizedUrl: "zztest_sim_github_com_anthropics",
          title: "anthropics/claude-code",
          description: "Claude Code CLI",
          snippet: "An AI-powered CLI for software development...",
        },
        {
          url: "https://blog.example.com/post/llm-guide",
          normalizedUrl: "zztest_sim_blog_example_com_post",
          title: "LLM Guide",
          snippet: "A comprehensive guide to large language models...",
        },
        {
          url: "https://docs.python.org/3/tutorial/",
          normalizedUrl: "zztest_sim_docs_python_org_tutorial",
          title: "Python Tutorial",
          description: "Official Python tutorial",
        },
        {
          url: "https://en.wikipedia.org/wiki/Large_language_model",
          normalizedUrl: "zztest_sim_en_wikipedia_org_llm",
          title: "Large language model - Wikipedia",
          fetchFailed: true,
        },
      ];

      // Save all meta (including failed one)
      for (const p of pages) saveMeta(p);

      // Save markdown for 2 (simulating successful fetch)
      saveMarkdown(pages[0].normalizedUrl, "# Claude Code\n\nAn AI-powered CLI...");
      saveMarkdown(pages[2].normalizedUrl, "# Python Tutorial\n\nThe Python tutorial...");

      // Verify all meta loadable
      for (const p of pages) {
        const loaded = loadMeta(p.normalizedUrl);
        assert.ok(loaded, `Meta for "${p.url}" should be loadable`);
        assert.equal(loaded.url, p.url);
      }

      // Verify only 2 have cached markdown
      assert.ok(loadMarkdownPath("zztest_sim_github_com_anthropics"));
      assert.equal(loadMarkdownPath("zztest_sim_blog_example_com_post"), null);
      assert.ok(loadMarkdownPath("zztest_sim_docs_python_org_tutorial"));
      assert.equal(loadMarkdownPath("zztest_sim_en_wikipedia_org_llm"), null);

      // Verify failed page meta has fetchFailed
      const failedMeta = loadMeta("zztest_sim_en_wikipedia_org_llm");
      assert.equal(failedMeta?.fetchFailed, true);
    });
  });
});
