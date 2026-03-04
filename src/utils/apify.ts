import "dotenv/config";
import type { PaperResult } from "../types.js";
import { normTitle } from "./misc.js";

const TOKEN = process.env.TOKEN_APIFY;
const ACTOR = "marco.gullo~google-scholar-scraper";
const ENDPOINT = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items`;

/**
 * Search Google Scholar via Apify actor.
 * Returns PaperResult[] mapped from actor output.
 */
export async function googleScholarSearch(
  query: string,
  maxItems = 10,
): Promise<PaperResult[]> {
  if (!TOKEN) throw new Error("TOKEN_APIFY not set in .env");

  const resp = await fetch(`${ENDPOINT}?token=${TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      keyword: query,
      maxItems,
      proxyOptions: { useApifyProxy: true },
    }),
  });
  if (!resp.ok) throw new Error(`Apify API error: ${resp.status}`);
  const items = (await resp.json()) as any[];
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    const title = item.title ?? "";
    // Try to extract arxivId from URL
    const arxivMatch = (item.link ?? "").match(
      /arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5})/i,
    );
    const arxivId = arxivMatch ? arxivMatch[1] : undefined;
    // Parse year from string like "2024" or "… - 2024 - …"
    const yearMatch = String(item.year ?? "").match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : undefined;

    return {
      title,
      normalizedTitle: normTitle(title),
      arxivId,
      arxivUrl: arxivId ? `https://arxiv.org/abs/${arxivId}` : undefined,
      year,
      authors: item.authors ?? undefined,
      abstract: item.searchMatch ?? undefined,
      citationCount: item.citations != null ? Number(item.citations) : undefined,
      pdfUrl: item.documentLink ?? undefined,
      sourceUrl: item.link ?? undefined,
    } satisfies PaperResult;
  });
}
