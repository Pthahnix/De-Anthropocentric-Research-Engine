// packages/agents/src/tools/method-evolve-crossover.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/method-evolve-crossover.md'), 'utf-8');

export interface CrossoverResult {
  parentA: { name: string; strength: string; weakness: string };
  parentB: { name: string; strength: string; weakness: string };
  fromA: string;
  fromB: string;
  integrationPoint: string;
  hybrid: {
    name: string;
    fullProtocol: string;
    expectedImprovement: string;
  };
}

export async function methodEvolveCrossover(params: {
  methodA: string;
  methodB: string;
  trackRecords: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<CrossoverResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `METHOD A:\n${params.methodA}\n\nMETHOD B:\n${params.methodB}\n\nTRACK RECORDS:\n${params.trackRecords}\n\nRESEARCH CONTEXT:\n${params.context}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
