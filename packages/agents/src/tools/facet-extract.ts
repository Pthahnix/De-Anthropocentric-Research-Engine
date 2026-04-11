// packages/agents/src/tools/facet-extract.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/facet-extractor.md'), 'utf-8');

export interface FacetResult {
  purpose: string;
  mechanism: string;
  evaluation: string;
  paperTitle: string;
}

export async function facetExtract(params: {
  paperMarkdown: string;
  normalizedTitle: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<FacetResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `PAPER (normalizedTitle: ${params.normalizedTitle}):\n\n${params.paperMarkdown}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
