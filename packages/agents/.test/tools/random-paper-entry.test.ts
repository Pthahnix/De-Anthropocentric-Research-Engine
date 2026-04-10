import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { randomPaperEntry } from '../../src/tools/random-paper-entry.js';

describe('randomPaperEntry', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should find unexpected connections from random paper to target problem', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      randomFacetSummary: 'Image inpainting using diffusion models to fill masked regions: a forward noising process corrupts the unmasked context, and a reverse denoising process conditioned on context fills in the missing pixels in a perceptually realistic way.',
      connections: [
        {
          aspect: 'Filling missing data with learned priors conditioned on context',
          connection: 'Could fill missing residues or loop regions in protein structures using structural context from known residues, learned from PDB training data',
          surpriseFactor: 'high' as const,
        },
        {
          aspect: 'Masking strategy as a training objective',
          connection: 'Masked residue prediction as a self-supervised pretraining task for protein language models — BERT-style masking already used, but diffusion-style continuous masking schedule is unexplored',
          surpriseFactor: 'medium' as const,
        },
        {
          aspect: 'Conditioning on surrounding context for local coherence',
          connection: 'Conditioning structure prediction on known binding site context to generate novel binders consistent with receptor pocket geometry',
          surpriseFactor: 'medium' as const,
        },
      ],
      variants: [
        {
          title: 'Protein structure inpainting via 3D diffusion',
          description: 'Adapt image inpainting diffusion to 3D protein coordinates: mask selected residues, condition the reverse diffusion on known structure context, fill in plausible conformations',
          mutationType: 'random_entry',
          explanation: 'Sparked by connection 1: masked image → masked residues, pixel context → atomic coordinate context, diffusion fill → structure completion',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Diffusion-schedule masked language modeling for protein pretraining',
          description: 'Replace binary BERT masking with a continuous diffusion noise schedule over amino acid embeddings, enabling more nuanced pretraining signal',
          mutationType: 'random_entry',
          explanation: 'Sparked by connection 2: continuous masking schedule transfers the diffusion inpainting training objective to the sequence domain',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Random CV paper (image inpainting) sparked two high-quality connections to protein structure prediction. Most surprising: the structural isomorphism between 2D pixel inpainting and 3D residue inpainting. Both involve filling a missing region using learned priors conditioned on surrounding context.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await randomPaperEntry({
      randomPaperFacet: JSON.stringify({ purpose: 'image inpainting', mechanism: 'diffusion model with masked region conditioning', evaluation: 'FID and LPIPS on CelebA-HQ' }),
      targetProblem: 'Protein structure prediction for incomplete or partially disordered proteins with missing loop regions.',
      context: 'Research on AI for structural biology. Domain: protein structure prediction and drug design.',
      _model: faux.getModel(),
    });

    expect(result.randomFacetSummary).toBeTruthy();
    expect(result.connections.length).toBeGreaterThanOrEqual(1);
    expect(result.connections[0].surpriseFactor).toMatch(/low|medium|high/);
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('random_entry');
    expect(result.variants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.explanation).toBeTruthy();
  });
});
