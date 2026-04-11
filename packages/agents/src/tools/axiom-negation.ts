// packages/agents/src/tools/axiom-negation.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/axiom-negation.md'), 'utf-8');

export interface AxiomNegationResult {
  assumption: string;
  provocation: string;
  consequences: string[];
  variants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  explanation: string;
}

export async function axiomNegation(params: {
  assumption: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<AxiomNegationResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `ASSUMPTION TO NEGATE:\n${params.assumption}\n\nCONTEXT:\n${params.context}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
