// packages/agents/src/tools/insight-stakeholder.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/insight-stakeholder.md'), 'utf-8');

export interface StakeholderResult {
  stakeholders: Array<{
    name: string;
    role: string;
    jtbd: string;
    painPoints: string[];
    gainOpportunities: string[];
  }>;
  underservedStakeholder: string;
  conflictingNeeds: string;
}

export async function insightStakeholder(params: {
  gap: string;
  rootCauseOutput: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<StakeholderResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `GAP: ${params.gap}\n\nROOT CAUSE ANALYSIS:\n${params.rootCauseOutput}`;
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
