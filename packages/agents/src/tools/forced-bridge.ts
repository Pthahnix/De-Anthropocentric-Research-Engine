// packages/agents/src/tools/forced-bridge.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/forced-bridge.md'), 'utf-8');

export interface ForcedBridgeResult {
  techniqueASummary: string;
  techniqueBSummary: string;
  bridges: Array<{
    sharedProperty: string;
    bridgeDescription: string;
    quality: 'forced' | 'natural' | 'deep';
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

export async function forcedBridge(params: {
  techniqueA: string;
  techniqueB: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<ForcedBridgeResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `TECHNIQUE A:\n${params.techniqueA}\n\nTECHNIQUE B:\n${params.techniqueB}\n\nCONTEXT:\n${params.context}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
