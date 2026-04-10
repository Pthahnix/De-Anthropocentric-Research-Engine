import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { insightStakeholder } from '../../src/tools/insight-stakeholder.js';

describe('insightStakeholder', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should map JTBD stakeholders for adversarial idea validation gap', async () => {
    faux = registerFauxProvider();
    const expected: import('../../src/tools/insight-stakeholder.js').StakeholderResult = {
      stakeholders: [
        {
          name: 'ML Researcher',
          role: 'Primary idea generator and researcher',
          jtbd: 'Generate high-quality novel research ideas that will survive peer review',
          painPoints: [
            'Cannot objectively assess own idea novelty without external feedback',
            'Reviewer feedback arrives too late in the publication cycle to iterate',
          ],
          gainOpportunities: [
            'Pre-submission adversarial validation to catch fatal flaws early',
            'Faster iteration cycles driven by automated critique',
          ],
        },
        {
          name: 'Peer Reviewer',
          role: 'Quality gatekeeper in the academic publication system',
          jtbd: 'Efficiently identify truly novel contributions among high submission volumes',
          painPoints: [
            'Review burden has increased 3x in the past decade without better tooling',
            'Low-quality submissions waste significant reviewer time',
          ],
          gainOpportunities: [
            'Pre-filtered submissions where obvious weaknesses are already addressed',
            'Standardized critique reports to focus reviewer effort on high-level judgments',
          ],
        },
        {
          name: 'Lab Director',
          role: 'Research group leader responsible for output and reputation',
          jtbd: 'Maximize research throughput while maintaining quality standards',
          painPoints: [
            'Cannot assess quality of all student ideas without reading every paper',
            'Reputation risk from low-quality submissions that pass internal review',
          ],
          gainOpportunities: [
            'Automated first-pass quality filter for student research ideas',
            'Quantified novelty scores for portfolio management decisions',
          ],
        },
      ],
      underservedStakeholder: 'ML Researcher — they bear the highest cost of late-stage idea rejection but have the fewest tools for early-stage quality assessment',
      conflictingNeeds: 'Researchers need creative freedom to generate speculative ideas, while reviewers need rigorous evidence-based claims — adversarial validation must preserve creativity while increasing rigor',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightStakeholder({
      gap: 'No existing method provides adversarial validation of AI-generated research ideas before human review',
      rootCauseOutput: JSON.stringify({ rootCause: 'No operationalizable definition of research novelty for adversarial evaluation' }),
      _model: faux.getModel(),
    });

    expect(result.stakeholders).toHaveLength(3);
    expect(result.stakeholders[0].name).toBeDefined();
    expect(result.stakeholders[0].jtbd).toBeDefined();
    expect(result.stakeholders[0].painPoints).toBeInstanceOf(Array);
    expect(result.stakeholders[0].gainOpportunities).toBeInstanceOf(Array);
    expect(result.underservedStakeholder).toContain('Researcher');
    expect(result.conflictingNeeds.length).toBeGreaterThan(20);
  });
});
