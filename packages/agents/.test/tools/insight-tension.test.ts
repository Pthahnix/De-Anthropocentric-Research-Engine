import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { insightTension } from '../../src/tools/insight-tension.js';

describe('insightTension', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should mine creativity vs rigor tension for idea validation gap', async () => {
    faux = registerFauxProvider();
    const expected: import('../../src/tools/insight-tension.js').TensionResult = {
      tensions: [
        {
          tensionType: 'Creativity vs Rigor',
          description: 'Adversarial validation may suppress speculative but important ideas by penalizing ideas that lack immediate empirical grounding',
          sideA: 'Creative ideation that generates speculative, boundary-pushing hypotheses',
          sideB: 'Rigorous validation that requires evidence for every claim',
          currentBalance: 'Current systems either generate ideas freely (no rigor) or apply strict checklists (no creativity)',
          innovationLever: 'Separate the creativity phase from the rigor phase — validate against a spectrum rather than a binary pass/fail',
        },
        {
          tensionType: 'Automation vs Control',
          description: 'Fully automated adversarial critique may miss domain-specific nuances that require expert human judgment',
          sideA: 'High automation reducing researcher burden',
          sideB: 'Human control ensuring domain-sensitive evaluation',
          currentBalance: 'Current tools require full human evaluation with no automated pre-screening',
          innovationLever: 'Tiered validation: automated critique for common failure modes, human review only for edge cases',
        },
      ],
      primaryTension: 'Creativity vs Rigor',
      tensionInsight: 'The creativity-rigor tension is primary because it determines the fundamental design of any adversarial validation system. Resolving it requires a new framework that can score ideas on a spectrum rather than treating novelty as binary.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightTension({
      gap: 'No existing method provides adversarial validation of AI-generated research ideas',
      stakeholderOutput: JSON.stringify({ underservedStakeholder: 'ML Researcher', conflictingNeeds: 'creativity vs rigor' }),
      _model: faux.getModel(),
    });

    expect(result.tensions).toBeInstanceOf(Array);
    expect(result.tensions.length).toBeGreaterThan(0);
    expect(result.tensions[0].tensionType).toBeDefined();
    expect(result.tensions[0].sideA).toBeDefined();
    expect(result.tensions[0].sideB).toBeDefined();
    expect(result.tensions[0].innovationLever).toBeDefined();
    expect(result.primaryTension).toBeDefined();
    expect(result.tensionInsight.length).toBeGreaterThan(20);
  });
});
