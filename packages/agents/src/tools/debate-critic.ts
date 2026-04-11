import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/critic.md'), 'utf-8');

export interface CriticResult {
  critiques: Array<{ point: string; severity: 'fatal' | 'major' | 'minor'; evidence: string }>;
  overallAssessment: string;
  recommendedVerdict: 'REJECT' | 'REVISE' | 'WEAK_ACCEPT';
}

export async function debateCritic(params: {
  artifact: string;
  artifactType: string;
  context: string;
  debateHistory?: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<CriticResult> {
  const model = params._model ?? getConfiguredModel();
  const parts = [
    `ARTIFACT TYPE: ${params.artifactType}`,
    `ARTIFACT:\n${params.artifact}`,
    `CONTEXT:\n${params.context}`,
  ];
  if (params.debateHistory) parts.push(`DEBATE HISTORY:\n${params.debateHistory}`);
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: parts.join('\n\n'), timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
