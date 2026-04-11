import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { scamperAdapt } from '../../src/tools/scamper-adapt.js';

describe('scamperAdapt', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate cross-domain adaptation variants', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'Epidemiological Cascade Model for Citation Spread',
          description: 'Adapt SIR epidemiological model to track how ideas spread through citation networks, treating papers as infected nodes',
          mutationType: 'adapt',
          explanation: 'Epidemic models formalize contagion dynamics; citation propagation has the same structural properties — susceptible researchers adopt ideas from infected papers',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Ecological Niche Competition for Research Idea Diversity',
          description: 'Adapt competitive exclusion principle from ecology to ensure generated ideas occupy distinct cognitive niches rather than competing for the same intellectual space',
          mutationType: 'adapt',
          explanation: 'Ecology has mature theory for maintaining diversity under competitive pressure; the same framework can prevent idea monocultures in generation systems',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Examined epidemiology and ecology as source domains for cross-domain adaptation. Both have mature mathematical frameworks for spread and diversity that map onto research idea dynamics.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await scamperAdapt({
      idea: '{"title":"Research idea novelty scoring","description":"Automated system that scores the novelty of proposed research ideas against the existing literature"}',
      context: 'Research automation. Domain: ML and NLP research idea generation and evaluation.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('adapt');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
