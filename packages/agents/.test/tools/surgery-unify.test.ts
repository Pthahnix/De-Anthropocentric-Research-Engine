import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { surgeryUnify } from '../../src/tools/surgery-unify.js';

describe('surgeryUnify', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate unification variants', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'Unified protein-ligand graph with shared message passing',
          description: 'Merge the separate protein encoder and ligand encoder into a single bipartite graph where protein atoms and ligand atoms share the same message passing network',
          mutationType: 'unify',
          explanation: 'Separate encoders require explicit cross-attention to model protein-ligand interaction; a unified graph naturally models mutual information flow, enabling the protein to guide ligand representation and vice versa from the first layer',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Joint pose + affinity prediction via unified output head',
          description: 'Merge the separate pose decoder and affinity prediction head into a single energy-based model whose minimum defines both the optimal pose and predicted binding energy simultaneously',
          mutationType: 'unify',
          explanation: 'Decoupled pose and affinity heads can be inconsistent — the predicted pose may not match the affinity score. A unified energy landscape ensures the pose that minimizes energy is also the pose used for affinity',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Unified two component pairs: protein + ligand encoders (into a shared bipartite graph) and pose + affinity heads (into a unified energy model). Both unifications remove artificial boundaries that cause representation inconsistency.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await surgeryUnify({
      idea: '{"title":"GNN molecular docking","description":"Graph neural network predicting protein-ligand binding poses using message passing over molecular graphs"}',
      context: 'Drug discovery domain. Current state-of-art uses GNNs with RMSD as primary docking evaluation metric.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('unify');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
