import { readFileSync } from "fs";
import { normUrl } from "../utils/misc.js";
import { loadMarkdownPath } from "../utils/cache.js";

export interface WebContentQuery {
  url?: string;
  normalizedUrl?: string;
}

export interface WebContentResult {
  content: string;
  markdownPath: string;
}

/** Read cached web page markdown. Pure local, no network. */
export function webContent(query: WebContentQuery): WebContentResult | null {
  const nu = query.normalizedUrl ?? (query.url ? normUrl(query.url) : "");
  if (!nu) return null;

  const markdownPath = loadMarkdownPath(nu);
  if (!markdownPath) return null;

  const content = readFileSync(markdownPath, "utf-8");
  return { content, markdownPath };
}
