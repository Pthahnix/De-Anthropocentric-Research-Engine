import "dotenv/config";
import type { WebResult } from "../types.js";
import { normTitle } from "./misc.js";

const API_KEY = process.env.API_KEY_BRAVE;
const ENDPOINT = "https://api.search.brave.com/res/v1/web/search";

/** Search the web via Brave Search API. */
export async function search(
  query: string,
  count = 10,
): Promise<WebResult[]> {
  if (!API_KEY) throw new Error("API_KEY_BRAVE not set in .env");

  const params = new URLSearchParams({ q: query, count: String(count) });
  const resp = await fetch(`${ENDPOINT}?${params}`, {
    headers: { "X-Subscription-Token": API_KEY },
  });
  if (!resp.ok) throw new Error(`Brave API error: ${resp.status}`);

  const data = (await resp.json()) as any;
  const results = data.web?.results ?? [];

  return results.map((r: any) => ({
    title: r.title ?? "",
    normalizedTitle: normTitle(r.title ?? ""),
    url: r.url ?? "",
    description: r.description ?? undefined,
  }));
}
