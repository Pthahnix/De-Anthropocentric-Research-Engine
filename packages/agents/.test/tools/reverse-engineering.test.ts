import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { reverseEngineering } from '../../src/tools/reverse-engineering.js';

describe('reverseEngineering', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate worst ideas and invert them into novel solutions', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      worstIdeas: [
        {
          idea: 'Use a completely random scoring function for molecular docking',
          whyBad: 'Random scores would produce meaningless pose rankings with no correlation to binding affinity',
          inversion: 'Use multiple complementary scoring functions and ensemble their predictions for robust ranking',
          inversionQuality: 'interesting' as const,
        },
        {
          idea: 'Train on only one protein-ligand pair',
          whyBad: 'No generalization — the model would memorize the single training example',
          inversion: 'Curate maximally diverse training set spanning all protein families and ligand chemotypes',
          inversionQuality: 'obvious' as const,
        },
        {
          idea: 'Ignore all physics and treat docking as random string matching',
          whyBad: 'Loses all physical inductive bias — molecular interactions follow physical laws',
          inversion: 'Inject physics priors directly into the model architecture via force-field-aware message passing',
          inversionQuality: 'surprising' as const,
        },
      ],
      variants: [
        {
          title: 'Multi-scoring consensus docking with heterogeneous ensembles',
          description: 'Ensemble 3+ heterogeneous scoring functions (physics-based MM/GBSA, ML-based GNN score, knowledge-based DrugScore) to produce robust pose ranking via majority vote',
          mutationType: 'reverse_brainstorm',
          explanation: 'Inverting "random scoring" reveals that scoring diversity — not just accuracy — is the key to robustness. Ensemble disagreement can flag unreliable predictions.',
          noveltyEstimate: 'medium' as const,
        },
        {
          title: 'Physics-informed GNN for docking with force-field message passing',
          description: 'Embed Lennard-Jones and electrostatic potentials directly into GNN edge features, making the network architecture respect physical interaction types',
          mutationType: 'reverse_brainstorm',
          explanation: 'Inverting "ignore physics" shows that the ideal model architecture should have physics baked in, not learned from scratch.',
          noveltyEstimate: 'high' as const,
        },
      ],
      explanation: 'Reverse brainstorming revealed two key insights: (1) scoring diversity matters as much as individual accuracy, (2) physics priors should be architectural, not just data-driven.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await reverseEngineering({
      problem: 'How to improve molecular docking accuracy and reduce false positives in virtual screening campaigns',
      context: 'Current docking methods have 30-50% false positive rates. Physics-based and ML-based approaches have complementary strengths.',
      _model: faux.getModel(),
    });

    expect(result.worstIdeas.length).toBeGreaterThan(0);
    expect(result.worstIdeas[0].inversionQuality).toMatch(/obvious|interesting|surprising/);
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('reverse_brainstorm');
    expect(result.variants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.explanation).toBeTruthy();
  });
});
