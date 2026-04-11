// packages/agents/src/tools/random-paper-entry.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/random-paper-entry.md'), 'utf-8');

export interface RandomPaperEntryResult {
  randomFacetSummary: string;
  connections: Array<{
    aspect: string;
    connection: string;
    surpriseFactor: 'low' | 'medium' | 'high';
  }>;
  variants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  explanation: string;
}

export async function randomPaperEntry(params: {
  randomPaperFacet: string;
  targetProblem: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<RandomPaperEntryResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `RANDOM PAPER FACET:\n${params.randomPaperFacet}\n\nTARGET PROBLEM:\n${params.targetProblem}\n\nCONTEXT:\n${params.context}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
