// packages/agents/src/tools/triz-contradiction.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/triz-contradiction.md'), 'utf-8');

export interface TrizResult {
  contradiction: {
    type: 'technical' | 'physical';
    metricX: string;
    metricY: string;
    description: string;
  };
  appliedPrinciples: Array<{ number: number; name: string; application: string }>;
  variants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  explanation: string;
}

export async function trizContradiction(params: {
  idea: string;
  metricX: string;
  metricY: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<TrizResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `IDEA:\n${params.idea}\n\nMETRIC TO IMPROVE:\n${params.metricX}\n\nMETRIC THAT SUFFERS:\n${params.metricY}\n\nCONTEXT:\n${params.context}`;
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
