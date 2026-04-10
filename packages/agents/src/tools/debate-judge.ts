import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/judge.md'), 'utf-8');

export interface JudgeResult {
  verdict: 'ACCEPT' | 'REJECT' | 'REVISE' | 'CONTINUE' | 'ITEM_A' | 'ITEM_B' | 'TIE';
  confidence: number;
  reasoning: string;
  keyFactors?: string[];
  debateSummary?: string;
  comparisonPoints?: Array<{ dimension: string; winner: string; reason: string }>;
}

export async function debateJudge(params: {
  artifact: string;
  artifactType: string;
  criticOutput: string;
  defenderOutput: string;
  debateHistory?: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<JudgeResult> {
  const model = params._model ?? getConfiguredModel();
  const parts = [
    `ARTIFACT TYPE: ${params.artifactType}`,
    `ARTIFACT:\n${params.artifact}`,
    `CRITIC OUTPUT:\n${params.criticOutput}`,
    `DEFENDER OUTPUT:\n${params.defenderOutput}`,
  ];
  if (params.debateHistory) parts.push(`DEBATE HISTORY:\n${params.debateHistory}`);
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: parts.join('\n\n'), timestamp: Date.now() }],
  }, { apiKey: getApiKey() });
  const text = response.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
  return JSON.parse(text);
}
