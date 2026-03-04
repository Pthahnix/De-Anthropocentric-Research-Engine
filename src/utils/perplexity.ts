import "dotenv/config";
import type { PplxSearchResult } from "../types.js";

const API_KEY = process.env.API_KEY_PERPLEXITY;
const BASE_URL = "https://api.perplexity.ai";

export function headers() {
  if (!API_KEY) throw new Error("API_KEY_PERPLEXITY not set in .env");
  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
}

// ── Search API ──────────────────────────────────────────────────────

export interface SearchOptions {
  search_domain_filter?: string[];
  search_language_filter?: string[];
  country?: string;
  max_results?: number;
  max_tokens_per_page?: number;
  max_tokens?: number;
}

export async function search(
  query: string,
  options?: SearchOptions,
): Promise<PplxSearchResult[]> {
  const body: Record<string, unknown> = { query };
  if (options?.search_domain_filter) body.search_domain_filter = options.search_domain_filter;
  if (options?.search_language_filter) body.search_language_filter = options.search_language_filter;
  if (options?.country) body.country = options.country;
  if (options?.max_results) body.max_results = options.max_results;
  if (options?.max_tokens_per_page) body.max_tokens_per_page = options.max_tokens_per_page;
  if (options?.max_tokens) body.max_tokens = options.max_tokens;

  const resp = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Perplexity Search API error ${resp.status}: ${text}`);
  }

  const data = (await resp.json()) as any;
  const results: PplxSearchResult[] = (data.results ?? []).map((r: any) => ({
    title: r.title ?? "",
    url: r.url ?? "",
    snippet: r.snippet ?? r.description ?? "",
    date: r.date ?? undefined,
  }));
  return results;
}

// ── Chat Completions API ────────────────────────────────────────────

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  model?: string;
  search_context_size?: "low" | "medium" | "high";
  search_mode?: "web" | "academic" | "sec";
  search_type?: "auto" | "pro";
  response_format?: { type: "json_schema"; json_schema: unknown };
  reasoning_effort?: "low" | "medium" | "high";
}

export interface ChatResponse {
  answer: string;
  citations: string[];
}

export async function chat(
  messages: ChatMessage[],
  options?: ChatOptions,
): Promise<ChatResponse> {
  const model = options?.model ?? "sonar-pro";
  const body: Record<string, unknown> = { model, messages };
  if (options?.search_context_size) body.search_context_size = options.search_context_size;
  if (options?.search_mode) body.search_mode = options.search_mode;
  if (options?.search_type) body.search_type = options.search_type;
  if (options?.response_format) body.response_format = options.response_format;
  if (options?.reasoning_effort) body.reasoning_effort = options.reasoning_effort;

  const resp = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Perplexity Chat API error ${resp.status}: ${text}`);
  }

  const data = (await resp.json()) as any;
  const choice = data.choices?.[0];
  return {
    answer: choice?.message?.content ?? "",
    citations: data.citations ?? [],
  };
}

// ── Async Chat Completions API ──────────────────────────────────────

export interface AsyncResult {
  status: "COMPLETED" | "IN_PROGRESS";
  answer: string;
  citations: string[];
}

export async function asyncChat(
  messages: ChatMessage[],
  options?: ChatOptions,
): Promise<string> {
  const model = options?.model ?? "sonar-deep-research";
  const request: Record<string, unknown> = { model, messages };
  if (options?.search_context_size) request.search_context_size = options.search_context_size;
  if (options?.reasoning_effort) request.reasoning_effort = options.reasoning_effort;

  const resp = await fetch(`${BASE_URL}/async/chat/completions`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ request }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Perplexity Async API error ${resp.status}: ${text}`);
  }

  const data = (await resp.json()) as any;
  const requestId = data.id;
  if (!requestId) throw new Error("No request ID returned from async API");
  return requestId;
}

export async function getAsyncResult(requestId: string): Promise<AsyncResult> {
  const resp = await fetch(`${BASE_URL}/async/chat/completions/${requestId}`, {
    method: "GET",
    headers: headers(),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Perplexity Async GET error ${resp.status}: ${text}`);
  }

  const data = (await resp.json()) as any;
  const status = data.status ?? "COMPLETED";
  if (status !== "COMPLETED") {
    return { status: "IN_PROGRESS", answer: "", citations: [] };
  }

  const response = data.response;
  const choice = response?.choices?.[0];
  return {
    status: "COMPLETED",
    answer: choice?.message?.content ?? "",
    citations: response?.citations ?? [],
  };
}
