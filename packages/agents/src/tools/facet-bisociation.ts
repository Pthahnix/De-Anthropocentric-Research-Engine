// packages/agents/src/tools/facet-bisociation.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/facet-bisociation.md'), 'utf-8');

export interface BisociationResult {
  connections: Array<{
    facetAElement: string;
    facetBElement: string;
    connectionType: 'mechanism_analogy' | 'problem_similarity' | 'evaluation_transfer';
    strength: 'weak' | 'moderate' | 'strong';
  }>;
  hybridIdeas: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  explanation: string;
}

export async function facetBisociation(params: {
  facetA: string;
  facetB: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<BisociationResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `FACET A:\n${params.facetA}\n\nFACET B:\n${params.facetB}\n\nCONTEXT:\n${params.context}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
