/**
 * E2E test: validates YAML frontmatter of all P1 SKILL.md files.
 * Checks required fields: type, layer, name, description.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '../../..');

function parseFrontmatter(content: string): Record<string, string> {
  // Normalize Windows CRLF to Unix LF before parsing
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      result[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim();
    }
  }
  return result;
}

function readSkill(relPath: string): { path: string; fm: Record<string, string> } {
  const fullPath = join(ROOT, relPath);
  const content = readFileSync(fullPath, 'utf-8');
  return { path: fullPath, fm: parseFrontmatter(content) };
}

// SOPs
const P1_SOPS = [
  'insight-root-cause-drilling',
  'insight-stakeholder-mapping',
  'insight-tension-mining',
  'insight-question-reformulation',
  'insight-abstraction-laddering',
  'insight-assumption-audit',
  'insight-validation',
  'quality-diversity-filtering',
  'debate-gap',
  'debate-idea',
  'debate-experiment-design',
  'debate-experiment-result',
];

// Tactics
const P1_TACTICS = ['insight', 'multiagent-debate', 'review'];

// Strategies
const P1_STRATEGIES = ['gap-analysis', 'insight'];

describe('P1 SKILL.md frontmatter validation', () => {
  describe('SOPs (type: sop, layer: sop)', () => {
    for (const name of P1_SOPS) {
      it(`skills/sop/${name}/SKILL.md has correct frontmatter`, () => {
        const { path, fm } = readSkill(`skills/sop/${name}/SKILL.md`);

        expect(fm['type'], `${path} — type field missing`).toBeTruthy();
        expect(fm['type'], `${path} — type should be 'sop'`).toBe('sop');

        expect(fm['layer'], `${path} — layer field missing`).toBeTruthy();
        expect(fm['layer'], `${path} — layer should be 'sop'`).toBe('sop');

        expect(fm['name'], `${path} — name field missing`).toBeTruthy();
        expect(fm['name'].length, `${path} — name should not be empty`).toBeGreaterThan(0);

        expect(fm['description'], `${path} — description field missing`).toBeTruthy();
        expect(
          fm['description'].length,
          `${path} — description should not be empty`
        ).toBeGreaterThan(0);
      });
    }
  });

  describe('Tactics (type: tactic, layer: tactic)', () => {
    for (const name of P1_TACTICS) {
      it(`skills/tactic/${name}/SKILL.md has correct frontmatter`, () => {
        const { path, fm } = readSkill(`skills/tactic/${name}/SKILL.md`);

        expect(fm['type'], `${path} — type field missing`).toBeTruthy();
        expect(fm['type'], `${path} — type should be 'tactic'`).toBe('tactic');

        expect(fm['layer'], `${path} — layer field missing`).toBeTruthy();
        expect(fm['layer'], `${path} — layer should be 'tactic'`).toBe('tactic');

        expect(fm['name'], `${path} — name field missing`).toBeTruthy();
        expect(fm['name'].length, `${path} — name should not be empty`).toBeGreaterThan(0);

        expect(fm['description'], `${path} — description field missing`).toBeTruthy();
        expect(
          fm['description'].length,
          `${path} — description should not be empty`
        ).toBeGreaterThan(0);
      });
    }
  });

  describe('Strategies (type: strategy, layer: strategy)', () => {
    for (const name of P1_STRATEGIES) {
      it(`skills/strategy/${name}/SKILL.md has correct frontmatter`, () => {
        const { path, fm } = readSkill(`skills/strategy/${name}/SKILL.md`);

        expect(fm['type'], `${path} — type field missing`).toBeTruthy();
        expect(fm['type'], `${path} — type should be 'strategy'`).toBe('strategy');

        expect(fm['layer'], `${path} — layer field missing`).toBeTruthy();
        expect(fm['layer'], `${path} — layer should be 'strategy'`).toBe('strategy');

        expect(fm['name'], `${path} — name field missing`).toBeTruthy();
        expect(fm['name'].length, `${path} — name should not be empty`).toBeGreaterThan(0);

        expect(fm['description'], `${path} — description field missing`).toBeTruthy();
        expect(
          fm['description'].length,
          `${path} — description should not be empty`
        ).toBeGreaterThan(0);
      });
    }
  });

  it('parseFrontmatter extracts all standard fields correctly', () => {
    const sample = `---
type: sop
layer: sop
name: Test Skill
description: A test skill for validation
agent: dare-agents
tools: [test_tool]
---

# Test Skill

Body content here.
`;
    const fm = parseFrontmatter(sample);
    expect(fm['type']).toBe('sop');
    expect(fm['layer']).toBe('sop');
    expect(fm['name']).toBe('Test Skill');
    expect(fm['description']).toBe('A test skill for validation');
    expect(fm['agent']).toBe('dare-agents');
  });

  it('parseFrontmatter returns empty object when no frontmatter block present', () => {
    const content = '# No frontmatter\n\nJust markdown.';
    const fm = parseFrontmatter(content);
    expect(Object.keys(fm)).toHaveLength(0);
  });

  it('parseFrontmatter handles multi-word values with colons in value', () => {
    const sample = `---
name: Insight Root Cause Drilling
description: Drill from surface gap to structural root cause via 5-why chain analysis
---
`;
    const fm = parseFrontmatter(sample);
    expect(fm['name']).toBe('Insight Root Cause Drilling');
    expect(fm['description']).toBe('Drill from surface gap to structural root cause via 5-why chain analysis');
  });
});
