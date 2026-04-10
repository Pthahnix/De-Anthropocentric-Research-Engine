// packages/agents/src/tools/insight-abstraction.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/insight-abstraction.md'), 'utf-8');

export interface AbstractionResult {
  ladder: Array<{ level: number; type: 'concrete' | 'abstract' | 'meta'; statement: string }>;
  insightFromLadder: string;
  reframedProblem: string;
}

export async function insightAbstraction(params: {
  hmwQuestions: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<AbstractionResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `HMW QUESTIONS:\n${params.hmwQuestions}`;
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
