// packages/agents/src/tools/ablation-brainstorm.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/ablation-brainstorm.md'), 'utf-8');

export interface AblationBrainstormResult {
  sotaDecomposition: Array<{
    component: string;
    role: string;
    ablations: Array<{
      type: 'remove' | 'replace' | 'scale';
      description: string;
      expectedOutcome: string;
      interestLevel: 'boring' | 'interesting' | 'surprising';
    }>;
  }>;
  variants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  explanation: string;
}

export async function ablationBrainstorm(params: {
  sotaComponents: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<AblationBrainstormResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `SOTA COMPONENTS:\n${params.sotaComponents}\n\nCONTEXT:\n${params.context}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
