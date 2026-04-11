import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { practitionerHat } from '../../src/tools/practitioner-hat.js';

describe('practitionerHat', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should evaluate practical deployment of a protein structure inpainting idea', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      assessment: {
        dataRequirements: {
          description: 'Requires paired (partial structure, complete structure) training data. PDB has ~220k structures but only ~15k have resolution < 2Å with multiple conformations. For inpainting disordered regions, ground truth "complete" structures are rare by definition — disordered regions lack electron density precisely because they are disordered.',
          availability: 'limited' as const,
        },
        computeRequirements: {
          training: 'Full model training: ~8x A100 80GB for 2 weeks, ~$4k cloud cost. The attention-over-all-residues mechanism scales O(n²) with sequence length, making proteins >600 residues impractical without chunking.',
          inference: 'Per-protein inference: 30-90s on A100 depending on length. Too slow for high-throughput screening of 10k+ proteins without batching optimization.',
          feasibility: 'expensive' as const,
        },
        integrationComplexity: 'major-refactor' as const,
        topBlocker: 'The O(n²) attention mechanism is incompatible with long proteins (>600aa) which constitute ~40% of the proteome. Without a linear-complexity approximation or chunking strategy, the method cannot be deployed for many biologically important targets including most membrane proteins.',
      },
      practicalVariants: [
        {
          title: 'Sparse Attention Protein Inpainting for Production Deployment',
          description: 'Replace full self-attention with BigBird-style sparse attention (sliding window + global tokens at conserved residues) to achieve O(n) complexity, enabling inference on proteins up to 2000 residues within a 30s latency budget on a single A100.',
          mutationType: 'practitioner_improvement',
          explanation: 'Directly addresses the #1 engineering blocker of O(n²) scaling by swapping attention patterns while preserving the inpainting capability through global tokens at structurally important positions.',
          noveltyEstimate: 'medium' as const,
        },
        {
          title: 'Distilled Inpainting Model for CPU/Edge Deployment',
          description: 'Train a 10M-parameter distilled student model from the full architecture, targeting <1s CPU inference. Suitable for embedding in local lab software without GPU requirements.',
          mutationType: 'practitioner_improvement',
          explanation: 'Many biotech labs lack GPU infrastructure. A distilled model expands the addressable user base 10x and enables integration into existing bioinformatics pipelines without infrastructure changes.',
          noveltyEstimate: 'low' as const,
        },
      ],
      buildability: '1year' as const,
      explanation: 'The core idea is technically sound but not deployment-ready. The two critical issues are: (1) training data scarcity for truly disordered regions — this requires creative data augmentation or synthetic data generation; and (2) O(n²) attention scaling — this must be solved before the method works on most biologically interesting proteins. With 6-12 months of engineering, both are solvable, but the paper should acknowledge these limitations explicitly.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await practitionerHat({
      idea: 'Protein structure inpainting using masked autoencoder trained on PDB structures. The model learns to reconstruct missing backbone coordinates and side-chain conformations from partial structural context, using full self-attention over all residue pairs to capture long-range dependencies.',
      context: 'Structural bioinformatics tool targeting computational biologists and drug discovery teams. Intended use: fill in missing loop regions in crystal structures, model disordered regions for function prediction, and generate conformational ensembles of flexible segments.',
      _model: faux.getModel(),
    });

    expect(result.assessment).toBeTruthy();
    expect(result.assessment.dataRequirements).toBeTruthy();
    expect(result.assessment.dataRequirements.availability).toMatch(/available|limited|unavailable/);
    expect(result.assessment.computeRequirements).toBeTruthy();
    expect(result.assessment.computeRequirements.feasibility).toMatch(/trivial|moderate|expensive|prohibitive/);
    expect(result.assessment.integrationComplexity).toMatch(/drop-in|moderate|major-refactor|greenfield/);
    expect(result.assessment.topBlocker).toBeTruthy();
    expect(result.practicalVariants.length).toBeGreaterThanOrEqual(1);
    expect(result.practicalVariants[0].mutationType).toBe('practitioner_improvement');
    expect(result.practicalVariants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.buildability).toMatch(/ready|6months|1year|research_only/);
    expect(result.explanation).toBeTruthy();
  });
});
