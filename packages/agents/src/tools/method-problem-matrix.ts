// packages/agents/src/tools/method-problem-matrix.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/method-problem-matrix.md'), 'utf-8');

export interface MethodProblemMatrixResult {
  matrix: Array<{
    method: string;
    problem: string;
    status: 'explored' | 'unexplored' | 'partially_explored';
    existingWork: string | null;
    feasibility: 'infeasible' | 'low' | 'medium' | 'high';
  }>;
  unexploredOpportunities: Array<{
    method: string;
    problem: string;
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  explanation: string;
}

export async function methodProblemMatrix(params: {
  methods: string;
  problems: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<MethodProblemMatrixResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `METHODS:\n${params.methods}\n\nPROBLEMS:\n${params.problems}\n\nCONTEXT:\n${params.context}`;
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
