// packages/agents/src/tools/insight-validation.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/insight-validation.md'), 'utf-8');

export interface ValidationResult {
  gates: Array<{ gate: number; name: string; passed: boolean; reasoning: string }>;
  overallVerdict: 'PASS' | 'FAIL' | 'REVISE';
  failedGates: number[];
  revisionGuidance?: string;
}

export async function insightValidation(params: {
  fullInsight: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<ValidationResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `FULL INSIGHT CHAIN:\n${params.fullInsight}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
