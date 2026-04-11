// packages/agents/src/tools/method-evolve-evaluate.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/method-evolve-evaluator.md'), 'utf-8');

export interface CriterionScore {
  criterion: string;
  methodA: string;
  methodB: string;
  winner: 'A' | 'B' | 'Tie';
}

export interface EvaluateResult {
  criteria: CriterionScore[];
  overallWinner: 'A' | 'B' | 'Tie';
  confidence: 'High' | 'Medium' | 'Low';
  eloUpdateSuggestion: { winner: string; loser: string };
}

export async function methodEvolveEvaluate(params: {
  methodA: string;
  outputA: string;
  methodB: string;
  outputB: string;
  criteria: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<EvaluateResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `METHOD A:\n${params.methodA}\n\nMETHOD A OUTPUT:\n${params.outputA}\n\nMETHOD B:\n${params.methodB}\n\nMETHOD B OUTPUT:\n${params.outputB}\n\nEVALUATION CRITERIA:\n${params.criteria}`;
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
