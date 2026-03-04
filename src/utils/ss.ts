import "dotenv/config";
import type { PaperResult } from "../types.js";
import { normTitle } from "./misc.js";

const BASE = "https://api.semanticscholar.org/graph/v1";
const FIELDS =
  "title,year,authors,abstract,citationCount,externalIds,openAccessPdf,url";

async function fetchJson(url: string): Promise<any> {
  const resp = await fetch(url);
  if (!resp.ok) return null;
  return resp.json();
}

function mapPaper(p: any): PaperResult | null {
  if (!p || !p.title) return null;
  const exIds = p.externalIds ?? {};
  const arxivId = exIds.ArXiv ?? undefined;
  const doi = exIds.DOI ?? undefined;
  const authors = Array.isArray(p.authors)
    ? p.authors.map((a: any) => a.name).join(", ")
    : undefined;
  return {
    title: p.title,
    normalizedTitle: normTitle(p.title),
    arxivId,
    doi,
    s2Id: p.paperId ?? undefined,
    year: p.year ?? undefined,
    authors,
    abstract: p.abstract ?? undefined,
    citationCount: p.citationCount ?? undefined,
    arxivUrl: arxivId ? `https://arxiv.org/abs/${arxivId}` : undefined,
    pdfUrl: p.openAccessPdf?.url ?? undefined,
    sourceUrl: p.url ?? undefined,
  };
}

/** Find a paper by title using Semantic Scholar search/match. */
export async function query(title: string): Promise<PaperResult | null> {
  const url = `${BASE}/paper/search/match?query=${encodeURIComponent(title)}&fields=${FIELDS}`;
  const data = await fetchJson(url);
  if (!data?.data?.[0]) return null;
  return mapPaper(data.data[0]);
}

/** Get references of a paper by its Semantic Scholar ID. */
export async function references(s2Id: string): Promise<PaperResult[]> {
  const url = `${BASE}/paper/${s2Id}/references?fields=${FIELDS}&limit=100`;
  const data = await fetchJson(url);
  if (!data?.data) return [];
  return data.data
    .map((r: any) => mapPaper(r.citedPaper))
    .filter((p: PaperResult | null): p is PaperResult => p !== null);
}
