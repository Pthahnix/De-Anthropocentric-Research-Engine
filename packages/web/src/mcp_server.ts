import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { webFetching } from "./tools/web_fetching.js";
import { webContent } from "./tools/web_content.js";
import type { ProgressCallback } from "./utils/apify.js";

const server = new McpServer({
  name: "neocortica-web",
  version: "0.1.0",
});

// ── Helper ───────────────────────────────────────────────────────

function makeProgress(_extra: any): ProgressCallback {
  return async (info) => {
    try { await server.sendLoggingMessage({ level: "info", data: info.message }); } catch {}
  };
}

// ── Tool 1: web_fetching ─────────────────────────────────────────

server.tool(
  "web_fetching",
  "Fetch web page as markdown and cache locally. " +
  "Uses Apify rag-web-browser REST API. Cache-first: returns instantly if already cached. " +
  "Returns WebMeta with markdownPath on success, fetchFailed on failure.",
  {
    url: z.string().describe("URL to fetch"),
    title: z.string().optional().describe("Page title if known (e.g., from Brave search results)"),
  },
  async (args, extra: any) => {
    try {
      const result = await webFetching(args, undefined, makeProgress(extra));
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    } catch (e: any) {
      return { isError: true, content: [{ type: "text" as const, text: `web_fetching failed: ${e.message}` }] };
    }
  },
);

// ── Tool 2: web_content ──────────────────────────────────────────

server.tool(
  "web_content",
  "Read cached web page markdown (local only, no network). " +
  "Returns page content if cached, error message if not found.",
  {
    url: z.string().optional().describe("Original URL (converted to cache key via normUrl)"),
    normalizedUrl: z.string().optional().describe("Normalized URL for direct cache lookup"),
  },
  async (args) => {
    try {
      const result = webContent(args);
      if (!result) {
        return { content: [{ type: "text" as const, text: "Page not found in cache." }] };
      }
      return { content: [{ type: "text" as const, text: result.content }] };
    } catch (e: any) {
      return { isError: true, content: [{ type: "text" as const, text: `web_content failed: ${e.message}` }] };
    }
  },
);

// ── Start ────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
