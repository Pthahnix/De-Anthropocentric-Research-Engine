import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { scamperPutOtherUse } from '../../src/tools/scamper-put-other-use.js';

describe('scamperPutOtherUse', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate repurposing variants for alternative applications', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      variants: [
        {
          title: 'SCAMPER Mutation Engine for Code Refactoring',
          description: 'Repurpose the SCAMPER creative mutation framework from research ideas to code architecture — substitute patterns, combine modules, eliminate dead code',
          mutationType: 'put-other-use',
          explanation: 'Code is compositional just like research ideas; the same mutation operations that generate idea variants can generate refactoring candidates in software engineering',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Idea Mutation for Business Strategy Generation',
          description: 'Apply the research idea mutation pipeline to business strategy documents to generate strategic alternatives and stress-test current plans',
          mutationType: 'put-other-use',
          explanation: 'Business strategy has the same decomposable structure (method=approach, evaluation=KPIs, assumptions=market hypotheses) that makes SCAMPER applicable',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Abstracted the core capability as "structured decomposition and targeted mutation of compositional artifacts." This maps onto code architecture and business strategy as alternative application domains.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await scamperPutOtherUse({
      idea: '{"title":"SCAMPER research idea mutation","description":"Apply SCAMPER creative framework to systematically mutate research ideas into novel variants"}',
      context: 'Research automation. The mutation engine is currently applied only to scientific research ideas.',
      _model: faux.getModel(),
    });

    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('put-other-use');
    expect(result.explanation).toBeTruthy();
    expect(['low', 'medium', 'high']).toContain(result.variants[0].noveltyEstimate);
  });
});
