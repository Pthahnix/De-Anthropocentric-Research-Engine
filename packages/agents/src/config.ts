// packages/agents/src/config.ts
import { getModel, type Model, type Api } from '@mariozechner/pi-ai';

/**
 * Bridge DARE env vars → pi-ai model.
 *
 * Env vars (set in .mcp.json dare-agents entry):
 * - ANTHROPIC_BASE_URL   → overrides model.baseUrl (for proxy/gateway)
 * - ANTHROPIC_AUTH_TOKEN  → API key
 * - ANTHROPIC_MODEL       → model ID (default: claude-sonnet-4-20250514)
 *
 * pi-ai internally uses different env var names (ANTHROPIC_API_KEY),
 * so this bridge is necessary.
 */
export function getConfiguredModel(): Model<Api> {
  const modelId = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
  const model = getModel('anthropic', modelId as any);
  if (process.env.ANTHROPIC_BASE_URL) {
    model.baseUrl = process.env.ANTHROPIC_BASE_URL;
  }
  return model;
}

export function getApiKey(): string {
  return process.env.ANTHROPIC_AUTH_TOKEN || process.env.ANTHROPIC_API_KEY || '';
}
