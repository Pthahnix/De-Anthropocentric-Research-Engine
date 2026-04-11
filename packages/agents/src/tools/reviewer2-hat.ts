// packages/agents/src/tools/reviewer2-hat.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/reviewer2-hat.md'), 'utf-8');

export interface Reviewer2Result {
  critiques: Array<{
    category: 'methodology' | 'novelty' | 'significance' | 'evaluation' | 'clarity';
    severity: 'minor' | 'major' | 'fatal';
    critique: string;
    suggestion: string;
  }>;
  fatalFlaw: string;
  improvedVariants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  overallAssessment: string;
}

export async function reviewer2Hat(params: {
  idea: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<Reviewer2Result> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `RESEARCH IDEA:\n${params.idea}\n\nCONTEXT:\n${params.context}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
