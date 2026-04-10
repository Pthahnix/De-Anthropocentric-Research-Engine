import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/defender.md'), 'utf-8');

export interface DefenderResult {
  defenses: Array<{ againstPoint: string; response: string; evidenceUsed: string }>;
  concessions: string[];
  overallDefense: string;
  recommendedVerdict: 'ACCEPT' | 'WEAK_ACCEPT' | 'REVISE';
}

export async function debateDefender(params: {
  artifact: string;
  artifactType: string;
  context: string;
  criticOutput: string;
  debateHistory?: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<DefenderResult> {
  const model = params._model ?? getConfiguredModel();
  const parts = [
    `ARTIFACT TYPE: ${params.artifactType}`,
    `ARTIFACT:\n${params.artifact}`,
    `CRITIC OUTPUT:\n${params.criticOutput}`,
    `CONTEXT:\n${params.context}`,
  ];
  if (params.debateHistory) parts.push(`DEBATE HISTORY:\n${params.debateHistory}`);
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: parts.join('\n\n'), timestamp: Date.now() }],
  }, { apiKey: getApiKey() });
  const text = response.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
  return JSON.parse(text);
}
