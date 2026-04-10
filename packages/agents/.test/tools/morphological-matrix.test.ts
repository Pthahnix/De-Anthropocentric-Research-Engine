import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { morphologicalMatrix } from '../../src/tools/morphological-matrix.js';

describe('morphologicalMatrix', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate morphological matrix with novel combinations', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      matrix: [
        { dimension: 'Model Architecture', options: ['Transformer', 'GNN', 'CNN', 'Hybrid'] },
        { dimension: 'Loss Function', options: ['MSE', 'Contrastive', 'InfoNCE', 'Triplet'] },
        { dimension: 'Data Representation', options: ['SMILES', 'Graph', '3D Point Cloud', 'Fingerprint'] },
      ],
      combinations: [
        {
          title: 'Contrastive GNN on 3D point clouds',
          description: 'Use GNN with contrastive loss on 3D molecular point cloud representations',
          selections: { 'Model Architecture': 'GNN', 'Loss Function': 'Contrastive', 'Data Representation': '3D Point Cloud' },
          mutationType: 'morphological_combination',
          explanation: 'GNN + contrastive + 3D is understudied.',
          noveltyEstimate: 'high' as const,
          feasibilityEstimate: 'medium' as const,
        },
      ],
      unexploredRegions: ['Transformer + Contrastive + 3D Point Cloud'],
      explanation: 'Matrix reveals several unexplored regions.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await morphologicalMatrix({
      dimensions: JSON.stringify([
        { dimension: 'Model Architecture', options: ['Transformer', 'GNN', 'CNN'] },
        { dimension: 'Loss Function', options: ['MSE', 'Contrastive', 'InfoNCE'] },
        { dimension: 'Data Representation', options: ['SMILES', 'Graph', '3D Point Cloud'] },
      ]),
      context: 'Drug discovery domain. Molecular property prediction using different architectural choices.',
      _model: faux.getModel(),
    });

    expect(result.matrix.length).toBeGreaterThanOrEqual(2);
    expect(result.combinations.length).toBeGreaterThanOrEqual(1);
    expect(result.combinations[0].mutationType).toBe('morphological_combination');
    expect(result.unexploredRegions.length).toBeGreaterThan(0);
    expect(result.explanation).toBeTruthy();
  });
});
