import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { surgeryRedirect } from '../../src/tools/surgery-redirect.js';

describe('surgeryRedirect', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate redirection variants', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'Redirect pose predictor as a data augmentation engine for downstream tasks',
          description: 'Instead of using the GNN to predict final docking poses for drug candidates, redirect its output as a generator of diverse binding conformations to augment molecular property datasets',
          mutationType: 'redirect',
          explanation: 'The pose predictor encodes rich structural knowledge about protein-ligand complementarity; redirecting it as a conformation generator provides physically meaningful augmentation for ADMET and toxicity prediction tasks that currently rely on 2D molecular graphs only',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Redirect binding affinity signal as a curriculum learning guide for pretraining',
          description: 'Instead of using binding affinity as the final evaluation metric, redirect it as a difficulty signal for curriculum pretraining — train the GNN on easy binders first, progressively introducing challenging low-affinity molecules',
          mutationType: 'redirect',
          explanation: 'Binding affinity provides a natural difficulty ordering (high affinity = structurally clear interaction); redirecting it to organize the training curriculum exploits domain knowledge to guide representation learning rather than just evaluate it',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Redirected two components: the pose predictor (from end-goal to augmentation engine) and the affinity signal (from evaluation metric to curriculum guide). Both redirections repurpose domain-specific outputs to solve orthogonal ML problems.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await surgeryRedirect({
      idea: '{"title":"GNN molecular docking","description":"Graph neural network predicting protein-ligand binding poses using message passing over molecular graphs"}',
      context: 'Drug discovery domain. Current state-of-art uses GNNs with RMSD as primary docking evaluation metric.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('redirect');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
