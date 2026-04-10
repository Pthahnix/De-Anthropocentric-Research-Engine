// packages/agents/src/tools/worst-method-analysis.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/worst-method-analysis.md'), 'utf-8');

export interface WorstMethodResult {
  worstMethod: {
    description: string;
    worstProperties: Array<{
      property: string;
      implicitAssumption: string;
      opposite: string;
    }>;
  };
  variants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  explanation: string;
}

export async function worstMethodAnalysis(params: {
  problem: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<WorstMethodResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `PROBLEM:\n${params.problem}\n\nCONTEXT:\n${params.context}`;
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
