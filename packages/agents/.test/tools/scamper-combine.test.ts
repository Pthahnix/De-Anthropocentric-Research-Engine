import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { scamperCombine } from '../../src/tools/scamper-combine.js';

describe('scamperCombine', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate combination variants from two ideas', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'Retrieval-Augmented Idea Generation with Adversarial Filtering',
          description: 'Combine RAG for literature retrieval with adversarial critic to filter generated ideas before human review',
          mutationType: 'combine',
          explanation: 'RAG grounds idea generation in real literature while the adversarial critic prevents superficially plausible but weak ideas from reaching human reviewers',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Adversarial Literature-Grounded Novelty Scoring',
          description: 'Use RAG to retrieve counter-examples that the adversarial critic can wield when attacking proposed ideas',
          mutationType: 'combine',
          explanation: 'The critic becomes more effective when armed with actual counterexamples from the literature rather than generated critiques',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Combined RAG-based retrieval with adversarial evaluation. Integration strategy: RAG supplies evidence, adversary uses it to attack. Creates a grounded adversarial pipeline.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await scamperCombine({
      idea: '{"title":"RAG for idea generation","description":"Retrieval-augmented generation that grounds idea proposals in existing literature"}',
      secondIdea: '{"title":"Adversarial idea filtering","description":"Critic agent attacks proposed ideas to surface weaknesses before human review"}',
      context: 'Research automation. Goal: improve novelty and validity of AI-generated research ideas.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('combine');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
