import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { debateCritic } from '../../src/tools/debate-critic.js';

describe('debateCritic', () => {
  let faux: ReturnType<typeof registerFauxProvider>;
  afterEach(() => { if (faux) faux.unregister(); });

  it('should produce structured critiques with severity', async () => {
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify({
      critiques: [
        { point: 'The claimed gap ignores recent work by Zhang et al. (2025)', severity: 'fatal', evidence: 'Their method achieves sub-second docking on FlexDock benchmark' },
        { point: 'Sample size of 50 papers may miss relevant preprints', severity: 'minor', evidence: 'arXiv submissions in this area doubled in 2025' },
      ],
      overallAssessment: 'The gap claim is undermined by very recent work that directly addresses it.',
      recommendedVerdict: 'REJECT',
    }))])]);
    const result = await debateCritic({
      artifact: 'No method handles flexible side-chain docking in under 1 second.',
      artifactType: 'gap',
      context: 'Survey of 50 molecular docking papers.',
      _model: faux.getModel(),
    });
    expect(result.critiques.length).toBeGreaterThanOrEqual(1);
    expect(result.critiques[0].severity).toBeDefined();
    expect(result.overallAssessment).toBeDefined();
  });
});
