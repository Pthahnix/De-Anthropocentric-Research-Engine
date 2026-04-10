import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { surgeryMultiply } from '../../src/tools/surgery-multiply.js';

describe('surgeryMultiply', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate multiplication variants', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'Multi-scale GNN ensemble with resolution-specific heads',
          description: 'Multiply the single GNN into a hierarchy of models operating at atom, residue, and domain scales, each contributing to the final binding prediction',
          mutationType: 'multiply',
          explanation: 'A single-scale GNN misses multi-resolution dependencies; multiplying into a hierarchical ensemble captures both local bonding interactions and global protein shape simultaneously',
          noveltyEstimate: 'medium' as const,
        },
        {
          title: 'Diverse pose ensemble with uncertainty-aware aggregation',
          description: 'Instead of one predicted pose, generate N diverse poses using a stochastic GNN and aggregate predictions with learned uncertainty weights',
          mutationType: 'multiply',
          explanation: 'Protein-ligand binding is inherently multi-modal; multiplying pose predictions and weighting by confidence captures binding mode diversity that a single pose cannot represent',
          noveltyEstimate: 'high' as const,
        },
      ],
      explanation: 'Multiplied two components: the GNN itself (into a multi-scale hierarchy) and the pose output (into a diverse ensemble). Both multiplications address the single-instance limitation of the original approach.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await surgeryMultiply({
      idea: '{"title":"GNN molecular docking","description":"Graph neural network predicting protein-ligand binding poses using message passing over molecular graphs"}',
      context: 'Drug discovery domain. Current state-of-art uses GNNs with RMSD as primary docking evaluation metric.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('multiply');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
