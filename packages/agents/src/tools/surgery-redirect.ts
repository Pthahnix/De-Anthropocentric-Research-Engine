// packages/agents/src/tools/surgery-redirect.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';
import { SurgeryResult } from './surgery-subtract.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/surgery-redirect.md'), 'utf-8');

export async function surgeryRedirect(params: {
  idea: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<SurgeryResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `IDEA:\n${params.idea}\n\nCONTEXT:\n${params.context}`;
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
