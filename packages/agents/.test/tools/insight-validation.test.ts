import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { insightValidation } from '../../src/tools/insight-validation.js';

describe('insightValidation', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should return PASS when all 6 gates pass', async () => {
    faux = registerFauxProvider();
    const expected: import('../../src/tools/insight-validation.js').ValidationResult = {
      gates: [
        { gate: 1, name: 'Specificity', passed: true, reasoning: 'The gap is precisely scoped to adversarial validation of AI-generated ideas before human review. The root cause identifies the absence of an operationalizable novelty definition as the specific failure point.' },
        { gate: 2, name: 'Evidence', passed: true, reasoning: 'The root cause is grounded in observed behavior of existing systems (Sakai AI Scientist, OpenAI Deep Research) with specific evidence of self-evaluation failure modes.' },
        { gate: 3, name: 'Stakeholder Clarity', passed: true, reasoning: 'Three distinct stakeholders with concrete pain points are identified. ML Researchers are correctly identified as most underserved with specific evidence.' },
        { gate: 4, name: 'Tension Productivity', passed: true, reasoning: 'The Creativity vs Rigor tension is a genuine trade-off with real value on both sides. Resolving it would enable a new class of idea validation tools.' },
        { gate: 5, name: 'Actionability', passed: true, reasoning: 'The reframed HMW question (blind-review-panel analogy) can be prototyped with existing multi-agent LLM frameworks within 3-6 months.' },
        { gate: 6, name: 'Assumption Safety', passed: true, reasoning: 'Critical assumptions are explicitly flagged with test designs. Safe assumptions are grounded in established literature.' },
      ],
      overallVerdict: 'PASS',
      failedGates: [],
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightValidation({
      fullInsight: 'Root cause: no novelty definition. Stakeholders: ML Researchers. Tension: Creativity vs Rigor. HMW: adversarial validation. Abstraction: blind-review-panel analogy. Assumptions: two critical identified with test designs.',
      _model: faux.getModel(),
    });

    expect(result.gates).toHaveLength(6);
    expect(result.overallVerdict).toBe('PASS');
    expect(result.failedGates).toHaveLength(0);
    result.gates.forEach((g) => {
      expect(g.passed).toBe(true);
      expect(g.reasoning.length).toBeGreaterThan(10);
    });
  });

  it('should return REVISE with guidance when some gates fail', async () => {
    faux = registerFauxProvider();
    const expected: import('../../src/tools/insight-validation.js').ValidationResult = {
      gates: [
        { gate: 1, name: 'Specificity', passed: true, reasoning: 'Gap is specific enough — scoped to adversarial validation pre-human review.' },
        { gate: 2, name: 'Evidence', passed: false, reasoning: 'The root cause relies on assertions about existing systems without citing specific papers or benchmark results. No empirical evidence is provided that self-evaluation actually fails in practice.' },
        { gate: 3, name: 'Stakeholder Clarity', passed: true, reasoning: 'Three stakeholders with concrete pain points and gain opportunities are clearly defined.' },
        { gate: 4, name: 'Tension Productivity', passed: true, reasoning: 'Creativity vs Rigor is a well-documented productive tension in innovation management.' },
        { gate: 5, name: 'Actionability', passed: false, reasoning: 'The reframed problem (structurally independent evaluator) does not specify how structural independence is technically enforced. The implementation path is unclear for the 6-month window.' },
        { gate: 6, name: 'Assumption Safety', passed: true, reasoning: 'Critical assumptions are identified with proposed tests. Reasonable given the early stage of the insight.' },
      ],
      overallVerdict: 'REVISE',
      failedGates: [2, 5],
      revisionGuidance: 'Gate 2 (Evidence): Add at least 2-3 citations from the literature showing self-evaluation failure rates in idea generation systems, or conduct a small empirical comparison. Gate 5 (Actionability): Specify a concrete technical mechanism for structural independence — for example, train separate Critic and Defender models with different base models or fine-tuning datasets to prevent prior collapse.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightValidation({
      fullInsight: 'Root cause: no novelty definition (no citations). Stakeholders: ML Researchers. Tension: Creativity vs Rigor. HMW: adversarial validation. Abstraction: blind-review analogy (implementation unclear). Assumptions: two critical, not yet tested.',
      _model: faux.getModel(),
    });

    expect(result.overallVerdict).toBe('REVISE');
    expect(result.failedGates).toContain(2);
    expect(result.failedGates).toContain(5);
    expect(result.failedGates.length).toBe(2);
    expect(result.revisionGuidance).toBeDefined();
    expect(result.revisionGuidance!.length).toBeGreaterThan(20);
    const failedGateObjects = result.gates.filter((g) => !g.passed);
    expect(failedGateObjects.length).toBe(2);
  });
});
