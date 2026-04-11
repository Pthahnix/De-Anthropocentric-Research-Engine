import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { surgeryDivide } from '../../src/tools/surgery-divide.js';

describe('surgeryDivide', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate division variants', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'Decomposed docking: pocket detection + ligand pose + affinity scoring as separate modules',
          description: 'Split the monolithic GNN into three specialized sub-networks: (1) pocket detector, (2) pose generator conditioned on pocket, (3) affinity scorer conditioned on pose',
          mutationType: 'divide',
          explanation: 'The single GNN tries to simultaneously solve pocket finding, 3D pose generation, and affinity prediction — decomposing into modules allows each sub-problem to be supervised independently and enables swapping components',
          noveltyEstimate: 'medium' as const,
        },
        {
          title: 'Divide message passing into local bonding and global shape passes',
          description: 'Split message passing into two independent rounds: a local pass within 2 hops for chemical bonding features, and a global pass across the full graph for shape complementarity',
          mutationType: 'divide',
          explanation: 'Single-pass GNNs conflate local chemical interactions with global structural fit; dividing into two specialized passes allows separate inductive biases and prevents information mixing',
          noveltyEstimate: 'high' as const,
        },
      ],
      explanation: 'Divided the monolithic GNN into pipeline sub-modules and divided the message passing into specialized local/global rounds. Both divisions expose hidden sub-problems that benefit from independent supervision.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await surgeryDivide({
      idea: '{"title":"GNN molecular docking","description":"Graph neural network predicting protein-ligand binding poses using message passing over molecular graphs"}',
      context: 'Drug discovery domain. Current state-of-art uses GNNs with RMSD as primary docking evaluation metric.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('divide');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
