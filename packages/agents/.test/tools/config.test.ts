// packages/agents/.test/tools/config.test.ts
import { describe, it, expect, afterEach } from 'vitest';
import { getConfiguredModel, getApiKey } from '../../src/config.js';

describe('config', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('should return a model with default ID when no ANTHROPIC_MODEL set', () => {
    delete process.env.ANTHROPIC_MODEL;
    delete process.env.ANTHROPIC_BASE_URL;
    const model = getConfiguredModel();
    expect(model).toBeDefined();
    expect(model.id).toContain('claude');
  });

  it('should override baseUrl when ANTHROPIC_BASE_URL is set', () => {
    process.env.ANTHROPIC_BASE_URL = 'https://custom-proxy.example.com';
    const model = getConfiguredModel();
    expect(model.baseUrl).toBe('https://custom-proxy.example.com');
  });

  it('should return ANTHROPIC_AUTH_TOKEN as API key', () => {
    process.env.ANTHROPIC_AUTH_TOKEN = 'test-token-123';
    expect(getApiKey()).toBe('test-token-123');
  });

  it('should fall back to ANTHROPIC_API_KEY when AUTH_TOKEN is absent', () => {
    delete process.env.ANTHROPIC_AUTH_TOKEN;
    process.env.ANTHROPIC_API_KEY = 'fallback-key-456';
    expect(getApiKey()).toBe('fallback-key-456');
  });

  it('should return empty string when no API key env var is set', () => {
    delete process.env.ANTHROPIC_AUTH_TOKEN;
    delete process.env.ANTHROPIC_API_KEY;
    expect(getApiKey()).toBe('');
  });
});
