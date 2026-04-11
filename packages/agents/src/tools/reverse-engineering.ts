// packages/agents/src/tools/reverse-engineering.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/reverse-engineering.md'), 'utf-8');

export interface ReverseEngineeringResult {
  worstIdeas: Array<{
    idea: string;
    whyBad: string;
    inversion: string;
    inversionQuality: 'obvious' | 'interesting' | 'surprising';
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

export async function reverseEngineering(params: {
  problem: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<ReverseEngineeringResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `PROBLEM TO REVERSE:\n${params.problem}\n\nCONTEXT:\n${params.context}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
