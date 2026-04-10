import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { insightAssumption } from '../../src/tools/insight-assumption.js';

describe('insightAssumption', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should audit assumptions in the insight chain and classify critical vs safe', async () => {
    faux = registerFauxProvider();
    const expected: import('../../src/tools/insight-assumption.js').AssumptionResult = {
      assumptions: [
        {
          statement: 'Adversarial critique by a separate model produces reliably better validation than self-review',
          source: 'root cause',
          verdict: 'questionable',
          evidence: 'Debate studies in NLP show mixed results; adversarial models can collude or converge on shared biases',
          risk: 'The adversarial system may produce systematically biased critiques that mirror the generator rather than challenge it',
        },
        {
          statement: 'Researcher time saved by automated pre-validation is spent on higher-quality work rather than generating more low-quality ideas',
          source: 'stakeholder',
          verdict: 'questionable',
          evidence: 'No empirical studies exist on researcher behavior changes when automated filtering is introduced',
          risk: 'Automation could increase the volume of low-quality ideas rather than the quality of each idea',
        },
        {
          statement: 'The creativity-rigor tension is primary and not reducible to other tensions',
          source: 'tension',
          verdict: 'valid',
          evidence: 'Consistently observed in design thinking and innovation management literature across decades',
          risk: 'Minimal — even if secondary tensions matter, addressing the primary tension first is a sound strategy',
        },
        {
          statement: 'A structurally independent evaluator will produce less biased novelty assessments',
          source: 'abstraction',
          verdict: 'valid',
          evidence: 'Blind review panels in clinical trials and double-blind peer review both demonstrate reduced confirmation bias',
          risk: 'Low — the principle is well-established even if the implementation details require validation',
        },
      ],
      criticalAssumptions: [
        'Adversarial critique by a separate model produces reliably better validation than self-review',
        'Researcher time saved by automated pre-validation is spent on higher-quality work rather than generating more low-quality ideas',
      ],
      safeAssumptions: [
        'The creativity-rigor tension is primary and not reducible to other tensions',
        'A structurally independent evaluator will produce less biased novelty assessments',
      ],
      recommendation: 'Proceed with the insight but design an early empirical test to validate the two critical assumptions before full implementation. Specifically, run a small-scale experiment comparing self-review vs adversarial review quality on a held-out set of known-quality ideas. The safe assumptions are robust enough to build on immediately.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightAssumption({
      insightSoFar: 'Step 1: Root cause = no operationalizable novelty definition. Step 2: ML Researchers most underserved. Step 3: Creativity vs Rigor is primary tension. Step 4: HMW design adversarial system rewarding speculation. Step 5: Reframed as blind-review-panel analogy.',
      _model: faux.getModel(),
    });

    expect(result.assumptions).toBeInstanceOf(Array);
    expect(result.assumptions.length).toBeGreaterThan(0);
    result.assumptions.forEach((a) => {
      expect(a.statement).toBeDefined();
      expect(a.source).toBeDefined();
      expect(['valid', 'questionable', 'false']).toContain(a.verdict);
      expect(a.evidence).toBeDefined();
      expect(a.risk).toBeDefined();
    });
    expect(result.criticalAssumptions).toBeInstanceOf(Array);
    expect(result.safeAssumptions).toBeInstanceOf(Array);
    expect(result.recommendation.length).toBeGreaterThan(20);
  });
});
