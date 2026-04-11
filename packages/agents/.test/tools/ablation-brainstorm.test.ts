import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { ablationBrainstorm } from '../../src/tools/ablation-brainstorm.js';

describe('ablationBrainstorm', () => {
  let faux: ReturnType<typeof registerFauxProvider>;
  afterEach(() => { if (faux) faux.unregister(); });

  it('should decompose SOTA and brainstorm ablations', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      sotaDecomposition: [
        {
          component: 'E(n) equivariant message passing',
          role: 'Ensures predictions are invariant to rotation/translation',
          ablations: [
            { type: 'remove' as const, description: 'Remove equivariance constraint', expectedOutcome: 'Model must learn symmetry from data, needs much more data', interestLevel: 'interesting' as const },
            { type: 'replace' as const, description: 'Replace with SE(3) transformer attention', expectedOutcome: 'Higher expressivity but slower', interestLevel: 'interesting' as const },
            { type: 'scale' as const, description: 'Use 10x more message passing layers', expectedOutcome: 'Over-smoothing problem, possibly diminishing returns', interestLevel: 'surprising' as const },
          ],
        },
        {
          component: 'Physics-based scoring function',
          role: 'Evaluates binding pose quality using force fields',
          ablations: [
            { type: 'remove' as const, description: 'Remove physics scoring entirely', expectedOutcome: 'Pure ML scoring, faster but less interpretable', interestLevel: 'interesting' as const },
            { type: 'replace' as const, description: 'Replace with graph neural network scorer', expectedOutcome: 'Data-driven scoring, potentially better generalization', interestLevel: 'interesting' as const },
          ],
        },
      ],
      variants: [
        {
          title: 'Data-augmented equivariance-free docking',
          description: 'Remove equivariance constraints, instead augment training data with random rotations/translations to learn approximate symmetry',
          mutationType: 'ablation_brainstorm',
          explanation: 'Ablating equivariance reveals that data augmentation might be a cheaper alternative to architectural constraints',
          noveltyEstimate: 'high' as const,
        },
      ],
      explanation: 'Key finding: removing equivariance is the most interesting ablation.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await ablationBrainstorm({
      sotaComponents: JSON.stringify([
        'E(n) equivariant message passing',
        'Physics-based scoring function',
        'Confidence-based pose selection',
      ]),
      context: 'SOTA molecular docking method (e.g., DiffDock). Which components are essential?',
      _model: faux.getModel(),
    });

    expect(result.sotaDecomposition.length).toBeGreaterThanOrEqual(2);
    expect(result.sotaDecomposition[0].ablations.length).toBeGreaterThanOrEqual(2);
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('ablation_brainstorm');
    expect(result.explanation).toBeTruthy();
  });
});
