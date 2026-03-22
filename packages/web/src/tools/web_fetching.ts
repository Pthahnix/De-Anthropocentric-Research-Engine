import type { WebMeta } from "../types.js";
import { normUrl } from "../utils/misc.js";
import * as cache from "../utils/cache.js";
import { defaultApifyClient, type ApifyClient, type ProgressCallback } from "../utils/apify.js";

export interface WebFetchingInput {
  url: string;
  title?: string;
}

/**
 * web_fetching tool: fetch a web page as markdown via Apify rag-web-browser.
 * Cache-first: checks local cache (including cached failures) before network calls.
 */
export async function webFetching(
  input: WebFetchingInput,
  client: ApifyClient = defaultApifyClient,
  onProgress?: ProgressCallback,
): Promise<WebMeta> {
  const normalizedUrl = normUrl(input.url);

  // 1. Check cache — markdown file exists (success cache)
  const cachedPath = cache.loadMarkdownPath(normalizedUrl);
  if (cachedPath) {
    const meta = cache.loadMeta(normalizedUrl);
    if (meta) {
      meta.markdownPath = cachedPath;
      return meta;
    }
    return { url: input.url, normalizedUrl, markdownPath: cachedPath, title: input.title };
  }

  // 2. Check cache — meta JSON exists with fetchFailed (failure cache)
  const cachedMeta = cache.loadMeta(normalizedUrl);
  if (cachedMeta?.fetchFailed) {
    return cachedMeta;
  }

  // 3. Call Apify rag-web-browser
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN environment variable not set");

  const meta: WebMeta = {
    url: input.url,
    normalizedUrl,
    title: input.title,
  };

  try {
    onProgress?.({ message: `Fetching ${input.url} via Apify rag-web-browser` });

    const run = await client.runActor(
      "apify~rag-web-browser",
      { query: input.url, maxResults: 1, outputFormats: ["markdown"] },
      token,
      onProgress,
    );

    const completed = await client.waitForRun(run.id, token, onProgress);
    const items = await client.getDatasetItems(completed.defaultDatasetId, token);

    if (!items.length || !items[0].markdown) {
      meta.fetchFailed = true;
      cache.saveMeta(meta);
      return meta;
    }

    const item = items[0];
    const markdown = item.markdown as string;

    // Extract metadata from Apify response (user-provided title takes priority)
    if (!meta.title && item.metadata?.title) meta.title = item.metadata.title;
    if (item.metadata?.description) meta.description = item.metadata.description;

    // Save to cache
    meta.markdownPath = cache.saveMarkdown(normalizedUrl, markdown);
    cache.saveMeta(meta);
    return meta;

  } catch (e: any) {
    onProgress?.({ message: `Fetch failed for ${input.url}: ${e.message}` });
    meta.fetchFailed = true;
    cache.saveMeta(meta);
    return meta;
  }
}
