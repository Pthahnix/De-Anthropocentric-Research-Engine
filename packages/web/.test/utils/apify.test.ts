import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { runActor, waitForRun, getDatasetItems } from "../../src/utils/apify.js";

// Save original fetch to restore after tests
const originalFetch = globalThis.fetch;

function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  globalThis.fetch = handler as any;
}

describe("apify", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  // ── runActor ──────────────────────────────────────────────────

  describe("runActor", () => {
    it("starts an actor run and returns run info", async () => {
      mockFetch(async (url, init) => {
        assert.ok(url.includes("/v2/acts/apify~rag-web-browser/runs"));
        assert.equal(init?.method, "POST");
        const headers = init?.headers as Record<string, string>;
        assert.ok(headers?.["Authorization"]?.includes("Bearer test-token"));
        const body = JSON.parse(init?.body as string);
        assert.equal(body.query, "https://example.com");
        return new Response(JSON.stringify({
          data: {
            id: "run-123",
            status: "READY",
            defaultDatasetId: "ds-456",
          },
        }), { status: 201 });
      });

      const result = await runActor(
        "apify~rag-web-browser",
        { query: "https://example.com", maxResults: 1, outputFormats: ["markdown"] },
        "test-token",
      );
      assert.equal(result.id, "run-123");
      assert.equal(result.status, "READY");
      assert.equal(result.defaultDatasetId, "ds-456");
    });

    it("throws on non-2xx response", async () => {
      mockFetch(async () => new Response("Unauthorized", { status: 401 }));
      await assert.rejects(
        () => runActor("apify~rag-web-browser", {}, "bad-token"),
        { message: /401/ },
      );
    });
  });

  // ── waitForRun ────────────────────────────────────────────────

  describe("waitForRun", () => {
    it("returns immediately when run already SUCCEEDED", async () => {
      mockFetch(async () => new Response(JSON.stringify({
        data: { id: "run-123", status: "SUCCEEDED", defaultDatasetId: "ds-456" },
      })));

      const result = await waitForRun("run-123", "test-token", undefined, 100, 5000);
      assert.equal(result.status, "SUCCEEDED");
    });

    it("polls until SUCCEEDED", async () => {
      let callCount = 0;
      mockFetch(async () => {
        callCount++;
        const status = callCount >= 3 ? "SUCCEEDED" : "RUNNING";
        return new Response(JSON.stringify({
          data: { id: "run-123", status, defaultDatasetId: "ds-456" },
        }));
      });

      const result = await waitForRun("run-123", "test-token", undefined, 50, 5000);
      assert.equal(result.status, "SUCCEEDED");
      assert.ok(callCount >= 3);
    });

    it("throws on FAILED status", async () => {
      mockFetch(async () => new Response(JSON.stringify({
        data: { id: "run-123", status: "FAILED", defaultDatasetId: "ds-456" },
      })));

      await assert.rejects(
        () => waitForRun("run-123", "test-token", undefined, 100, 5000),
        { message: /FAILED/ },
      );
    });

    it("throws on ABORTED status", async () => {
      mockFetch(async () => new Response(JSON.stringify({
        data: { id: "run-123", status: "ABORTED", defaultDatasetId: "ds-456" },
      })));

      await assert.rejects(
        () => waitForRun("run-123", "test-token", undefined, 100, 5000),
        { message: /ABORTED/ },
      );
    });

    it("throws on timeout", async () => {
      mockFetch(async () => new Response(JSON.stringify({
        data: { id: "run-123", status: "RUNNING", defaultDatasetId: "ds-456" },
      })));

      await assert.rejects(
        () => waitForRun("run-123", "test-token", undefined, 50, 200),
        { message: /timeout/i },
      );
    });
  });

  // ── getDatasetItems ───────────────────────────────────────────

  describe("getDatasetItems", () => {
    it("returns dataset items array", async () => {
      const fakeItems = [
        {
          crawl: { httpStatusCode: 200 },
          metadata: { title: "Example Page", description: "A test page" },
          markdown: "# Example\n\nThis is the page content.",
        },
      ];
      mockFetch(async (url) => {
        assert.ok(url.includes("/v2/datasets/ds-456/items"));
        return new Response(JSON.stringify(fakeItems));
      });

      const items = await getDatasetItems("ds-456", "test-token");
      assert.equal(items.length, 1);
      assert.equal(items[0].markdown, "# Example\n\nThis is the page content.");
      assert.equal(items[0].metadata.title, "Example Page");
    });

    it("returns empty array for empty dataset", async () => {
      mockFetch(async () => new Response(JSON.stringify([])));
      const items = await getDatasetItems("ds-empty", "test-token");
      assert.equal(items.length, 0);
    });

    it("throws on non-2xx response", async () => {
      mockFetch(async () => new Response("Not Found", { status: 404 }));
      await assert.rejects(
        () => getDatasetItems("ds-bad", "test-token"),
        { message: /404/ },
      );
    });
  });

  // ── Simulation: full actor lifecycle ──────────────────────────

  describe("simulation: full rag-web-browser lifecycle", () => {
    it("simulates start → poll → get items for a real URL", async () => {
      let phase = "start";
      let pollCount = 0;

      mockFetch(async (url, init) => {
        if (phase === "start" && url.includes("/runs") && init?.method === "POST") {
          phase = "poll";
          return new Response(JSON.stringify({
            data: { id: "run-abc", status: "READY", defaultDatasetId: "ds-xyz" },
          }), { status: 201 });
        }
        if (phase === "poll" && url.includes("/actor-runs/run-abc")) {
          pollCount++;
          const status = pollCount >= 2 ? "SUCCEEDED" : "RUNNING";
          return new Response(JSON.stringify({
            data: { id: "run-abc", status, defaultDatasetId: "ds-xyz" },
          }));
        }
        if (url.includes("/datasets/ds-xyz/items")) {
          return new Response(JSON.stringify([{
            crawl: { httpStatusCode: 200, loadedAt: "2026-03-15T10:00:00Z" },
            metadata: {
              title: "Claude Code - GitHub",
              description: "An AI-powered CLI for software development",
              url: "https://github.com/anthropics/claude-code",
            },
            markdown: "# Claude Code\n\nAn AI-powered command-line interface...",
          }]));
        }
        return new Response("Unexpected request", { status: 500 });
      });

      // Step 1: Start actor
      const run = await runActor(
        "apify~rag-web-browser",
        { query: "https://github.com/anthropics/claude-code", maxResults: 1, outputFormats: ["markdown"] },
        "test-token",
      );
      assert.equal(run.id, "run-abc");

      // Step 2: Poll until done
      const completed = await waitForRun(run.id, "test-token", undefined, 50, 5000);
      assert.equal(completed.status, "SUCCEEDED");

      // Step 3: Get items
      const items = await getDatasetItems(completed.defaultDatasetId, "test-token");
      assert.equal(items.length, 1);
      assert.ok(items[0].markdown.includes("Claude Code"));
      assert.equal(items[0].metadata.title, "Claude Code - GitHub");
    });
  });
});
