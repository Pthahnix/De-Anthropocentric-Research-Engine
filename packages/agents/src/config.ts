// packages/agents/src/config.ts
import { getModel, type Model, type Api } from '@mariozechner/pi-ai';

/**
 * Bridge DARE env vars → pi-ai model.
 *
 * Primary env vars (set in .mcp.json dare-agents entry):
 * - DARE_AGENTS_PROVIDER  → pi-ai provider name (default: 'openrouter')
 *                           Supported: 'openrouter', 'anthropic', 'openai', etc.
 * - DARE_AGENTS_MODEL     → model ID (default depends on provider)
 * - DARE_AGENTS_API_KEY   → API key (falls back to provider-specific env vars)
 * - DARE_AGENTS_BASE_URL  → overrides model.baseUrl (for custom endpoints)
 *
 * Legacy env vars (fallbacks for backward compatibility):
 * - ANTHROPIC_MODEL       → model ID fallback
 * - ANTHROPIC_BASE_URL    → base URL fallback
 * - ANTHROPIC_AUTH_TOKEN   → API key fallback
 * - ANTHROPIC_API_KEY      → API key fallback
 * - OPENROUTER_API_KEY     → API key fallback (for openrouter provider)
 */

const PROVIDER_DEFAULTS: Record<string, string> = {
  openrouter: 'z-ai/glm-5',
  anthropic: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o-mini',
};

export function getConfiguredModel(): Model<Api> {
  const provider = process.env.DARE_AGENTS_PROVIDER || 'openrouter';
  const modelId = process.env.DARE_AGENTS_MODEL
    || process.env.ANTHROPIC_MODEL
    || PROVIDER_DEFAULTS[provider]
    || 'z-ai/glm-5';
  const model = getModel(provider as any, modelId as any);
  // Only apply base URL override if explicitly set for dare-agents,
  // or if using anthropic provider with ANTHROPIC_BASE_URL.
  // Never let ANTHROPIC_BASE_URL leak into non-anthropic providers.
  const baseUrl = process.env.DARE_AGENTS_BASE_URL
    || (provider === 'anthropic' ? process.env.ANTHROPIC_BASE_URL : undefined);
  if (baseUrl) {
    model.baseUrl = baseUrl;
  }
  // Reasoning models (e.g. GLM-5) use part of maxTokens for thinking.
  // pi-ai's registry may set maxTokens too low (e.g. 4096 for z-ai/glm-5),
  // causing the entire budget to be consumed by thinking with no content output.
  // Env var override or a sensible floor of 16384 for reasoning models.
  const maxTokensOverride = process.env.DARE_AGENTS_MAX_TOKENS;
  if (maxTokensOverride) {
    model.maxTokens = parseInt(maxTokensOverride, 10);
  } else if (model.reasoning && model.maxTokens < 16384) {
    model.maxTokens = 16384;
  }
  return model;
}

export function getApiKey(): string {
  return process.env.DARE_AGENTS_API_KEY
    || process.env.OPENROUTER_API_KEY
    || process.env.ANTHROPIC_AUTH_TOKEN
    || process.env.ANTHROPIC_API_KEY
    || '';
}

/**
 * Build options object for pi-ai `complete()` / `stream()` calls.
 * Includes apiKey and maxTokens so the underlying provider sends
 * the right parameters to the API.
 *
 * Accepts an optional model to read maxTokens from (avoids calling
 * getConfiguredModel() again when the caller already has it).
 */
export function getCompleteOptions(model?: Model<Api>): { apiKey: string; maxTokens: number } {
  const maxTokens = model?.maxTokens ?? 16384;
  return {
    apiKey: getApiKey(),
    maxTokens,
  };
}
