// packages/agents/src/tools/analogical-transfer.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getCompleteOptions } from '../config.js';
import { parseResponseJson } from '../parse-response.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/analogical-transfer.md'), 'utf-8');

export interface AnalogicalTransferResult {
  sourcePrinciple: string;
  abstractedPrinciple: string;
  transferPath: string;
  variants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  transferQuality: 'forced' | 'natural' | 'deep';
  explanation: string;
}

export async function analogicalTransfer(params: {
  sourceDomain: string;
  targetProblem: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<AnalogicalTransferResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `SOURCE DOMAIN:\n${params.sourceDomain}\n\nTARGET PROBLEM:\n${params.targetProblem}\n\nCONTEXT:\n${params.context}`;
  const response = await complete(model, {
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage, timestamp: Date.now() }],
  }, getCompleteOptions(model));
  return parseResponseJson(response);
}
