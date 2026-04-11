// packages/agents/src/tools/quality-diversity-filter.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/quality-diversity-filter.md'), 'utf-8');

export interface QdFilterResult {
  filteredIdeas: Array<{
    idea: string;
    quality: { novelty: number; feasibility: number; evidence: number; overall: number };
    niche: string;
    kept: boolean;
    reason: string;
  }>;
  removedCount: number;
  nicheMap: Record<string, string>;
  reasoning: string;
}

export async function qualityDiversityFilter(params: {
  ideas: string;
  gaps: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<QdFilterResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `IDEAS:\n${params.ideas}\n\nGAPS:\n${params.gaps}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
