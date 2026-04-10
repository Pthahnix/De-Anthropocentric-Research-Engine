import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { debateJudge } from '../../src/tools/debate-judge.js';

describe('debateJudge', () => {
  let faux: ReturnType<typeof registerFauxProvider>;
  afterEach(() => { if (faux) faux.unregister(); });

  it('should ACCEPT when defender successfully refutes fatal critique', async () => {
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify({
      verdict: 'ACCEPT',
      confidence: 0.78,
      reasoning: 'Defender correctly identified that Zhang et al. only covers rigid backbone. The gap for flexible side chains remains valid.',
      keyFactors: ['Critic mischaracterized Zhang et al. scope', 'Defender provided table-level evidence'],
      debateSummary: 'Critic claimed gap was filled by Zhang 2025; Defender showed Zhang only covers rigid case.',
    }))])]);
    const result = await debateJudge({
      artifact: 'No method handles flexible side-chain docking in under 1 second.',
      artifactType: 'gap',
      criticOutput: '{"critiques":[{"point":"Zhang 2025 fills this gap","severity":"fatal"}]}',
      defenderOutput: '{"defenses":[{"againstPoint":"Zhang 2025","response":"Only rigid backbone"}]}',
      _model: faux.getModel(),
    });
    expect(result.verdict).toBe('ACCEPT');
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.reasoning.length).toBeGreaterThan(20);
  });

  it('should return CONTINUE when debate is unresolved', async () => {
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify({
      verdict: 'CONTINUE',
      confidence: 0.4,
      reasoning: 'Both sides raised valid points. Need Defender to address the scalability concern specifically.',
      keyFactors: ['Scalability objection not yet addressed'],
      debateSummary: 'Critic raised scalability; Defender focused on accuracy only.',
    }))])]);
    const result = await debateJudge({
      artifact: 'Use GNN for large-scale molecular screening.',
      artifactType: 'idea',
      criticOutput: '{"critiques":[{"point":"GNNs dont scale to 1M molecules","severity":"major"}]}',
      defenderOutput: '{"defenses":[{"againstPoint":"accuracy","response":"GNNs are more accurate"}]}',
      _model: faux.getModel(),
    });
    expect(result.verdict).toBe('CONTINUE');
  });
});
