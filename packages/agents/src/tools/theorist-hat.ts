// packages/agents/src/tools/theorist-hat.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/theorist-hat.md'), 'utf-8');

export interface TheoristResult {
  theoreticalFramework: string;
  formalProperties: Array<{
    property: string;
    status: 'provable' | 'conjectured' | 'unknown' | 'disproved';
    sketch: string;
  }>;
  theoreticalGaps: string[];
  formalizedVariants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  explanation: string;
}

export async function theoristHat(params: {
  idea: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<TheoristResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `RESEARCH IDEA:\n${params.idea}\n\nCONTEXT:\n${params.context}`;
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
