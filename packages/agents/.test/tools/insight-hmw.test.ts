import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { insightHmw } from '../../src/tools/insight-hmw.js';

describe('insightHmw', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate ranked HMW questions from creativity vs rigor tension', async () => {
    faux = registerFauxProvider();
    const expected: import('../../src/tools/insight-hmw.js').HmwResult = {
      hmwQuestions: [
        {
          question: 'How might we design an adversarial validation system that rewards speculative ideas while still flagging empirically unsupported claims?',
          sourceTension: 'Creativity vs Rigor',
          scope: 'medium',
          actionability: 'high',
          noveltyPotential: 'high',
        },
        {
          question: 'How might we quantify the distance between a research idea and the existing literature without penalizing ideas that intentionally diverge from convention?',
          sourceTension: 'Creativity vs Rigor',
          scope: 'narrow',
          actionability: 'high',
          noveltyPotential: 'medium',
        },
        {
          question: 'How might we use multi-agent debate to surface both the strongest case for and against a research idea before human review?',
          sourceTension: 'Automation vs Control',
          scope: 'medium',
          actionability: 'high',
          noveltyPotential: 'high',
        },
      ],
      rankedQuestions: [
        'How might we design an adversarial validation system that rewards speculative ideas while still flagging empirically unsupported claims?',
        'How might we use multi-agent debate to surface both the strongest case for and against a research idea before human review?',
        'How might we quantify the distance between a research idea and the existing literature without penalizing ideas that intentionally diverge from convention?',
      ],
      rankingRationale: 'The top HMW question is most promising because it directly addresses the primary tension while leaving the solution space open. It implies measurable outcomes (speculative ideas that survive critique) without prescribing a specific method, enabling multiple solution approaches.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightHmw({
      tensions: JSON.stringify({ primaryTension: 'Creativity vs Rigor', tensions: [{ tensionType: 'Creativity vs Rigor' }] }),
      _model: faux.getModel(),
    });

    expect(result.hmwQuestions).toBeInstanceOf(Array);
    expect(result.hmwQuestions.length).toBeGreaterThan(0);
    expect(result.hmwQuestions[0].question).toMatch(/^How might we/);
    expect(result.hmwQuestions[0].sourceTension).toBeDefined();
    expect(result.hmwQuestions[0].scope).toMatch(/narrow|medium|broad/);
    expect(result.hmwQuestions[0].actionability).toMatch(/high|medium|low/);
    expect(result.hmwQuestions[0].noveltyPotential).toMatch(/high|medium|low/);
    expect(result.rankedQuestions).toBeInstanceOf(Array);
    expect(result.rankingRationale.length).toBeGreaterThan(20);
  });
});
