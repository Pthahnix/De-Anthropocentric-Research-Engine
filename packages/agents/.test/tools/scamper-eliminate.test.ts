import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { scamperEliminate } from '../../src/tools/scamper-eliminate.js';

describe('scamperEliminate', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate elimination variants by removing non-essential components', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'Label-Free Self-Supervised Docking via Contrastive Learning',
          description: 'Eliminate the need for docking pose labels by using contrastive learning on known binder/non-binder pairs to learn binding geometry implicitly',
          mutationType: 'eliminate',
          explanation: 'Removing label dependency makes the method applicable to the vast majority of protein-ligand pairs where experimental docking data is unavailable',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Zero-Shot Docking via Foundation Model Transfer',
          description: 'Eliminate the training stage entirely by prompting a pre-trained protein language model with binding site descriptions',
          mutationType: 'eliminate',
          explanation: 'If foundation models encode sufficient structural knowledge, removing the specialized training stage dramatically reduces cost and enables immediate deployment on new targets',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Questioned necessity of labeled training data and the specialized training stage. Both eliminations address the data bottleneck that limits deployment of current docking systems.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await scamperEliminate({
      idea: '{"title":"Supervised molecular docking with GNN","description":"Graph neural network trained on labeled protein-ligand docking poses to predict binding affinity and geometry"}',
      context: 'Drug discovery. Labeled docking data is expensive to obtain. Most targets lack experimental binding data.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('eliminate');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
