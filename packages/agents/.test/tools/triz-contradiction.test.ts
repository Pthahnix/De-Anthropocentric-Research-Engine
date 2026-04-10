import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { trizContradiction } from '../../src/tools/triz-contradiction.js';

describe('trizContradiction', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should resolve contradiction with TRIZ principles', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      contradiction: {
        type: 'technical' as const,
        metricX: 'Docking speed',
        metricY: 'Binding prediction accuracy',
        description: 'Faster screening reduces conformational sampling, lowering accuracy',
      },
      appliedPrinciples: [
        { number: 1, name: 'Segmentation', application: 'Break docking into coarse-grained filtering + fine-grained scoring stages' },
        { number: 35, name: 'Parameter Change', application: 'Use adaptive resolution: low resolution for initial poses, high resolution for top candidates' },
      ],
      variants: [
        {
          title: 'Coarse-to-fine hierarchical docking',
          description: 'Two-stage approach: fast GNN-based coarse filter followed by physics-based fine scoring on top 10%',
          mutationType: 'triz_resolution',
          explanation: 'Principle #1 (Segmentation) resolves speed/accuracy by separating filtering from scoring',
          noveltyEstimate: 'high' as const,
        },
      ],
      explanation: 'Technical contradiction between speed and accuracy resolved via segmentation and parameter change principles.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await trizContradiction({
      idea: '{"title":"GNN molecular docking","description":"Graph neural network predicting protein-ligand binding poses using message passing over molecular graphs"}',
      metricX: 'Docking speed',
      metricY: 'Binding prediction accuracy',
      context: 'Drug discovery domain. Need to screen millions of compounds quickly while maintaining high accuracy for binding pose prediction.',
      _model: faux.getModel(),
    });

    expect(result.contradiction.type).toBe('technical');
    expect(result.appliedPrinciples.length).toBeGreaterThan(0);
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('triz_resolution');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
