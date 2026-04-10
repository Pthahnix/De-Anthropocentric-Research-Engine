import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { selfReview } from '../../src/tools/self-review.js';

describe('selfReview', () => {
  let faux: ReturnType<typeof registerFauxProvider>;
  afterEach(() => { if (faux) faux.unregister(); });

  it('should ACCEPT a strong gap claim', async () => {
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify({
      verdict: 'ACCEPT',
      confidence: 0.85,
      criticPoints: ['Could be addressed by unpublished work'],
      defensePoints: ['Systematic survey of 50+ papers found no solution'],
      judgeReasoning: 'Evidence strongly supports the gap exists. Critic concern is speculative.',
    }))])]);
    const result = await selfReview({
      artifact: 'No existing method handles protein-ligand docking with flexible side chains in under 1 second.',
      artifactType: 'gap',
      context: 'Survey of 50 papers on molecular docking methods (2020-2025).',
      _model: faux.getModel(),
    });
    expect(result.verdict).toBe('ACCEPT');
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.criticPoints.length).toBeGreaterThanOrEqual(1);
  });

  it('should REVISE a weak idea with suggestions', async () => {
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify({
      verdict: 'REVISE',
      confidence: 0.6,
      criticPoints: ['No comparison with existing GNN approaches', 'Scalability unclear'],
      defensePoints: ['Novel combination of attention + message passing'],
      judgeReasoning: 'Idea has merit but needs stronger positioning against existing work.',
      revisionSuggestions: ['Add comparison with SchNet and DimeNet', 'Address scalability to large molecules'],
    }))])]);
    const result = await selfReview({
      artifact: 'Use transformer attention for molecular property prediction on 3D graphs.',
      artifactType: 'idea',
      context: 'Research on geometric deep learning for molecules.',
      _model: faux.getModel(),
    });
    expect(result.verdict).toBe('REVISE');
    expect(result.revisionSuggestions).toBeDefined();
    expect(result.revisionSuggestions!.length).toBeGreaterThanOrEqual(1);
  });
});
