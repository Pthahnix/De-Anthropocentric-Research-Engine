import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { scamperSubstitute } from '../../src/tools/scamper-substitute.js';
import { surgerySubtract } from '../../src/tools/surgery-subtract.js';
import { facetBisociation } from '../../src/tools/facet-bisociation.js';
import { reviewer2Hat } from '../../src/tools/reviewer2-hat.js';

describe('P2 IDEATION E2E', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should run SCAMPER substitute + Surgery subtract on a test idea', async () => {
    faux = registerFauxProvider();

    const scamperMock = {
      variants: [
        {
          title: 'Replace GNN message passing with attention-based aggregation',
          description: 'Substitute the standard GNN message passing with multi-head attention over neighbor embeddings',
          mutationType: 'substitute',
          explanation: 'Attention-based aggregation can capture more nuanced neighbor relationships',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Substituting the core aggregation mechanism opens up the attention-based GNN design space',
    };

    const surgeryMock = {
      variants: [
        {
          title: 'Remove edge feature MLP — test if edge attributes are redundant',
          description: 'Subtract the edge feature MLP and rely solely on node features and graph topology',
          mutationType: 'subtract',
          explanation: 'If performance holds without edge features, the model is simpler and faster',
          noveltyEstimate: 'low' as const,
        },
      ],
      explanation: 'Subtracting the edge feature MLP reveals whether edge attributes contribute meaningfully',
    };

    faux.setResponses([
      fauxAssistantMessage([fauxText(JSON.stringify(scamperMock))]),
      fauxAssistantMessage([fauxText(JSON.stringify(surgeryMock))]),
    ]);

    const scamperResult = await scamperSubstitute({
      idea: JSON.stringify({ title: 'GNN-based molecular docking', description: 'Use graph neural networks for protein-ligand binding prediction' }),
      context: 'Drug discovery, structure-based methods',
      _model: faux.getModel(),
    });

    expect(scamperResult.variants.length).toBeGreaterThanOrEqual(1);
    expect(scamperResult.variants[0].mutationType).toBe('substitute');

    const surgeryResult = await surgerySubtract({
      idea: JSON.stringify({ title: 'GNN-based molecular docking', description: 'Use graph neural networks for protein-ligand binding prediction' }),
      context: 'Drug discovery, structure-based methods',
      _model: faux.getModel(),
    });

    expect(surgeryResult.variants.length).toBeGreaterThanOrEqual(1);
    expect(surgeryResult.variants[0].mutationType).toBe('subtract');
  });

  it('should run facet bisociation across domains', async () => {
    faux = registerFauxProvider();

    const bisociationMock = {
      connections: [
        {
          facetAElement: 'Attention-based feature selection in vision transformers',
          facetBElement: 'Binding pocket shape complementarity in docking',
          connectionType: 'mechanism_analogy' as const,
          strength: 'strong' as const,
        },
      ],
      hybridIdeas: [
        {
          title: 'Attention-guided molecular docking with learned pocket focus',
          description: 'Apply vision transformer attention patterns to selectively weight binding pocket residues during docking score computation',
          mutationType: 'bisociation',
          explanation: 'Cross-domain transfer from computer vision attention to molecular docking attention',
          noveltyEstimate: 'high' as const,
        },
      ],
      explanation: 'Vision transformer attention mechanisms transfer naturally to molecular structure analysis',
    };

    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(bisociationMock))])]);

    const result = await facetBisociation({
      facetA: JSON.stringify({
        domain: 'computer_vision',
        elements: ['attention mechanisms', 'patch embedding', 'positional encoding'],
      }),
      facetB: JSON.stringify({
        domain: 'molecular_biology',
        elements: ['binding pocket', 'ligand conformations', 'docking scores'],
      }),
      context: 'Finding novel approaches to molecular docking by borrowing from computer vision',
      _model: faux.getModel(),
    });

    expect(result.connections.length).toBeGreaterThan(0);
    expect(result.connections[0].strength).toMatch(/weak|moderate|strong/);
    expect(result.hybridIdeas.length).toBeGreaterThanOrEqual(1);
    expect(result.hybridIdeas[0].mutationType).toBe('bisociation');
  });

  it('should simulate truncated ideation strategy: generate -> augment -> review', async () => {
    faux = registerFauxProvider();

    // Step 1: Generate via SCAMPER
    const generateMock = {
      variants: [
        {
          title: 'Replace fixed docking grid with learned spatial representation',
          description: 'Use a neural field instead of a discrete grid for the docking search space',
          mutationType: 'substitute',
          explanation: 'Neural fields can represent continuous spatial information more efficiently',
          noveltyEstimate: 'high' as const,
        },
      ],
      explanation: 'Substituting discrete grids with neural fields is a promising direction',
    };

    // Step 2: Cross-pollinate via bisociation
    const crossPollinateMock = {
      connections: [
        {
          facetAElement: 'Neural radiance fields (NeRF)',
          facetBElement: 'Molecular docking energy landscape',
          connectionType: 'problem_similarity' as const,
          strength: 'moderate' as const,
        },
      ],
      hybridIdeas: [
        {
          title: 'DockNeRF — implicit neural docking energy field',
          description: 'Represent the protein-ligand interaction energy as a neural radiance field, enabling continuous pose optimization',
          mutationType: 'bisociation',
          explanation: 'NeRF techniques for continuous 3D representation transfer to docking energy landscapes',
          noveltyEstimate: 'high' as const,
        },
      ],
      explanation: 'NeRF-to-docking transfer creates a novel implicit docking paradigm',
    };

    // Step 3: Review via reviewer2
    const reviewMock = {
      critiques: [
        {
          category: 'methodology' as const,
          severity: 'major' as const,
          critique: 'Neural field evaluation at every pose is O(n) per query, potentially slower than grid lookup',
          suggestion: 'Use a coarse grid for initial screening, then refine with neural field',
        },
      ],
      fatalFlaw: '',
      improvedVariants: [
        {
          title: 'Hierarchical DockNeRF — coarse grid + neural field refinement',
          description: 'Use traditional grid for coarse screening, then switch to neural field for top-K pose refinement',
          mutationType: 'reviewer2_improvement',
          explanation: 'Addresses the computational cost concern while keeping the neural field advantage for fine-grained poses',
          noveltyEstimate: 'high' as const,
        },
      ],
      overallAssessment: 'Promising idea with one major computational concern — hierarchical approach resolves it',
    };

    faux.setResponses([
      fauxAssistantMessage([fauxText(JSON.stringify(generateMock))]),
      fauxAssistantMessage([fauxText(JSON.stringify(crossPollinateMock))]),
      fauxAssistantMessage([fauxText(JSON.stringify(reviewMock))]),
    ]);

    // Step 1: Generate
    const generated = await scamperSubstitute({
      idea: JSON.stringify({ title: 'Grid-based molecular docking', description: 'Traditional grid-based docking with AutoDock Vina' }),
      context: 'Improving molecular docking accuracy and speed',
      _model: faux.getModel(),
    });
    expect(generated.variants.length).toBeGreaterThanOrEqual(1);

    // Step 2: Cross-pollinate
    const crossPollinated = await facetBisociation({
      facetA: JSON.stringify({ domain: '3d_reconstruction', elements: ['NeRF', 'implicit representation', 'differentiable rendering'] }),
      facetB: JSON.stringify({ domain: 'molecular_docking', elements: ['energy landscape', 'pose optimization', 'scoring function'] }),
      context: 'Neural representation methods for molecular docking',
      _model: faux.getModel(),
    });
    expect(crossPollinated.hybridIdeas.length).toBeGreaterThanOrEqual(1);

    // Step 3: Review
    const reviewed = await reviewer2Hat({
      idea: JSON.stringify(crossPollinated.hybridIdeas[0]),
      context: 'Evaluating DockNeRF for practical drug discovery',
      _model: faux.getModel(),
    });
    expect(reviewed.improvedVariants.length).toBeGreaterThanOrEqual(1);
    expect(reviewed.improvedVariants[0].mutationType).toBe('reviewer2_improvement');

    // Verify the full chain produced usable output
    expect(reviewed.overallAssessment).toBeTruthy();
  });
});
