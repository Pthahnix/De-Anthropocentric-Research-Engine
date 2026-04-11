import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { axiomNegation } from '../../src/tools/axiom-negation.js';

describe('axiomNegation', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should negate assumption and generate PO variants', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      assumption: 'Molecular docking requires explicit 3D structure of the receptor',
      provocation: 'PO: Molecular docking does NOT require explicit 3D receptor structure',
      consequences: [
        'Could dock against sequence-derived representations',
        'Could use language model embeddings of protein sequences',
        'Opens the door to docking against unresolved protein targets',
      ],
      variants: [
        {
          title: 'Sequence-based virtual screening without 3D structures',
          description: 'Use protein language model embeddings (ESM-2) as the receptor representation for docking, bypassing the need for solved crystal structures',
          mutationType: 'axiom_negation',
          explanation: 'Negating the 3D structure requirement reveals that sequence embeddings might encode enough binding information for coarse virtual screening',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'AlphaFold-conditioned docking without experimental structures',
          description: 'Use AlphaFold2 predicted structures as docking targets with confidence-weighted scoring',
          mutationType: 'axiom_negation',
          explanation: 'If we relax "requires explicit structure" to "requires any structure estimate", predicted structures become viable targets',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Negating the 3D structure assumption opens an entirely new approach to virtual screening for targets without solved structures.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await axiomNegation({
      assumption: 'Molecular docking requires explicit 3D structure of the receptor',
      context: 'Structure-based drug design. Many disease-relevant targets (e.g., intrinsically disordered proteins) lack solved structures.',
      _model: faux.getModel(),
    });

    expect(result.assumption).toBeTruthy();
    expect(result.provocation).toContain('PO:');
    expect(result.consequences.length).toBeGreaterThan(0);
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('axiom_negation');
    expect(result.variants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.explanation).toBeTruthy();
  });
});
