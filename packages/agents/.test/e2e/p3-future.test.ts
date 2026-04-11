import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Test all P3 dare-agents tools produce valid output with faux provider
describe('P3 Method-Evolve tools integration', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('mutate → crossover → evaluate pipeline', async () => {
    faux = registerFauxProvider();

    // Step 1: Mutate a method
    const mutationOutput = {
      originalMethod: 'SCAMPER Substitute',
      coreStrength: 'Systematic component replacement',
      knownWeakness: 'Incremental changes only',
      aspectMutated: 'replacement scope',
      originalValue: 'single component',
      mutatedValue: 'multi-component simultaneous',
      predictedEffect: 'improvement',
      mutatedMethod: { name: 'SCAMPER Multi-Substitute', fullProtocol: 'Replace multiple components simultaneously from different paradigms.' }
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mutationOutput))])]);
    const { methodEvolveMutate } = await import('../../src/tools/method-evolve-mutate.js');
    const mutation = await methodEvolveMutate({
      method: '# SCAMPER Substitute\nReplace components systematically...',
      trackRecord: '15 uses, 3 high-quality ideas',
      context: 'NLP attention mechanisms',
      _model: faux.getModel(),
    });
    expect(mutation.mutatedMethod.name).not.toBe(mutation.originalMethod);
    expect(mutation.predictedEffect).toMatch(/improvement|degradation|uncertain/);

    // Step 2: Crossover mutated method with another
    const crossoverOutput = {
      parentA: { name: 'SCAMPER Multi-Substitute', strength: 'Multi-component', weakness: 'Complex' },
      parentB: { name: 'Analogical Transfer', strength: 'Cross-domain', weakness: 'Forced analogies' },
      fromA: 'Multi-component framework',
      fromB: 'Cross-domain source selection',
      integrationPoint: 'Analogical multi-component replacement',
      hybrid: { name: 'Analogical Multi-Substitute', fullProtocol: 'Combined protocol...', expectedImprovement: 'Higher novelty + systematic' }
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(crossoverOutput))])]);
    const { methodEvolveCrossover } = await import('../../src/tools/method-evolve-crossover.js');
    const crossover = await methodEvolveCrossover({
      methodA: mutation.mutatedMethod.fullProtocol,
      methodB: '# Analogical Transfer\nFind cross-domain analogies...',
      trackRecords: 'Multi-Sub: 0 uses (new). Analogical: 10 uses, 4 ideas.',
      context: 'NLP attention mechanisms',
      _model: faux.getModel(),
    });
    expect(crossover.hybrid.name).toBeTruthy();
    expect(crossover.hybrid.fullProtocol).toBeTruthy();

    // Step 3: Evaluate hybrid vs original
    const evaluateOutput = {
      criteria: [
        { criterion: 'Novelty', methodA: 'High', methodB: 'Medium', winner: 'A' as const },
        { criterion: 'Feasibility', methodA: 'Medium', methodB: 'High', winner: 'B' as const },
      ],
      overallWinner: 'A' as const,
      confidence: 'Medium' as const,
      eloUpdateSuggestion: { winner: '+20', loser: '-20' }
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(evaluateOutput))])]);
    const { methodEvolveEvaluate } = await import('../../src/tools/method-evolve-evaluate.js');
    const evaluation = await methodEvolveEvaluate({
      methodA: crossover.hybrid.fullProtocol,
      outputA: '5 ideas generated...',
      methodB: '# SCAMPER Substitute (original)\nReplace components...',
      outputB: '3 ideas generated...',
      criteria: 'novelty, feasibility',
      _model: faux.getModel(),
    });
    expect(evaluation.overallWinner).toMatch(/^(A|B|Tie)$/);
    expect(evaluation.criteria.length).toBeGreaterThan(0);
  });
});

// Test all P3 SKILL.md files have correct frontmatter
describe('P3 SKILL.md frontmatter validation', () => {
  const skillFiles = [
    { path: 'skills/sop/method-mutate/SKILL.md', expectedType: 'sop', expectedLayer: 'sop' },
    { path: 'skills/sop/method-crossover/SKILL.md', expectedType: 'sop', expectedLayer: 'sop' },
    { path: 'skills/sop/method-evaluate/SKILL.md', expectedType: 'sop', expectedLayer: 'sop' },
    { path: 'skills/tactic/method-evolution/SKILL.md', expectedType: 'tactic', expectedLayer: 'tactic' },
    { path: 'skills/strategy/paper-writing/SKILL.md', expectedType: 'strategy', expectedLayer: 'strategy' },
    { path: 'skills/strategy/method-evolve/SKILL.md', expectedType: 'strategy', expectedLayer: 'strategy' },
  ];

  for (const { path: relPath, expectedType, expectedLayer } of skillFiles) {
    it(`${relPath} has valid frontmatter`, () => {
      // Go up from packages/agents to repo root
      const repoRoot = join(process.cwd(), '../..');
      const fullPath = join(repoRoot, relPath);
      expect(existsSync(fullPath), `File ${relPath} should exist`).toBe(true);

      const content = readFileSync(fullPath, 'utf-8');
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      expect(fmMatch, `${relPath} should have YAML frontmatter`).toBeTruthy();

      // Simple YAML field extraction (no yaml dependency needed)
      const fmText = fmMatch![1];
      const typeMatch = fmText.match(/^type:\s*(.+)$/m);
      const layerMatch = fmText.match(/^layer:\s*(.+)$/m);
      expect(typeMatch, `${relPath} should have type field`).toBeTruthy();
      expect(layerMatch, `${relPath} should have layer field`).toBeTruthy();
      expect(typeMatch![1].trim()).toBe(expectedType);
      expect(layerMatch![1].trim()).toBe(expectedLayer);
    });
  }
});
