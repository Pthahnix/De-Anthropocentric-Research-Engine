import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normUrl } from "../../src/utils/misc.js";

describe("normUrl", () => {
  // Protocol stripping
  it("strips https protocol", () => {
    assert.equal(normUrl("https://github.com/foo/bar"), "github_com_foo_bar");
  });

  it("strips http protocol", () => {
    assert.equal(normUrl("http://github.com/foo/bar"), "github_com_foo_bar");
  });

  // Query params and fragments
  it("strips query parameters", () => {
    assert.equal(normUrl("https://example.com/path?q=test&lang=en"), "example_com_path");
  });

  it("strips fragment", () => {
    assert.equal(normUrl("https://example.com/page#section"), "example_com_page");
  });

  it("strips both query and fragment", () => {
    assert.equal(normUrl("https://example.com/path?q=test#section"), "example_com_path");
  });

  // Trailing slash
  it("strips trailing slash", () => {
    assert.equal(normUrl("https://example.com/path/"), "example_com_path");
  });

  // Lowercasing
  it("lowercases the URL", () => {
    assert.equal(normUrl("https://GitHub.COM/Foo/Bar"), "github_com_foo_bar");
  });

  // Non-alphanumeric replacement
  it("replaces dots and slashes with underscores", () => {
    assert.equal(normUrl("https://arxiv.org/html/2503.12434v1"), "arxiv_org_html_2503_12434v1");
  });

  // Collapse multiple underscores
  it("collapses multiple underscores", () => {
    assert.equal(normUrl("https://example.com/a---b///c"), "example_com_a_b_c");
  });

  // Strip leading/trailing underscores
  it("strips leading and trailing underscores", () => {
    assert.equal(normUrl("https:///example.com/"), "example_com");
  });

  // Realistic URLs
  it("normalizes a GitHub repo URL", () => {
    assert.equal(normUrl("https://github.com/anthropics/claude-code"), "github_com_anthropics_claude_code");
  });

  it("normalizes an arXiv HTML URL", () => {
    assert.equal(normUrl("https://arxiv.org/html/2503.12434v1"), "arxiv_org_html_2503_12434v1");
  });

  it("normalizes a Wikipedia URL with query", () => {
    assert.equal(
      normUrl("https://en.wikipedia.org/wiki/Large_language_model?oldid=123"),
      "en_wikipedia_org_wiki_large_language_model",
    );
  });

  it("normalizes a complex blog URL", () => {
    assert.equal(
      normUrl("https://blog.example.com/2024/01/my-post?utm_source=twitter#comments"),
      "blog_example_com_2024_01_my_post",
    );
  });

  // Edge cases
  it("handles URL without protocol", () => {
    assert.equal(normUrl("example.com/path"), "example_com_path");
  });

  it("returns empty string for empty input", () => {
    assert.equal(normUrl(""), "");
  });

  it("handles URL with only protocol", () => {
    assert.equal(normUrl("https://"), "");
  });

  // Dedup guarantee
  it("same URL with/without trailing slash produces same result", () => {
    assert.equal(
      normUrl("https://example.com/path"),
      normUrl("https://example.com/path/"),
    );
  });

  it("same URL with/without protocol produces same result", () => {
    assert.equal(
      normUrl("https://example.com/path"),
      normUrl("http://example.com/path"),
    );
  });

  it("same URL with/without query produces same result", () => {
    assert.equal(
      normUrl("https://example.com/path"),
      normUrl("https://example.com/path?q=test"),
    );
  });
});
