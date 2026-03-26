import { resolve } from "path";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import type { WebMeta } from "../types.js";

function cacheDir(): string {
  return resolve(process.env.DARE_CACHE || ".cache");
}

/** Ensure CACHE/web/ directory exists. Returns the web cache path. */
export function ensureDirs(): string {
  const web = resolve(cacheDir(), "web");
  mkdirSync(web, { recursive: true });
  return web;
}

/** Save markdown content to CACHE/web/{normalizedUrl}.md. Returns absolute path. */
export function saveMarkdown(normalizedUrl: string, markdown: string): string {
  const dir = ensureDirs();
  const filePath = resolve(dir, normalizedUrl + ".md");
  writeFileSync(filePath, markdown, "utf-8");
  return filePath;
}

/** Save web page metadata JSON to CACHE/web/{normalizedUrl}.json. */
export function saveMeta(meta: WebMeta): string {
  const dir = ensureDirs();
  const filePath = resolve(dir, meta.normalizedUrl + ".json");
  writeFileSync(filePath, JSON.stringify(meta, null, 2), "utf-8");
  return filePath;
}

/** Load web page metadata from cache. Returns null if not found. */
export function loadMeta(normalizedUrl: string): WebMeta | null {
  const dir = ensureDirs();
  const filePath = resolve(dir, normalizedUrl + ".json");
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

/** Check if markdown is cached. Returns path or null. */
export function loadMarkdownPath(normalizedUrl: string): string | null {
  const dir = ensureDirs();
  const filePath = resolve(dir, normalizedUrl + ".md");
  return existsSync(filePath) ? filePath : null;
}
