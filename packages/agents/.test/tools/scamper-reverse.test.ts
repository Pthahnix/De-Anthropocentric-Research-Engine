import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { scamperReverse } from '../../src/tools/scamper-reverse.js';

describe('scamperReverse', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate reversal variants by inverting assumptions and directions', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'Inverse Docking: Given a Molecule, Find Its Protein Targets',
          description: 'Reverse the input-output direction — instead of given a target, find the best ligand, take a ligand and predict all proteins it likely binds',
          mutationType: 'reverse',
          explanation: 'Inverse docking is a well-recognized but underexplored problem; reversing the prediction direction opens drug repurposing and off-target prediction as immediate applications',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Repulsion-First Docking: Learn What Does Not Bind',
          description: 'Invert the training objective from maximizing binding affinity to maximizing non-binding discrimination — learn the repulsion landscape first',
          mutationType: 'reverse',
          explanation: 'Non-binders are orders of magnitude more common than binders; flipping the objective leverages this abundance and may produce sharper decision boundaries',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Inverted the input-output direction (ligand→protein) and the training objective (binding→non-binding). Both reveal dual problems with distinct practical value.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await scamperReverse({
      idea: '{"title":"GNN molecular docking","description":"Given a protein target, predict the optimal binding pose and affinity of candidate ligand molecules"}',
      context: 'Drug discovery. Current methods optimize for binding affinity prediction. Most training data is imbalanced toward non-binders.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('reverse');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
