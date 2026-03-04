import "dotenv/config";
import { resolve } from "path";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { normTitle } from "./misc.js";
import type { PaperResult } from "../types.js";

const DIR_CACHE = resolve(process.env.DIR_CACHE || ".cache");
const DIR_MARKDOWN = resolve(DIR_CACHE, "markdown");
const DIR_PAPER = resolve(DIR_CACHE, "paper");
const DIR_WEB = resolve(DIR_CACHE, "web");

/** Ensure cache directories exist. */
function ensureDirs(): void {
  mkdirSync(DIR_MARKDOWN, { recursive: true });
  mkdirSync(DIR_PAPER, { recursive: true });
  mkdirSync(DIR_WEB, { recursive: true });
}

/** Save markdown content to cache. Returns the absolute file path. */
export function save(title: string, markdown: string): string {
  ensureDirs();
  const filename = normTitle(title) + ".md";
  const filePath = resolve(DIR_MARKDOWN, filename);
  writeFileSync(filePath, markdown, "utf-8");
  return filePath;
}

/** Save paper metadata JSON to cache. Returns the absolute file path. */
export function savePaperMeta(paper: PaperResult): string {
  ensureDirs();
  const filename = paper.normalizedTitle + ".json";
  const filePath = resolve(DIR_PAPER, filename);
  writeFileSync(filePath, JSON.stringify(paper, null, 2), "utf-8");
  return filePath;
}

/** Load paper metadata from cache. Returns null if not found. */
export function loadPaperMeta(normalizedTitle: string): PaperResult | null {
  const filePath = resolve(DIR_PAPER, normalizedTitle + ".json");
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

/** Save web page markdown to cache. Returns the absolute file path. */
export function saveWeb(title: string, markdown: string): string {
  ensureDirs();
  const filename = normTitle(title) + ".md";
  const filePath = resolve(DIR_WEB, filename);
  writeFileSync(filePath, markdown, "utf-8");
  return filePath;
}
