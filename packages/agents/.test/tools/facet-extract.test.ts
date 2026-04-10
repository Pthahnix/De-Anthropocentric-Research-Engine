// packages/agents/.test/tools/facet-extract.test.ts
import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { facetExtract } from '../../src/tools/facet-extract.js';

describe('facetExtract', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should extract a valid Facet triple from paper content', async () => {
    const expected: import('../../src/tools/facet-extract.js').FacetResult = {
      purpose: 'Enable efficient attention computation over long sequences without quadratic memory cost',
      mechanism: 'Replace softmax attention with linear attention using random feature kernel approximation',
      evaluation: 'perplexity on WikiText-103 and LRA benchmark; wall-clock speedup vs vanilla Transformer',
      paperTitle: 'linear_attention_transformers',
    };
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await facetExtract({
      paperMarkdown: '# Linear Attention Transformers\n\nWe propose replacing softmax attention with a linear kernel-based mechanism that reduces the quadratic complexity of self-attention to linear. Our method uses random feature maps to approximate the softmax kernel. We evaluate on WikiText-103 (perplexity) and the Long Range Arena benchmark, achieving 2.5x speedup with minimal quality loss.',
      normalizedTitle: 'linear_attention_transformers',
      _model: faux.getModel(),
    });

    expect(result.purpose).toContain('attention');
    expect(result.mechanism).toContain('kernel');
    expect(result.evaluation).toContain('perplexity');
    expect(result.paperTitle).toBe('linear_attention_transformers');
  });

  it('should handle a bioinformatics paper', async () => {
    const expected: import('../../src/tools/facet-extract.js').FacetResult = {
      purpose: 'Predict protein-protein interaction sites from sequence alone',
      mechanism: 'Graph neural network operating on residue contact maps with multi-head attention pooling',
      evaluation: 'AUROC and F1 on DIPS and DB5.5 benchmarks; comparison with MASIF and DeepInteract',
      paperTitle: 'gnn_ppi_site_prediction',
    };
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await facetExtract({
      paperMarkdown: '# GNN-based PPI Site Prediction\n\nWe present a graph neural network approach for predicting protein-protein interaction sites directly from amino acid sequences...',
      normalizedTitle: 'gnn_ppi_site_prediction',
      _model: faux.getModel(),
    });

    expect(result.purpose).toBeDefined();
    expect(result.mechanism).toBeDefined();
    expect(result.evaluation).toBeDefined();
    expect(result.paperTitle).toBe('gnn_ppi_site_prediction');
  });
});
