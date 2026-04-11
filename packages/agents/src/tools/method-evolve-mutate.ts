// packages/agents/src/tools/method-evolve-mutate.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/method-evolve-mutator.md'), 'utf-8');

export interface MutationResult {
  originalMethod: string;
  coreStrength: string;
  knownWeakness: string;
  aspectMutated: string;
  originalValue: string;
  mutatedValue: string;
  predictedEffect: 'improvement' | 'degradation' | 'uncertain';
  mutatedMethod: { name: string; fullProtocol: string };
}

export async function methodEvolveMutate(params: {
  method: string;
  trackRecord: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<MutationResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `METHOD TO MUTATE:\n${params.method}\n\nMETHOD'S TRACK RECORD:\n${params.trackRecord}\n\nRESEARCH CONTEXT:\n${params.context}`;
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
