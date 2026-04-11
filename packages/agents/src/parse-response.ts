// packages/agents/src/parse-response.ts
// Shared helper: extract text from pi-ai response and parse as JSON.

/**
 * Extract text content from a pi-ai `complete()` response and parse as JSON.
 *
 * Handles common LLM quirks:
 * - Empty response (no text blocks)
 * - Markdown-wrapped JSON (```json ... ```)
 * - Non-JSON text (model refused, returned prose, etc.)
 *
 * Throws a descriptive error instead of the cryptic "Unexpected end of JSON input".
 */
export function parseResponseJson<T = unknown>(response: { content: Array<{ type: string; text?: string }> }): T {
  const text = response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('');

  if (!text) {
    const blockTypes = response.content.map((b: any) => b.type).join(', ');
    throw new Error(
      `Model returned no text content. ` +
      `Got ${response.content.length} block(s) [${blockTypes || 'none'}]. ` +
      `This usually means the API call failed silently or the model produced only thinking/tool-use blocks.`
    );
  }

  // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Provide actionable error with a preview of what the model actually returned
    const preview = cleaned.length > 500 ? cleaned.slice(0, 500) + '...' : cleaned;
    throw new Error(
      `Failed to parse model output as JSON.\n` +
      `Parse error: ${(e as Error).message}\n` +
      `Model output (first 500 chars):\n${preview}`
    );
  }
}
