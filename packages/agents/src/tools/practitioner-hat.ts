// packages/agents/src/tools/practitioner-hat.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/practitioner-hat.md'), 'utf-8');

export interface PractitionerResult {
  assessment: {
    dataRequirements: {
      description: string;
      availability: 'available' | 'limited' | 'unavailable';
    };
    computeRequirements: {
      training: string;
      inference: string;
      feasibility: 'trivial' | 'moderate' | 'expensive' | 'prohibitive';
    };
    integrationComplexity: 'drop-in' | 'moderate' | 'major-refactor' | 'greenfield';
    topBlocker: string;
  };
  practicalVariants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  buildability: 'ready' | '6months' | '1year' | 'research_only';
  explanation: string;
}

export async function practitionerHat(params: {
  idea: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<PractitionerResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `RESEARCH IDEA:\n${params.idea}\n\nCONTEXT:\n${params.context}`;
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
