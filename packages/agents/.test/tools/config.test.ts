// packages/agents/.test/tools/config.test.ts
import { describe, it, expect, afterEach } from 'vitest';
import { getConfiguredModel, getApiKey } from '../../src/config.js';

describe('config', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  // ── getConfiguredModel ────────────────────────────────────────────

  it('should default to openrouter provider with z-ai/glm-5', () => {
    delete process.env.DARE_AGENTS_PROVIDER;
    delete process.env.DARE_AGENTS_MODEL;
    delete process.env.ANTHROPIC_MODEL;
    delete process.env.DARE_AGENTS_BASE_URL;
    delete process.env.ANTHROPIC_BASE_URL;
    const model = getConfiguredModel();
    expect(model).toBeDefined();
    expect(model.id).toBe('z-ai/glm-5');
    expect(model.provider).toBe('openrouter');
  });

  it('should use DARE_AGENTS_PROVIDER when set', () => {
    process.env.DARE_AGENTS_PROVIDER = 'anthropic';
    delete process.env.DARE_AGENTS_MODEL;
    delete process.env.ANTHROPIC_MODEL;
    const model = getConfiguredModel();
    expect(model.id).toContain('claude');
    // anthropic provider uses anthropic-messages API
    expect(model.api).toBe('anthropic-messages');
  });

  it('should use DARE_AGENTS_MODEL over ANTHROPIC_MODEL', () => {
    process.env.DARE_AGENTS_PROVIDER = 'openrouter';
    process.env.DARE_AGENTS_MODEL = 'z-ai/glm-4.5-air:free';
    process.env.ANTHROPIC_MODEL = 'should-be-ignored';
    const model = getConfiguredModel();
    expect(model.id).toBe('z-ai/glm-4.5-air:free');
  });

  it('should fall back to ANTHROPIC_MODEL when DARE_AGENTS_MODEL is absent', () => {
    process.env.DARE_AGENTS_PROVIDER = 'anthropic';
    delete process.env.DARE_AGENTS_MODEL;
    process.env.ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
    const model = getConfiguredModel();
    expect(model.id).toBe('claude-sonnet-4-20250514');
  });

  it('should override baseUrl with DARE_AGENTS_BASE_URL', () => {
    process.env.DARE_AGENTS_PROVIDER = 'openrouter';
    process.env.DARE_AGENTS_MODEL = 'anthropic/claude-3.5-haiku';
    process.env.DARE_AGENTS_BASE_URL = 'https://custom-proxy.example.com';
    const model = getConfiguredModel();
    expect(model.baseUrl).toBe('https://custom-proxy.example.com');
  });

  it('should NOT fall back to ANTHROPIC_BASE_URL for non-anthropic providers', () => {
    process.env.DARE_AGENTS_PROVIDER = 'openrouter';
    process.env.DARE_AGENTS_MODEL = 'anthropic/claude-3.5-haiku';
    delete process.env.DARE_AGENTS_BASE_URL;
    process.env.ANTHROPIC_BASE_URL = 'https://legacy-proxy.example.com';
    const model = getConfiguredModel();
    // Should use the default openrouter baseUrl, NOT the anthropic proxy
    expect(model.baseUrl).not.toBe('https://legacy-proxy.example.com');
  });

  it('should fall back to ANTHROPIC_BASE_URL only for anthropic provider', () => {
    process.env.DARE_AGENTS_PROVIDER = 'anthropic';
    process.env.DARE_AGENTS_MODEL = 'claude-sonnet-4-20250514';
    delete process.env.DARE_AGENTS_BASE_URL;
    process.env.ANTHROPIC_BASE_URL = 'https://legacy-proxy.example.com';
    const model = getConfiguredModel();
    expect(model.baseUrl).toBe('https://legacy-proxy.example.com');
  });

  // ── getApiKey ─────────────────────────────────────────────────────

  it('should return DARE_AGENTS_API_KEY as primary', () => {
    process.env.DARE_AGENTS_API_KEY = 'dare-key-123';
    process.env.OPENROUTER_API_KEY = 'should-be-ignored';
    expect(getApiKey()).toBe('dare-key-123');
  });

  it('should fall back to OPENROUTER_API_KEY', () => {
    delete process.env.DARE_AGENTS_API_KEY;
    process.env.OPENROUTER_API_KEY = 'or-key-456';
    delete process.env.ANTHROPIC_AUTH_TOKEN;
    expect(getApiKey()).toBe('or-key-456');
  });

  it('should fall back to ANTHROPIC_AUTH_TOKEN', () => {
    delete process.env.DARE_AGENTS_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    process.env.ANTHROPIC_AUTH_TOKEN = 'auth-token-789';
    expect(getApiKey()).toBe('auth-token-789');
  });

  it('should fall back to ANTHROPIC_API_KEY', () => {
    delete process.env.DARE_AGENTS_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.ANTHROPIC_AUTH_TOKEN;
    process.env.ANTHROPIC_API_KEY = 'fallback-key-000';
    expect(getApiKey()).toBe('fallback-key-000');
  });

  it('should return empty string when no API key env var is set', () => {
    delete process.env.DARE_AGENTS_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.ANTHROPIC_AUTH_TOKEN;
    delete process.env.ANTHROPIC_API_KEY;
    expect(getApiKey()).toBe('');
  });
});
