// packages/agents/src/tools/insight-hmw.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/insight-hmw.md'), 'utf-8');

export interface HmwResult {
  hmwQuestions: Array<{
    question: string;
    sourceTension: string;
    scope: string;
    actionability: string;
    noveltyPotential: string;
  }>;
  rankedQuestions: string[];
  rankingRationale: string;
}

export async function insightHmw(params: {
  tensions: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<HmwResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `TENSIONS:\n${params.tensions}`;
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
