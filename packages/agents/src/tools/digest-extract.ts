import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/digest-extractor.md'), 'utf-8');

export interface DigestResult {
  paperTitle: string;
  pass1: string;
  pass2?: string;
  pass3?: string;
  keyFindings: string[];
  limitations: string[];
}

export async function digestExtract(params: {
  paperMarkdown: string;
  normalizedTitle: string;
  rating: 'High' | 'Medium' | 'Low';
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<DigestResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `READING DEPTH: ${params.rating}\nPAPER (normalizedTitle: ${params.normalizedTitle}):\n\n${params.paperMarkdown}`;
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
