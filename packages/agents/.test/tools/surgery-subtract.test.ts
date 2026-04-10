import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { surgerySubtract } from '../../src/tools/surgery-subtract.js';

describe('surgerySubtract', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate subtraction variants', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'GNN without explicit graph construction — learn topology from data',
          description: 'Remove the hand-crafted molecular graph and let the model infer atom connectivity from raw coordinates',
          mutationType: 'subtract',
          explanation: 'Removing the fixed graph structure forces the model to learn which atom pairs interact, potentially discovering non-bonded interactions missed by chemistry heuristics',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Docking without RMSD supervision — use only binding affinity labels',
          description: 'Remove geometric pose supervision; train only on experimental binding affinity, letting the model define its own notion of a good pose',
          mutationType: 'subtract',
          explanation: 'RMSD depends on a crystal reference that may not represent the bioactive pose; removing it may yield models that optimize for what actually matters experimentally',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Subtracted two key components: the molecular graph (forcing topology learning) and the RMSD objective (forcing affinity-first training). Both removals expose assumptions worth challenging.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await surgerySubtract({
      idea: '{"title":"GNN molecular docking","description":"Graph neural network predicting protein-ligand binding poses using message passing over molecular graphs"}',
      context: 'Drug discovery domain. Current state-of-art uses GNNs with RMSD as primary docking evaluation metric.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('subtract');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
