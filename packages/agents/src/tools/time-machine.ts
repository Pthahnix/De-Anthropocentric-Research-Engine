// packages/agents/src/tools/time-machine.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/time-machine.md'), 'utf-8');

export interface TimeMachineResult {
  direction: 'future' | 'past';
  years: number;
  projectedChanges: Array<{
    domain: 'compute' | 'data' | 'models' | 'regulation' | 'hardware';
    change: string;
    impact: string;
  }>;
  variants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  mostFragileAssumption: string;
  explanation: string;
}

export async function timeMachine(params: {
  idea: string;
  direction: 'future' | 'past';
  years: number;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<TimeMachineResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `RESEARCH IDEA:\n${params.idea}\n\nDIRECTION: ${params.direction}\nYEARS: ${params.years}\n\nCONTEXT:\n${params.context}`;
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
