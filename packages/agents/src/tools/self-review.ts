import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/self-reviewer.md'), 'utf-8');

export interface SelfReviewResult {
  verdict: 'ACCEPT' | 'REJECT' | 'REVISE';
  confidence: number;
  criticPoints: string[];
  defensePoints: string[];
  judgeReasoning: string;
  revisionSuggestions?: string[];
}

export async function selfReview(params: {
  artifact: string;
  artifactType: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<SelfReviewResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `ARTIFACT TYPE: ${params.artifactType}\n\nARTIFACT:\n${params.artifact}\n\nCONTEXT:\n${params.context}`;
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
