// packages/agents/src/tools/failure-taxonomy.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/failure-taxonomy.md'), 'utf-8');

export interface FailureTaxonomyResult {
  taxonomy: Array<{
    category: string;
    rootCause: string;
    frequency: 'rare' | 'common' | 'ubiquitous';
    impact: 'low' | 'medium' | 'high';
    examples: string[];
  }>;
  variants: Array<{
    title: string;
    description: string;
    mutationType: string;
    addressesCategory: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  explanation: string;
}

export async function failureTaxonomy(params: {
  failureCases: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<FailureTaxonomyResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `FAILURE CASES:\n${params.failureCases}\n\nCONTEXT:\n${params.context}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
