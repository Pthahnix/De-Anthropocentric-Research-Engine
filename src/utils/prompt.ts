import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROMPT_DIR = resolve(__dirname, "../../prompt");

/** Load a prompt template by name (without .md extension). */
export function load(name: string): string {
  return readFileSync(resolve(PROMPT_DIR, `${name}.md`), "utf-8");
}
