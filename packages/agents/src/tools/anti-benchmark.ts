// packages/agents/src/tools/anti-benchmark.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/anti-benchmark.md'), 'utf-8');

export interface AntiBenchmarkResult {
  benchmark: string;
  statedPurpose: string;
  challengedAssumptions: Array<{
    assumption: string;
    challenge: string;
    evidence: string;
    severity: 'minor' | 'significant' | 'fundamental';
  }>;
  variants: Array<{
    title: string;
    description: string;
    mutationType: string;
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  proposedAlternative: string;
  explanation: string;
}

export async function antiBenchmark(params: {
  benchmark: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<AntiBenchmarkResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `BENCHMARK TO CHALLENGE:\n${params.benchmark}\n\nCONTEXT:\n${params.context}`;
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
