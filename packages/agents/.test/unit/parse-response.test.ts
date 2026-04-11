// packages/agents/.test/unit/parse-response.test.ts
import { describe, it, expect } from 'vitest';
import { parseResponseJson } from '../../src/parse-response.js';

describe('parseResponseJson', () => {
  it('parses clean JSON response', () => {
    const response = {
      content: [{ type: 'text', text: '{"key":"value","num":42}' }],
    };
    expect(parseResponseJson(response)).toEqual({ key: 'value', num: 42 });
  });

  it('joins multiple text blocks', () => {
    const response = {
      content: [
        { type: 'text', text: '{"ke' },
        { type: 'text', text: 'y":"value"}' },
      ],
    };
    expect(parseResponseJson(response)).toEqual({ key: 'value' });
  });

  it('ignores non-text blocks', () => {
    const response = {
      content: [
        { type: 'thinking', text: 'let me think...' },
        { type: 'text', text: '{"result":true}' },
        { type: 'tool_use', text: 'something' },
      ],
    };
    expect(parseResponseJson(response)).toEqual({ result: true });
  });

  it('strips markdown code fence (```json)', () => {
    const response = {
      content: [{ type: 'text', text: '```json\n{"wrapped":true}\n```' }],
    };
    expect(parseResponseJson(response)).toEqual({ wrapped: true });
  });

  it('strips markdown code fence (``` without language)', () => {
    const response = {
      content: [{ type: 'text', text: '```\n{"wrapped":true}\n```' }],
    };
    expect(parseResponseJson(response)).toEqual({ wrapped: true });
  });

  it('throws descriptive error on empty response (no content blocks)', () => {
    const response = { content: [] };
    expect(() => parseResponseJson(response)).toThrow('Model returned no text content');
    expect(() => parseResponseJson(response)).toThrow('0 block(s)');
  });

  it('throws descriptive error when only non-text blocks exist', () => {
    const response = {
      content: [{ type: 'thinking', text: 'hmm...' }],
    };
    expect(() => parseResponseJson(response)).toThrow('Model returned no text content');
    expect(() => parseResponseJson(response)).toThrow('thinking');
  });

  it('throws descriptive error on invalid JSON', () => {
    const response = {
      content: [{ type: 'text', text: 'Sorry, I cannot help with that.' }],
    };
    expect(() => parseResponseJson(response)).toThrow('Failed to parse model output as JSON');
    expect(() => parseResponseJson(response)).toThrow('Sorry, I cannot help');
  });

  it('throws descriptive error on truncated JSON', () => {
    const response = {
      content: [{ type: 'text', text: '{"key":"val' }],
    };
    expect(() => parseResponseJson(response)).toThrow('Failed to parse model output as JSON');
  });

  it('handles whitespace around JSON', () => {
    const response = {
      content: [{ type: 'text', text: '  \n  {"trimmed":true}  \n  ' }],
    };
    expect(parseResponseJson(response)).toEqual({ trimmed: true });
  });

  it('preserves type parameter', () => {
    interface MyType { name: string; count: number }
    const response = {
      content: [{ type: 'text', text: '{"name":"test","count":5}' }],
    };
    const result = parseResponseJson<MyType>(response);
    expect(result.name).toBe('test');
    expect(result.count).toBe(5);
  });

  it('handles JSON arrays', () => {
    const response = {
      content: [{ type: 'text', text: '[1,2,3]' }],
    };
    expect(parseResponseJson(response)).toEqual([1, 2, 3]);
  });
});
