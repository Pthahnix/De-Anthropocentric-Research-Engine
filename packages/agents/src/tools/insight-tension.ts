// packages/agents/src/tools/insight-tension.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/insight-tension.md'), 'utf-8');

export interface TensionResult {
  tensions: Array<{
    tensionType: string;
    description: string;
    sideA: string;
    sideB: string;
    currentBalance: string;
    innovationLever: string;
  }>;
  primaryTension: string;
  tensionInsight: string;
}

export async function insightTension(params: {
  gap: string;
  stakeholderOutput: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<TensionResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `GAP: ${params.gap}\n\nSTAKEHOLDER ANALYSIS:\n${params.stakeholderOutput}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
