import type { PaperResult } from "../types.js";
import { normTitle } from "../utils/misc.js";
import * as arxiv from "../utils/arxiv.js";
import * as ss from "../utils/ss.js";
import * as unpaywall from "../utils/unpaywall.js";
import * as pdf from "../utils/pdf.js";
import * as markdown from "../utils/markdown.js";
import type { ProgressCallback } from "../utils/pdf.js";

/** Detect input type and route to the right pipeline. */
function detectInput(input: {
  title?: string;
  url?: string;
  dir?: string;
}): "arxiv" | "pdf" | "title" {
  const src = input.url ?? input.dir ?? "";
  if (src && /arxiv\.org/i.test(src)) return "arxiv";
  if (src && (/\.pdf$/i.test(src) || input.dir)) return "pdf";
  if (src && /^https?:\/\//i.test(src)) return "pdf"; // generic URL → try PDF
  return "title";
}

/**
 * title2markdown pipeline: arXiv → SS → Unpaywall → PDF fallback.
 * Tries to obtain full markdown for a paper given its title.
 */
export async function title2markdown(
  title: string,
  onProgress?: ProgressCallback,
): Promise<PaperResult> {
  const base: PaperResult = {
    title,
    normalizedTitle: normTitle(title),
  };

  // 1. Try arXiv
  const arxivResult = await arxiv.query(title);
  if (arxivResult?.arxivUrl) {
    Object.assign(base, arxivResult);
    const md = await arxiv.content(arxivResult.arxivUrl);
    if (md) {
      base.markdownDir = markdown.save(base.title, md);
      markdown.savePaperMeta(base);
      return base;
    }
  }

  // 2. Try Semantic Scholar
  const ssResult = await ss.query(title);
  if (ssResult) {
    // Merge SS metadata (don't overwrite arXiv fields if present)
    if (!base.s2Id) base.s2Id = ssResult.s2Id;
    if (!base.doi) base.doi = ssResult.doi;
    if (!base.arxivId) base.arxivId = ssResult.arxivId;
    if (!base.arxivUrl) base.arxivUrl = ssResult.arxivUrl;
    if (!base.year) base.year = ssResult.year;
    if (!base.authors) base.authors = ssResult.authors;
    if (!base.abstract) base.abstract = ssResult.abstract;
    if (!base.citationCount) base.citationCount = ssResult.citationCount;
    if (!base.pdfUrl) base.pdfUrl = ssResult.pdfUrl;
    if (!base.sourceUrl) base.sourceUrl = ssResult.sourceUrl;
  }

  // 2b. If SS found arxivUrl, try arXiv content
  if (base.arxivUrl) {
    const md = await arxiv.content(base.arxivUrl);
    if (md) {
      base.markdownDir = markdown.save(base.title, md);
      markdown.savePaperMeta(base);
      return base;
    }
  }

  // 3. If has DOI, try Unpaywall for OA PDF
  if (base.doi) {
    const upResult = await unpaywall.query(base.doi);
    if (upResult?.pdfUrl) {
      if (!base.pdfUrl) base.pdfUrl = upResult.pdfUrl;
      const md = await pdf.content(upResult.pdfUrl, onProgress);
      if (md) {
        base.markdownDir = markdown.save(base.title, md);
        markdown.savePaperMeta(base);
        return base;
      }
    }
  }

  // 4. If SS had openAccessPdf, try that
  if (base.pdfUrl) {
    const md = await pdf.content(base.pdfUrl, onProgress);
    if (md) {
      base.markdownDir = markdown.save(base.title, md);
      markdown.savePaperMeta(base);
      return base;
    }
  }

  // No full text obtained — still save metadata
  markdown.savePaperMeta(base);
  return base;
}

/**
 * paper_content — MCP tool entry point.
 * Smart routing: arXiv URL → PDF → title pipeline.
 */
export async function paperContent(
  input: { title?: string; url?: string; dir?: string },
  onProgress?: ProgressCallback,
): Promise<PaperResult> {
  const type = detectInput(input);
  const src = input.url ?? input.dir ?? "";

  if (type === "arxiv") {
    const id = arxiv.urlToId(src);
    const arxivUrl = arxiv.idToUrl(id);
    const base: PaperResult = {
      title: input.title ?? "",
      normalizedTitle: normTitle(input.title ?? id),
      arxivId: id,
      arxivUrl,
    };
    // Enrich metadata from arXiv API (by ID, not title search)
    const meta = await arxiv.queryById(id);
    if (meta) Object.assign(base, meta);
    // Get content
    const md = await arxiv.content(arxivUrl);
    if (md) {
      base.markdownDir = markdown.save(base.title, md);
    }
    markdown.savePaperMeta(base);
    return base;
  }

  if (type === "pdf") {
    const base: PaperResult = {
      title: input.title ?? src,
      normalizedTitle: normTitle(input.title ?? src),
      pdfUrl: src.startsWith("http") ? src : undefined,
    };
    const md = await pdf.content(src, onProgress);
    if (md) {
      base.markdownDir = markdown.save(base.title, md);
    }
    markdown.savePaperMeta(base);
    return base;
  }

  // title path
  return title2markdown(input.title!, onProgress);
}
