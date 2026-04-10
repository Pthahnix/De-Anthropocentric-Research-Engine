import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { debateDefender } from '../../src/tools/debate-defender.js';

describe('debateDefender', () => {
  let faux: ReturnType<typeof registerFauxProvider>;
  afterEach(() => { if (faux) faux.unregister(); });

  it('should defend against critic points with evidence', async () => {
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify({
      defenses: [
        { againstPoint: 'Zhang et al. 2025 addresses this gap', response: 'Zhang et al. only handles rigid backbone docking, not flexible side chains', evidenceUsed: 'Table 2 of Zhang et al. shows fixed backbone assumption' },
      ],
      concessions: ['Sample size could be expanded to include 2025 preprints'],
      overallDefense: 'The gap remains valid for the specific case of flexible side-chain docking.',
      recommendedVerdict: 'ACCEPT',
    }))])]);
    const result = await debateDefender({
      artifact: 'No method handles flexible side-chain docking in under 1 second.',
      artifactType: 'gap',
      context: 'Survey of 50 molecular docking papers.',
      criticOutput: JSON.stringify({ critiques: [{ point: 'Zhang et al. 2025 addresses this', severity: 'fatal' }] }),
      _model: faux.getModel(),
    });
    expect(result.defenses.length).toBeGreaterThanOrEqual(1);
    expect(result.defenses[0].evidenceUsed).toBeDefined();
    expect(result.concessions).toBeDefined();
  });
});
