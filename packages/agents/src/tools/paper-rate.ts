import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/paper-rater.md'), 'utf-8');

export interface PaperRateResult {
  rating: 'High' | 'Medium' | 'Low';
  reason: string;
}

export async function paperRate(params: {
  title: string;
  abstract: string;
  year?: number;
  citations?: number;
  topic: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<PaperRateResult> {
  const model = params._model ?? getConfiguredModel();
  const parts = [
    `RESEARCH TOPIC: ${params.topic}`,
    `PAPER TITLE: ${params.title}`,
    `ABSTRACT: ${params.abstract}`,
  ];
  if (params.year) parts.push(`YEAR: ${params.year}`);
  if (params.citations !== undefined) parts.push(`CITATIONS: ${params.citations}`);
  const userMessage = parts.join('\n\n');

  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
