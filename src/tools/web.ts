import type { WebResult } from "../types.js";
import { normTitle } from "../utils/misc.js";
import * as brave from "../utils/brave.js";
import * as web from "../utils/web.js";
import * as markdown from "../utils/markdown.js";

/** Search the web via Brave Search. Returns result list without content. */
export async function webSearch(
  query: string,
  count?: number,
): Promise<WebResult[]> {
  return brave.search(query, count);
}

/** Fetch a web page as markdown and cache it. */
export async function webContent(
  url: string,
  title?: string,
): Promise<WebResult> {
  const md = await web.content(url);
  const pageTitle = title || url;
  const result: WebResult = {
    title: pageTitle,
    normalizedTitle: normTitle(pageTitle),
    url,
  };
  if (md) {
    result.markdownDir = markdown.saveWeb(pageTitle, md);
  }
  return result;
}
