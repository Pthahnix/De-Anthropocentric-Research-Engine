import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { worstMethodAnalysis } from '../../src/tools/worst-method-analysis.js';

describe('worstMethodAnalysis', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should design worst method and extract insights from inverting it', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      worstMethod: {
        description: 'Predict protein function by counting amino acid frequencies alone, ignoring sequence order and 3D structure entirely, evaluated on a trivially small hand-picked dataset using only accuracy as the metric with a random baseline',
        worstProperties: [
          {
            property: 'Ignores sequence order — treats protein as bag of amino acids',
            implicitAssumption: 'Sequence order encodes critical information about protein folding and function',
            opposite: 'Methods must capture sequential dependencies (attention mechanisms, convolutions, or recurrent architectures)',
          },
          {
            property: 'Ignores 3D structure — no spatial information',
            implicitAssumption: 'Spatial relationships between residues determine binding specificity and catalytic activity',
            opposite: 'Structure-aware models (geometric GNNs, equivariant networks) should outperform sequence-only models',
          },
          {
            property: 'Trivially small, hand-picked evaluation dataset',
            implicitAssumption: 'Generalization requires diverse, large-scale training and evaluation data',
            opposite: 'Pre-training on massive protein sequence databases (UniRef50/90) enables transfer learning to small downstream tasks',
          },
        ],
      },
      variants: [
        {
          title: 'Structure-aware protein function prediction via geometric pre-training',
          description: 'Pre-train an equivariant GNN on the AlphaFold Database (200M+ structures), then fine-tune for specific function prediction tasks using both sequence and predicted structure',
          mutationType: 'worst_method_inversion',
          explanation: 'Inverts all 3 worst properties simultaneously: captures sequence order via attention, incorporates 3D structure via geometric message passing, and leverages massive pre-training data',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'The worst method analysis revealed that the three pillars of good protein function prediction are: (1) sequential context, (2) structural awareness, and (3) scale of training data. Current SOTA methods address 1 and 3 but often neglect 2.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await worstMethodAnalysis({
      problem: 'Predict protein function from sequence and/or structure',
      context: 'Current methods are mostly sequence-based (ESM-2, ProtTrans). Structure-based methods are emerging but lack large-scale pre-training.',
      _model: faux.getModel(),
    });

    expect(result.worstMethod.description).toBeTruthy();
    expect(result.worstMethod.worstProperties.length).toBeGreaterThanOrEqual(2);
    expect(result.worstMethod.worstProperties[0].implicitAssumption).toBeTruthy();
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('worst_method_inversion');
    expect(result.variants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.explanation).toBeTruthy();
  });
});
