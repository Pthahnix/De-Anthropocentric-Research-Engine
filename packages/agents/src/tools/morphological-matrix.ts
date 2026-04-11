// packages/agents/src/tools/morphological-matrix.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/morphological-matrix.md'), 'utf-8');

export interface MorphologicalResult {
  matrix: Array<{
    dimension: string;
    options: string[];
  }>;
  combinations: Array<{
    title: string;
    description: string;
    selections: Record<string, string>;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
    feasibilityEstimate: 'low' | 'medium' | 'high';
  }>;
  unexploredRegions: string[];
  explanation: string;
}

export async function morphologicalMatrix(params: {
  dimensions: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<MorphologicalResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `DIMENSIONS:\n${params.dimensions}\n\nCONTEXT:\n${params.context}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, { apiKey: getApiKey() });
  const text = response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('');
  return JSON.parse(text);
}
