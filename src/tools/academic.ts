import type { PaperResult } from "../types.js";
import { normTitle } from "../utils/misc.js";
import * as arxiv from "../utils/arxiv.js";
import * as apify from "../utils/apify.js";
import * as ss from "../utils/ss.js";
import * as markdownUtil from "../utils/markdown.js";
import { title2markdown } from "./markdown.js";
import type { ProgressCallback } from "../utils/pdf.js";

// ── Helpers ─────────────────────────────────────────────────────────

/** Process a batch of papers concurrently (batch size 3). */
async function processBatch(
  papers: PaperResult[],
  onProgress?: ProgressCallback,
): Promise<PaperResult[]> {
  const results: PaperResult[] = [];
  for (let i = 0; i < papers.length; i += 3) {
    const batch = papers.slice(i, i + 3);
    const settled = await Promise.allSettled(
      batch.map(async (p) => {
        // If already has markdown cached, skip
        const cached = markdownUtil.loadPaperMeta(p.normalizedTitle);
        if (cached?.markdownDir) return cached;

        if (p.arxivUrl) {
          const md = await arxiv.content(p.arxivUrl);
          if (md) {
            p.markdownDir = markdownUtil.save(p.title, md);
            markdownUtil.savePaperMeta(p);
            return p;
          }
        }
        // Fallback to title2markdown pipeline
        return title2markdown(p.title, onProgress);
      }),
    );
    for (const s of settled) {
      if (s.status === "fulfilled") results.push(s.value);
    }
    await onProgress?.({
      message: `Processed ${Math.min(i + 3, papers.length)}/${papers.length} papers`,
      current: Math.min(i + 3, papers.length),
      total: papers.length,
    });
  }
  return results;
}

// ── acdSearch ───────────────────────────────────────────────────────

/**
 * Academic search: query Google Scholar → fetch full text for each result.
 * Returns PaperResult[] with markdownDir where content was obtained.
 */
export async function acdSearch(
  query: string,
  onProgress?: ProgressCallback,
): Promise<PaperResult[]> {
  await onProgress?.({ message: `Searching Google Scholar: "${query}"` });
  const papers = await apify.googleScholarSearch(query);
  if (papers.length === 0) return [];
  await onProgress?.({
    message: `Found ${papers.length} papers, fetching full text...`,
  });
  return processBatch(papers, onProgress);
}

// ── dfsSearch ───────────────────────────────────────────────────────

/**
 * Deep reference exploration via DFS.
 * Recursively follows references of a paper up to depth/breadth limits.
 * Returns flat array of all discovered papers.
 */
export async function dfsSearch(
  paper: PaperResult,
  depth: number,
  breadth: number,
  visited: string[] = [],
  onProgress?: ProgressCallback,
): Promise<PaperResult[]> {
  if (depth <= 0) return [];

  const visitedSet = new Set(visited);
  const allFound: PaperResult[] = [];

  // Ensure we have s2Id
  let s2Id = paper.s2Id;
  if (!s2Id) {
    const ssResult = await ss.query(paper.title);
    if (ssResult?.s2Id) {
      s2Id = ssResult.s2Id;
      paper.s2Id = s2Id;
    }
  }
  if (!s2Id) {
    await onProgress?.({ message: `Cannot get S2 ID for "${paper.title}", skipping DFS` });
    return [];
  }

  // Get references
  await onProgress?.({ message: `Fetching references for "${paper.title}" (depth=${depth})` });
  const refs = await ss.references(s2Id);

  // Filter visited and truncate to breadth
  const newRefs = refs
    .filter((r) => !visitedSet.has(r.normalizedTitle))
    .slice(0, breadth);

  if (newRefs.length === 0) return [];

  // Process this level
  await onProgress?.({
    message: `Processing ${newRefs.length} references at depth=${depth}`,
  });
  const processed = await processBatch(newRefs, onProgress);
  for (const p of processed) {
    visitedSet.add(p.normalizedTitle);
    allFound.push(p);
  }

  // Recurse into each reference
  for (const ref of processed) {
    const children = await dfsSearch(
      ref,
      depth - 1,
      breadth,
      [...visitedSet],
      onProgress,
    );
    for (const c of children) {
      visitedSet.add(c.normalizedTitle);
      allFound.push(c);
    }
  }

  return allFound;
}
