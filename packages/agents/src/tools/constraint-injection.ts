// packages/agents/src/tools/constraint-injection.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/constraint-injection.md'), 'utf-8');

export interface ConstraintInjectionResult {
  constraint: string;
  brokenParts: string[];
  workarounds: Array<{
    description: string;
    creativity: 'straightforward' | 'clever' | 'radical';
  }>;
  variants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  insightFromConstraint: string;
  explanation: string;
}

export async function constraintInjection(params: {
  idea: string;
  constraint: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<ConstraintInjectionResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `RESEARCH IDEA:\n${params.idea}\n\nCONSTRAINT TO INJECT:\n${params.constraint}\n\nCONTEXT:\n${params.context}`;
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
