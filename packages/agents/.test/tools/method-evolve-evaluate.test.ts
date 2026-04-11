import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { methodEvolveEvaluate } from '../../src/tools/method-evolve-evaluate.js';

describe('methodEvolveEvaluate', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should compare two methods and return structured evaluation result with Elo suggestion', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      criteria: [
        { criterion: 'Novelty of generated ideas', methodA: 'Produced incremental improvements', methodB: 'Produced radical recombination', winner: 'B' },
        { criterion: 'Feasibility of implementation', methodA: 'Straightforward, 2 weeks', methodB: 'Requires redesign, 2 months', winner: 'A' },
        { criterion: 'Diversity of idea variants', methodA: '3 similar variants', methodB: '5 diverse variants', winner: 'B' },
      ],
      overallWinner: 'B',
      confidence: 'Medium',
      eloUpdateSuggestion: { winner: '+24', loser: '-24' },
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await methodEvolveEvaluate({
      methodA: '## SCAMPER Substitute\nReplace a component of the idea with something else.',
      outputA: 'Idea: Replace binding pocket residues with computational analogs. Incremental improvement on existing approach.',
      methodB: '## Analogical Substitution\nUse cross-domain analogy to find replacement candidates.',
      outputB: 'Idea 1: Replace protein docking with RNA aptamer binding inspired by immunology. Idea 2: Use metamaterial acoustic analogy for receptor resonance. Highly novel directions.',
      criteria: 'novelty, feasibility, diversity',
      _model: faux.getModel(),
    });

    expect(result.criteria.length).toBeGreaterThan(0);
    expect(result.criteria[0].criterion).toBeTruthy();
    expect(result.criteria[0].methodA).toBeTruthy();
    expect(result.criteria[0].methodB).toBeTruthy();
    expect(result.criteria[0].winner).toMatch(/A|B|Tie/);
    expect(result.overallWinner).toMatch(/A|B|Tie/);
    expect(result.confidence).toMatch(/High|Medium|Low/);
    expect(result.eloUpdateSuggestion.winner).toBeTruthy();
    expect(result.eloUpdateSuggestion.loser).toBeTruthy();
  });
});
