// packages/agents/src/tools/insight-assumption.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/insight-assumption.md'), 'utf-8');

export interface AssumptionResult {
  assumptions: Array<{
    statement: string;
    source: string;
    verdict: 'valid' | 'questionable' | 'false';
    evidence: string;
    risk: string;
  }>;
  criticalAssumptions: string[];
  safeAssumptions: string[];
  recommendation: string;
}

export async function insightAssumption(params: {
  insightSoFar: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<AssumptionResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `INSIGHT CHAIN (Steps 1-5):\n${params.insightSoFar}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
