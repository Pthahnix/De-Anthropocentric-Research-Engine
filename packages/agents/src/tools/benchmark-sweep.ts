// packages/agents/src/tools/benchmark-sweep.ts
import { complete } from '@mariozechner/pi-ai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConfiguredModel, getApiKey } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, '../prompts/benchmark-sweep.md'), 'utf-8');

export interface BenchmarkSweepResult {
  benchmarkAnalysis: Array<{
    benchmark: string;
    currentSOTA: string;
    bottleneck: string;
    approaches: string[];
  }>;
  crossBenchmarkIdeas: Array<{
    title: string;
    description: string;
    mutationType: string;
    benchmarksCovered: string[];
    explanation: string;
    noveltyEstimate: 'low' | 'medium' | 'high';
  }>;
  explanation: string;
}

export async function benchmarkSweep(params: {
  benchmarks: string;
  context: string;
  _model?: ReturnType<typeof getConfiguredModel>;
}): Promise<BenchmarkSweepResult> {
  const model = params._model ?? getConfiguredModel();
  const userMessage = `BENCHMARKS:\n${params.benchmarks}\n\nCONTEXT:\n${params.context}`;
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
