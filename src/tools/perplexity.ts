import type { PplxResult, PplxSearchResult } from "../types.js";
import * as pplx from "../utils/perplexity.js";

/** pplx_search: Quick web/academic search via Perplexity Search API. */
export async function pplxSearch(
  query: string,
  options?: pplx.SearchOptions,
): Promise<PplxSearchResult[]> {
  return pplx.search(query, options);
}

/** pplx_ask: Ask a question via Sonar Chat API. Returns answer + citations. */
export async function pplxAsk(
  question: string,
  options?: {
    model?: string;
    search_mode?: "web" | "academic" | "sec";
    search_context_size?: "low" | "medium" | "high";
  },
): Promise<PplxResult> {
  const resp = await pplx.chat(
    [{ role: "user", content: question }],
    {
      model: options?.model ?? "sonar-pro",
      search_mode: options?.search_mode,
      search_context_size: options?.search_context_size ?? "high",
    },
  );
  return {
    answer: resp.answer,
    citations: resp.citations,
    searchResults: [],
  };
}

/** pplx_pro_research: Multi-step research via sonar-pro with high context. */
export async function pplxProResearch(
  question: string,
  systemPrompt?: string,
): Promise<PplxResult> {
  const messages: pplx.ChatMessage[] = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: question });

  const resp = await pplx.chat(messages, {
    model: "sonar-pro",
    search_context_size: "high",
  });
  return {
    answer: resp.answer,
    citations: resp.citations,
    searchResults: [],
  };
}

/** pplx_deep_research: Async deep research via sonar-deep-research. Polls until complete. */
export async function pplxDeepResearch(
  question: string,
  options?: { timeout_ms?: number; poll_interval_ms?: number },
): Promise<PplxResult> {
  const timeout = options?.timeout_ms ?? 10 * 60 * 1000;
  const interval = options?.poll_interval_ms ?? 5000;

  const requestId = await pplx.asyncChat(
    [{ role: "user", content: question }],
    { model: "sonar-deep-research" },
  );

  const start = Date.now();
  let result = await pplx.getAsyncResult(requestId);

  while (result.status === "IN_PROGRESS" && Date.now() - start < timeout) {
    await new Promise((r) => setTimeout(r, interval));
    result = await pplx.getAsyncResult(requestId);
  }

  if (result.status !== "COMPLETED") {
    throw new Error(`Deep research timed out after ${timeout}ms (id: ${requestId})`);
  }

  return {
    answer: result.answer,
    citations: result.citations,
    searchResults: [],
  };
}
