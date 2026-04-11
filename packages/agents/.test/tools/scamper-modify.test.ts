import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { scamperModify } from '../../src/tools/scamper-modify.js';

describe('scamperModify', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate magnify and minify variants', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'Massively Parallel Idea Tournament at Scale',
          description: 'Scale idea evaluation from 5-10 ideas to 1000+ using automated tournament brackets with LLM judges',
          mutationType: 'modify',
          explanation: 'Magnifying the evaluation scale enables quality-diversity exploration that is impossible with small pools; tournament structure keeps compute tractable',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Single-Sentence Idea Nucleus Extraction',
          description: 'Minify idea representation to a single atomic claim — the irreducible core thesis — before evaluation',
          mutationType: 'modify',
          explanation: 'Forcing minimal representation eliminates confounding detail and makes novelty comparison more precise; ideas compete on core contribution only',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Examined evaluation pool size (magnify) and idea representation granularity (minify). Both scaling directions open qualitatively different research questions.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await scamperModify({
      idea: '{"title":"Iterative idea refinement","description":"System that refines a pool of 5-10 candidate research ideas through multiple rounds of LLM critique and revision"}',
      context: 'Research idea generation. Current systems work with small idea pools due to cost constraints.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('modify');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
