import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { insightRootCause } from '../../src/tools/insight-root-cause.js';

describe('insightRootCause', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should drill down to root cause of adversarial validation gap', async () => {
    faux = registerFauxProvider();
    const expected: import('../../src/tools/insight-root-cause.js').RootCauseResult = {
      surfaceGap: 'No existing method provides adversarial validation of AI-generated research ideas before human review',
      whyChain: [
        { level: 1, why: 'Why does this gap exist?', because: 'Idea generators and evaluators are typically the same model or system, creating a conflict of interest' },
        { level: 2, why: 'Why are generators and evaluators the same?', because: 'Adversarial multi-agent frameworks for idea evaluation are not yet standard in research automation toolkits' },
        { level: 3, why: 'Why are adversarial frameworks not standard?', because: 'The field lacks agreed-upon criteria for what makes a research idea genuinely novel vs superficially novel' },
      ],
      rootCause: 'The field has no operationalizable definition of research novelty that can be evaluated adversarially without ground-truth labels',
      hiddenAssumptions: [
        'A single model can objectively assess the novelty of ideas it generates',
        'Human review is the gold standard for idea quality',
      ],
      unexploredAngles: [
        'Using citation graph embeddings to quantify semantic distance from existing work',
        'Multi-agent Elo-ranking tournaments to establish relative novelty scores without absolute ground truth',
      ],
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightRootCause({
      gap: 'No existing method provides adversarial validation of AI-generated research ideas before human review',
      evidence: 'Sakai AI Scientist generates and self-rates ideas. OpenAI Deep Research synthesizes but does not validate ideas adversarially.',
      knowledge: 'Research automation systems like AutoResearcher rely on single-model self-evaluation.',
      _model: faux.getModel(),
    });

    expect(result.surfaceGap).toContain('adversarial');
    expect(result.whyChain).toHaveLength(3);
    expect(result.whyChain[0].level).toBe(1);
    expect(result.rootCause.length).toBeGreaterThan(20);
    expect(result.hiddenAssumptions).toBeInstanceOf(Array);
    expect(result.unexploredAngles).toBeInstanceOf(Array);
    expect(result.hiddenAssumptions.length).toBeGreaterThan(0);
    expect(result.unexploredAngles.length).toBeGreaterThan(0);
  });
});
