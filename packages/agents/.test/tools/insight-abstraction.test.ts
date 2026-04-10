import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { insightAbstraction } from '../../src/tools/insight-abstraction.js';

describe('insightAbstraction', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should build an abstraction ladder from HMW questions to reframed problem', async () => {
    faux = registerFauxProvider();
    const expected: import('../../src/tools/insight-abstraction.js').AbstractionResult = {
      ladder: [
        { level: 1, type: 'concrete', statement: 'AI systems cannot reliably validate the novelty of their own research idea outputs' },
        { level: 2, type: 'concrete', statement: 'Multi-agent adversarial critique lacks a principled scoring rubric for research originality' },
        { level: 3, type: 'abstract', statement: 'Self-referential evaluation systems suffer from blind spots in the domain they were trained on' },
        { level: 4, type: 'abstract', statement: 'Quality assessment requires an evaluator with different priors from the generator' },
        { level: 5, type: 'meta', statement: 'Diversity of perspective is necessary for detecting novelty in any creative domain' },
        { level: 6, type: 'meta', statement: 'Evaluation credibility comes from the evaluator being structurally independent of the generator' },
      ],
      insightFromLadder: 'At the meta level, the problem is not about AI specifically but about the fundamental impossibility of self-certification in creative domains. Any system that generates ideas cannot be its own gold-standard evaluator because it lacks the necessary structural independence.',
      reframedProblem: 'How might we design a research idea validation protocol where the evaluator is structurally guaranteed to have different priors from the generator, similar to how blind review panels work in clinical trials?',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightAbstraction({
      hmwQuestions: JSON.stringify({ rankedQuestions: ['How might we design an adversarial validation system...'] }),
      _model: faux.getModel(),
    });

    expect(result.ladder).toBeInstanceOf(Array);
    expect(result.ladder.length).toBeGreaterThan(0);
    result.ladder.forEach((rung) => {
      expect(rung.level).toBeTypeOf('number');
      expect(['concrete', 'abstract', 'meta']).toContain(rung.type);
      expect(rung.statement.length).toBeGreaterThan(10);
    });
    expect(result.insightFromLadder.length).toBeGreaterThan(20);
    expect(result.reframedProblem.length).toBeGreaterThan(20);
  });
});
