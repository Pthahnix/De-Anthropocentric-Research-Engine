import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { scamperSubstitute } from '../../src/tools/scamper-substitute.js';

describe('scamperSubstitute', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate substitution variants', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'Replace GNN with Transformer for molecular representation',
          description: 'Use attention-based architecture instead of message passing to capture long-range molecular interactions',
          mutationType: 'substitute',
          explanation: 'Transformers handle long-range dependencies better than GNNs, which suffer from over-smoothing at depth',
          noveltyEstimate: 'medium' as const,
        },
        {
          title: 'Substitute RMSD evaluation with binding free energy',
          description: 'Replace geometric docking score with thermodynamic binding affinity as the optimization target',
          mutationType: 'substitute',
          explanation: 'Free energy is more physically meaningful than geometric similarity and better predicts experimental outcomes',
          noveltyEstimate: 'high' as const,
        },
      ],
      explanation: 'Analyzed method components for substitution opportunities. Key targets: backbone architecture (GNN→Transformer) and evaluation metric (RMSD→free energy).',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await scamperSubstitute({
      idea: '{"title":"GNN molecular docking","description":"Graph neural network predicting protein-ligand binding poses using message passing over molecular graphs"}',
      context: 'Drug discovery domain. Current state-of-art uses GNNs with RMSD as primary docking evaluation metric.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('substitute');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
