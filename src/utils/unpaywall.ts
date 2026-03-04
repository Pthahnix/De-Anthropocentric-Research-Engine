import "dotenv/config";
import type { PaperResult } from "../types.js";
import { normTitle } from "./misc.js";

const EMAIL = process.env.EMAIL_UNPAYWALL;

/** Query Unpaywall by DOI. Returns PaperResult with pdfUrl if OA available. */
export async function query(doi: string): Promise<PaperResult | null> {
  if (!EMAIL) throw new Error("EMAIL_UNPAYWALL not set in .env");
  const url = `https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=${EMAIL}`;
  const resp = await fetch(url);
  if (!resp.ok) return null;
  const data = (await resp.json()) as any;
  const pdfUrl = data.best_oa_location?.url_for_pdf ?? undefined;
  if (!pdfUrl) return null;
  const authors = Array.isArray(data.z_authors)
    ? data.z_authors
        .map((a: any) => [a.given, a.family].filter(Boolean).join(" "))
        .join(", ")
    : undefined;
  return {
    title: data.title ?? "",
    normalizedTitle: normTitle(data.title ?? ""),
    doi,
    year: data.year ?? undefined,
    authors,
    pdfUrl,
    sourceUrl: data.doi_url ?? undefined,
  };
}
