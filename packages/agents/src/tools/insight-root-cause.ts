// packages/agents/src/tools/insight-root-cause.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/insight-root-cause.md'), 'utf-8');

export interface RootCauseResult {
  surfaceGap: string;
  whyChain: Array<{ level: number; why: string; because: string }>;
  rootCause: string;
  hiddenAssumptions: string[];
  unexploredAngles: string[];
}

export async function insightRootCause(params: {
  gap: string;
  evidence: string;
  knowledge: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<RootCauseResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `GAP: ${params.gap}\n\nEVIDENCE:\n${params.evidence}\n\nACCUMULATED KNOWLEDGE:\n${params.knowledge}`;
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
