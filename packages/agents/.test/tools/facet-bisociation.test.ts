import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { facetBisociation } from '../../src/tools/facet-bisociation.js';

describe('facetBisociation', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate cross-domain bisociation hybrid ideas', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      connections: [
        {
          facetAElement: 'Attention mechanism for sequence modeling',
          facetBElement: 'Message passing for graph structure',
          connectionType: 'mechanism_analogy' as const,
          strength: 'strong' as const,
        },
        {
          facetAElement: 'Query-key-value dot-product scoring',
          facetBElement: 'Edge weight aggregation in neighborhood',
          connectionType: 'mechanism_analogy' as const,
          strength: 'moderate' as const,
        },
      ],
      hybridIdeas: [
        {
          title: 'Graph-Transformer with attention-augmented message passing',
          description: 'Replace standard GNN message passing with transformer-style attention, letting each node attend over its neighbors using learned query-key dot products rather than fixed aggregation',
          mutationType: 'bisociation',
          explanation: 'Connects sequence attention with graph structure: both compute weighted aggregation over a set of elements, differing only in how the set is defined (position vs. adjacency)',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Positional encoding from graph topology for transformers on graphs',
          description: 'Derive positional encodings from graph Laplacian eigenvectors to inject structural awareness into transformer attention on molecular graphs',
          mutationType: 'bisociation',
          explanation: 'Transformer positional encodings solve sequence order; graph Laplacian encodes topology — bisociation yields topology-aware attention',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Strong structural analogy between attention and message passing: both aggregate information from a set weighted by learned scores. This bisociation enables hybrid architectures that combine long-range sequence reasoning with local graph topology.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await facetBisociation({
      facetA: JSON.stringify({ purpose: 'sequence modeling', mechanism: 'multi-head self-attention with query-key-value dot products', evaluation: 'BLEU score on translation' }),
      facetB: JSON.stringify({ purpose: 'molecular property prediction', mechanism: 'graph neural network message passing over atom-bond graph', evaluation: 'RMSE on binding affinity' }),
      context: 'Research on unified architectures for NLP and molecular biology. Domain: cross-domain deep learning.',
      _model: faux.getModel(),
    });

    expect(result.connections.length).toBeGreaterThanOrEqual(1);
    expect(result.connections[0].connectionType).toMatch(/mechanism_analogy|problem_similarity|evaluation_transfer/);
    expect(result.connections[0].strength).toMatch(/weak|moderate|strong/);
    expect(result.hybridIdeas.length).toBeGreaterThanOrEqual(1);
    expect(result.hybridIdeas[0].mutationType).toBe('bisociation');
    expect(result.hybridIdeas[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.explanation).toBeTruthy();
  });
});
