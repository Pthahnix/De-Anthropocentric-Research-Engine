/**
 * learn-pi-ai.ts — Hands-on learning script for @mariozechner/pi-ai
 *
 * NOT a test suite. A standalone script to learn pi-ai's API by doing.
 * Run: OPENROUTER_API_KEY=sk-or-v1-... npx tsx tests/learn-pi-ai.ts
 *
 * Exercises:
 *   1. Basic Q&A — simplest possible complete() call
 *   2. System prompt — mimic dare-agents pattern
 *   3. JSON output — the core pattern all 34 dare-agents tools use
 */

import { getModel, complete, type Model, type Api } from '@mariozechner/pi-ai';

// ── Config ─────────────────────────────────────────────────────────
const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) {
  console.error('❌ Set OPENROUTER_API_KEY env var first.');
  console.error('   OPENROUTER_API_KEY=sk-or-v1-... npx tsx tests/learn-pi-ai.ts');
  process.exit(1);
}

// Use a cheap, fast model for learning
const model = getModel('openrouter', 'anthropic/claude-3.5-haiku');
console.log(`✓ Model: ${model.id} | API: ${model.api} | Provider: ${model.provider}`);
console.log(`  Base URL: ${model.baseUrl}`);
console.log(`  Cost: $${model.cost.input}/M input, $${model.cost.output}/M output\n`);

// ── Helper ─────────────────────────────────────────────────────────
function extractText(response: any): string {
  return response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('');
}

// ── Exercise 1: Basic Q&A ──────────────────────────────────────────
async function exercise1() {
  console.log('═══ Exercise 1: Basic Q&A ═══');

  const response = await complete(model, {
    messages: [
      { role: 'user', content: 'What is 2+2? Answer in one word.', timestamp: Date.now() }
    ],
  }, { apiKey: API_KEY });

  const text = extractText(response);
  console.log(`  Response: "${text.trim()}"`);
  console.log(`  Tokens: ${response.usage.input} in → ${response.usage.output} out`);
  console.log(`  Cost: $${response.usage.cost.total.toFixed(6)}`);
  console.log(`  Stop reason: ${response.stopReason}\n`);
}

// ── Exercise 2: System Prompt (dare-agents pattern) ────────────────
async function exercise2() {
  console.log('═══ Exercise 2: System Prompt ═══');

  const systemPrompt = `You are a research paper analyst.
When given a paper title, provide a one-sentence summary of what the paper likely covers.
Be concise and specific.`;

  const response = await complete(model, {
    systemPrompt,
    messages: [
      {
        role: 'user',
        content: 'PAPER TITLE: Attention Is All You Need',
        timestamp: Date.now(),
      }
    ],
  }, { apiKey: API_KEY });

  const text = extractText(response);
  console.log(`  Response: "${text.trim()}"`);
  console.log(`  Tokens: ${response.usage.input} in → ${response.usage.output} out\n`);
}

// ── Exercise 3: JSON Output + Parse ────────────────────────────────
interface PaperRating {
  rating: 'High' | 'Medium' | 'Low';
  reason: string;
  confidence: number;
}

async function exercise3() {
  console.log('═══ Exercise 3: JSON Output + Parse ═══');

  const systemPrompt = `You are a paper relevance rater.
Given a research topic and a paper title+abstract, rate the paper's relevance.

Return ONLY valid JSON (no markdown fences, no explanation):
{
  "rating": "High" | "Medium" | "Low",
  "reason": "one sentence explaining the rating",
  "confidence": 0.0 to 1.0
}`;

  const userMessage = `RESEARCH TOPIC: Self-evolving AI research methodology systems

PAPER TITLE: AlphaEvolve: A coding agent for scientific and algorithmic discovery
ABSTRACT: AlphaEvolve is an evolutionary coding agent that combines large language models with automated evaluators to evolve programs across codebases. It discovered new state-of-the-art solutions for open mathematical problems and optimized critical systems at Google.`;

  const response = await complete(model, {
    systemPrompt,
    messages: [
      { role: 'user', content: userMessage, timestamp: Date.now() }
    ],
  }, { apiKey: API_KEY });

  const text = extractText(response);
  console.log(`  Raw response: "${text.trim()}"`);

  try {
    const parsed: PaperRating = JSON.parse(text.trim());
    console.log(`  ✓ Parsed successfully!`);
    console.log(`    Rating: ${parsed.rating}`);
    console.log(`    Reason: ${parsed.reason}`);
    console.log(`    Confidence: ${parsed.confidence}`);
  } catch (e) {
    console.error(`  ✗ JSON parse failed: ${e}`);
    console.error(`    This is the exact error dare-agents was hitting.`);
  }
  console.log();
}

// ── Run all exercises ──────────────────────────────────────────────
async function main() {
  console.log('🔬 pi-ai Learning Script\n');
  try {
    await exercise1();
    await exercise2();
    await exercise3();
    console.log('🎉 All exercises completed successfully!');
  } catch (error: any) {
    console.error(`\n💥 Error: ${error.message}`);
    if (error.cause) console.error(`   Cause: ${error.cause}`);
    console.error(`\n   Full error:`, error);
    process.exit(1);
  }
}

main();
