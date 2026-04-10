/**
 * E2E test: critic → defender → judge single-round debate flow.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { debateCritic } from '../../../packages/agents/src/tools/debate-critic.js';
import { debateDefender } from '../../../packages/agents/src/tools/debate-defender.js';
import { debateJudge } from '../../../packages/agents/src/tools/debate-judge.js';

import type { CriticResult } from '../../../packages/agents/src/tools/debate-critic.js';
import type { DefenderResult } from '../../../packages/agents/src/tools/debate-defender.js';
import type { JudgeResult } from '../../../packages/agents/src/tools/debate-judge.js';

const ARTIFACT =
  'No existing method provides adversarial validation of AI-generated research ideas before human review, because the field lacks an operationalizable definition of research novelty.';
const ARTIFACT_TYPE = 'gap';
const CONTEXT =
  'Survey of 60 research automation papers (2020-2025). Systems reviewed: Sakai AI Scientist, OpenAI Deep Research, AutoResearcher, AlphaEvolve. None implement structurally independent idea evaluation.';

describe('Debate pipeline — critic → defender → judge single-round E2E', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('Critic step: produces structured critiques with severity levels', async () => {
    faux = registerFauxProvider();
    const expected: CriticResult = {
      critiques: [
        {
          point: 'Zhang et al. (2025) introduces a multi-agent novelty scoring system that directly addresses this gap',
          severity: 'fatal',
          evidence:
            'Zhang 2025 "Adversarial Novelty Assessment for Research Automation" achieves 0.82 correlation with expert judgment on IdeaBench dataset',
        },
        {
          point: 'The claim that "the field lacks an operationalizable definition" is falsified by bibliometric approaches (Uzzi et al., 2013)',
          severity: 'major',
          evidence:
            'Uzzi et al. use CD index (Combinatorial Disruption) as an operationalizable novelty proxy with empirical validation',
        },
        {
          point: 'The scope is limited to AI-generated ideas and may not generalize to human-AI collaborative research pipelines',
          severity: 'minor',
          evidence:
            'Co-pilot style research tools like Elicit combine human and AI inputs; the gap claim does not address this hybrid case',
        },
      ],
      overallAssessment:
        'The gap claim has a potentially fatal flaw if Zhang 2025 is correctly characterized. The major critique about existing operationalizable proxies (CD index) also weakens the root cause claim significantly. The gap needs tighter scoping to survive adversarial review.',
      recommendedVerdict: 'REVISE',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await debateCritic({
      artifact: ARTIFACT,
      artifactType: ARTIFACT_TYPE,
      context: CONTEXT,
      _model: faux.getModel(),
    });

    expect(result.critiques.length).toBeGreaterThan(0);
    result.critiques.forEach((c) => {
      expect(c.point).toBeTruthy();
      expect(['fatal', 'major', 'minor']).toContain(c.severity);
      expect(c.evidence).toBeTruthy();
    });
    expect(result.overallAssessment.length).toBeGreaterThan(20);
    expect(['REJECT', 'REVISE', 'WEAK_ACCEPT']).toContain(result.recommendedVerdict);
  });

  it('Defender step: responds to each critique with counter-evidence', async () => {
    faux = registerFauxProvider();
    const criticOutput: CriticResult = {
      critiques: [
        {
          point: 'Zhang et al. (2025) directly addresses this gap',
          severity: 'fatal',
          evidence: 'Zhang 2025 achieves 0.82 correlation with expert judgment',
        },
        {
          point: 'CD index provides an operationalizable novelty proxy',
          severity: 'major',
          evidence: 'Uzzi et al. use CD index with empirical validation',
        },
        {
          point: 'Scope does not cover human-AI collaborative pipelines',
          severity: 'minor',
          evidence: 'Elicit and similar tools not addressed',
        },
      ],
      overallAssessment: 'Gap needs tighter scoping to survive adversarial review',
      recommendedVerdict: 'REVISE',
    };

    const expected: DefenderResult = {
      defenses: [
        {
          againstPoint: 'Zhang et al. (2025) directly addresses this gap',
          response:
            'Zhang 2025 evaluates novelty of experimental designs, not research ideas at the hypothesis generation stage. The gap is specifically about adversarial validation at the idea-generation stage, which Zhang does not cover.',
          evidenceUsed:
            'Zhang 2025 abstract and Table 1 show evaluation on "experimental protocols", not "research hypotheses". The benchmarks used (IdeaBench) measure idea quality metrics unrelated to adversarial validation.',
        },
        {
          againstPoint: 'CD index provides an operationalizable novelty proxy',
          response:
            'CD index requires a complete citation graph and measures disruption retrospectively (5-10 years post-publication). It cannot be applied to evaluate novelty of a newly generated idea with no citation history. The gap is about prospective novelty evaluation, not retrospective.',
          evidenceUsed:
            "Uzzi et al. (2013) explicitly state CD index requires 'established citation networks' and acknowledge it 'cannot be applied to work without citation history'.",
        },
        {
          againstPoint: 'Scope does not cover human-AI collaborative pipelines',
          response:
            'Conceded: the gap claim is scoped to fully automated AI-generated research ideas. Hybrid pipelines are a separate and valid research direction, but not the scope of this specific gap.',
          evidenceUsed: 'No direct evidence needed — this is a scope clarification, not a refutation.',
        },
      ],
      concessions: [
        'The scope limitation to fully-automated (non-hybrid) pipelines is a real constraint that should be acknowledged in the gap statement',
      ],
      overallDefense:
        'The two fatal/major critiques fail to account for the specific stage (idea generation) and direction (prospective) of novelty evaluation targeted by this gap. Zhang 2025 and CD index both operate at different stages and directions. The gap remains valid and important with minor scope clarification needed.',
      recommendedVerdict: 'WEAK_ACCEPT',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await debateDefender({
      artifact: ARTIFACT,
      artifactType: ARTIFACT_TYPE,
      context: CONTEXT,
      criticOutput: JSON.stringify(criticOutput),
      _model: faux.getModel(),
    });

    expect(result.defenses.length).toBeGreaterThan(0);
    result.defenses.forEach((d) => {
      expect(d.againstPoint).toBeTruthy();
      expect(d.response).toBeTruthy();
      expect(d.evidenceUsed).toBeTruthy();
    });
    expect(result.concessions).toBeInstanceOf(Array);
    expect(result.overallDefense.length).toBeGreaterThan(20);
    expect(['ACCEPT', 'WEAK_ACCEPT', 'REVISE']).toContain(result.recommendedVerdict);
  });

  it('Judge step: evaluates critic vs defender and renders final verdict', async () => {
    faux = registerFauxProvider();
    const criticOutput: CriticResult = {
      critiques: [
        {
          point: 'Zhang et al. (2025) directly addresses this gap',
          severity: 'fatal',
          evidence: 'Zhang 2025 achieves 0.82 correlation with expert judgment',
        },
        {
          point: 'CD index provides an operationalizable novelty proxy',
          severity: 'major',
          evidence: 'Uzzi et al. use CD index with empirical validation',
        },
      ],
      overallAssessment: 'Gap needs tighter scoping',
      recommendedVerdict: 'REVISE',
    };

    const defenderOutput: DefenderResult = {
      defenses: [
        {
          againstPoint: 'Zhang et al. (2025) directly addresses this gap',
          response:
            'Zhang 2025 evaluates experimental designs, not hypothesis generation. Different stage.',
          evidenceUsed: 'Zhang 2025 abstract — evaluates experimental protocols, not hypotheses',
        },
        {
          againstPoint: 'CD index provides an operationalizable novelty proxy',
          response:
            'CD index is retrospective and requires citation history. Gap is about prospective evaluation of new ideas.',
          evidenceUsed: 'Uzzi et al. explicitly require established citation networks',
        },
      ],
      concessions: ['Scope should be clarified to specify idea-generation stage'],
      overallDefense:
        'Both major critiques fail to account for the stage and direction specificity of this gap. Gap is valid with minor scope clarification.',
      recommendedVerdict: 'WEAK_ACCEPT',
    };

    const expected: JudgeResult = {
      verdict: 'REVISE',
      confidence: 0.72,
      reasoning:
        "The Defender successfully refuted the fatal critique (Zhang 2025 stage mismatch) and the major critique (CD index direction mismatch) with solid textual evidence. However, the Defender's own concession about scope clarification is significant — the gap claim as stated does not specify the idea-generation stage, which led to the Critic's mischaracterization. The gap is fundamentally valid but needs explicit scope language before full acceptance.",
      keyFactors: [
        'Defender correctly identified stage mismatch in Zhang 2025 — fatal critique neutralized',
        'Defender correctly identified direction mismatch in CD index — major critique neutralized',
        "Defender's concession on scope is valid and represents a real weakness in the gap statement",
        'Gap is valid but gap statement needs one sentence of scope clarification',
      ],
      debateSummary:
        "Critic raised strong technical objections (Zhang 2025 and CD index) but both were successfully refuted on stage/direction grounds. The Defender's own concession on scope is the operative weakness. Verdict: REVISE to clarify scope, not REJECT.",
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await debateJudge({
      artifact: ARTIFACT,
      artifactType: ARTIFACT_TYPE,
      criticOutput: JSON.stringify(criticOutput),
      defenderOutput: JSON.stringify(defenderOutput),
      _model: faux.getModel(),
    });

    expect(['ACCEPT', 'REJECT', 'REVISE', 'CONTINUE', 'ITEM_A', 'ITEM_B', 'TIE']).toContain(
      result.verdict
    );
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.reasoning.length).toBeGreaterThan(20);
  });

  it('Full single-round debate: critic → defender → judge with chained outputs', async () => {
    faux = registerFauxProvider();

    const criticExpected: CriticResult = {
      critiques: [
        {
          point: 'Zhang 2025 directly addresses the gap at the idea stage',
          severity: 'fatal',
          evidence: '0.82 correlation with expert judgment on IdeaBench',
        },
        {
          point: 'CD index is an operationalizable novelty proxy',
          severity: 'major',
          evidence: 'Uzzi et al. 2013 with empirical validation',
        },
      ],
      overallAssessment: 'Gap claim undermined by existing work — needs scoping revision',
      recommendedVerdict: 'REVISE',
    };

    const defenderExpected: DefenderResult = {
      defenses: [
        {
          againstPoint: 'Zhang 2025 directly addresses the gap at the idea stage',
          response: 'Zhang 2025 covers experimental designs, not idea generation — different stage',
          evidenceUsed: 'Zhang 2025 Table 1 covers experimental protocols',
        },
        {
          againstPoint: 'CD index is an operationalizable novelty proxy',
          response: 'CD index is retrospective; gap requires prospective evaluation',
          evidenceUsed: "Uzzi et al. require 'established citation networks'",
        },
      ],
      concessions: ['Gap statement should specify idea-generation stage explicitly'],
      overallDefense: 'Both critiques fail on stage/direction grounds; gap valid with minor scope fix',
      recommendedVerdict: 'WEAK_ACCEPT',
    };

    const judgeExpected: JudgeResult = {
      verdict: 'REVISE',
      confidence: 0.75,
      reasoning:
        'Defender successfully refuted both major critiques. Gap is fundamentally valid but needs scope clarification per Defender concession.',
      keyFactors: [
        'Fatal critique neutralized by stage mismatch',
        'Major critique neutralized by direction mismatch',
        'Scope clarification needed per Defender concession',
      ],
      debateSummary: 'Gap valid, REVISE to add scope language at idea-generation stage',
    };

    faux.setResponses([
      fauxAssistantMessage([fauxText(JSON.stringify(criticExpected))]),
      fauxAssistantMessage([fauxText(JSON.stringify(defenderExpected))]),
      fauxAssistantMessage([fauxText(JSON.stringify(judgeExpected))]),
    ]);

    const model = faux.getModel();

    // Round 1: Critic
    const criticResult = await debateCritic({
      artifact: ARTIFACT,
      artifactType: ARTIFACT_TYPE,
      context: CONTEXT,
      _model: model,
    });
    expect(criticResult.critiques.length).toBeGreaterThan(0);
    expect(criticResult.recommendedVerdict).toBe('REVISE');

    // Round 1: Defender (receives critic output)
    const defenderResult = await debateDefender({
      artifact: ARTIFACT,
      artifactType: ARTIFACT_TYPE,
      context: CONTEXT,
      criticOutput: JSON.stringify(criticResult),
      _model: model,
    });
    expect(defenderResult.defenses.length).toBeGreaterThan(0);
    expect(defenderResult.concessions.length).toBeGreaterThan(0);

    // Judge: receives both critic and defender outputs
    const judgeResult = await debateJudge({
      artifact: ARTIFACT,
      artifactType: ARTIFACT_TYPE,
      criticOutput: JSON.stringify(criticResult),
      defenderOutput: JSON.stringify(defenderResult),
      _model: model,
    });

    // Final assertions on the full debate chain
    expect(['ACCEPT', 'REJECT', 'REVISE', 'CONTINUE', 'ITEM_A', 'ITEM_B', 'TIE']).toContain(
      judgeResult.verdict
    );
    expect(judgeResult.confidence).toBeGreaterThan(0);
    expect(judgeResult.reasoning.length).toBeGreaterThan(20);

    // Verify data flow: defender should address the same points as critic
    criticResult.critiques.forEach((critique) => {
      const addressed = defenderResult.defenses.some((d) =>
        d.againstPoint.includes(critique.point.slice(0, 20))
      );
      expect(addressed).toBe(true);
    });
  });

  it('REJECT path: judge rules against defender when critic evidence is overwhelming', async () => {
    faux = registerFauxProvider();

    const strongCritic: CriticResult = {
      critiques: [
        {
          point: 'The proposed gap is identical to the gap addressed by Li et al. 2024 (ArXiv:2401.12345)',
          severity: 'fatal',
          evidence:
            'Li 2024 implements a three-agent debate system (Generator, Critic, Judge) for research idea validation with 0.89 F1 on IdeaBench and is open-source on GitHub',
        },
        {
          point: 'The gap claim misrepresents the state of Sakai AI Scientist which added adversarial validation in v2 (2024)',
          severity: 'fatal',
          evidence:
            'Sakai AI Scientist v2 release notes (Oct 2024) explicitly list "adversarial novelty review" as a new feature',
        },
      ],
      overallAssessment:
        'The gap has been filled by at least two independent systems with demonstrated results. The claim is factually incorrect.',
      recommendedVerdict: 'REJECT',
    };

    const weakDefender: DefenderResult = {
      defenses: [
        {
          againstPoint: 'Li et al. 2024 identical gap',
          response:
            'I cannot verify this claim without reading Li 2024 in detail. The gap may still differ in scope.',
          evidenceUsed: 'No direct counter-evidence available',
        },
        {
          againstPoint: 'Sakai AI Scientist v2 adds adversarial validation',
          response:
            'The release notes mention adversarial review but the implementation may be superficial compared to a full debate protocol.',
          evidenceUsed: 'Speculative — no benchmarks available for the new feature',
        },
      ],
      concessions: [
        'If Li 2024 is correctly characterized, the gap claim as stated is not novel',
        'If Sakai v2 adversarial feature is validated, the gap may need complete reformulation',
      ],
      overallDefense:
        'Insufficient evidence to rebut both fatal critiques. The gap needs re-examination against these specific papers.',
      recommendedVerdict: 'REVISE',
    };

    const rejectJudge: JudgeResult = {
      verdict: 'REJECT',
      confidence: 0.85,
      reasoning:
        'The Defender failed to rebut both fatal critiques with evidence. The concessions are significant — if Li 2024 and Sakai v2 are correctly characterized (and Critic provided specific citations), the gap as stated is not novel. The Defender offered only speculative rebuttals. Until specific counter-evidence is provided, the gap claim must be REJECTED.',
      keyFactors: [
        'Two fatal critiques with specific citations not rebutted with evidence',
        "Defender's concessions are substantial — effectively acknowledging the gap may be filled",
        'Speculative rebuttals are insufficient against specific empirical claims',
      ],
      debateSummary:
        'Critic provided two specific citations that directly fill the claimed gap. Defender offered only speculation. REJECT pending specific counter-evidence.',
    };

    faux.setResponses([
      fauxAssistantMessage([fauxText(JSON.stringify(strongCritic))]),
      fauxAssistantMessage([fauxText(JSON.stringify(weakDefender))]),
      fauxAssistantMessage([fauxText(JSON.stringify(rejectJudge))]),
    ]);

    const model = faux.getModel();

    const criticResult = await debateCritic({
      artifact: ARTIFACT,
      artifactType: ARTIFACT_TYPE,
      context: CONTEXT,
      _model: model,
    });

    const defenderResult = await debateDefender({
      artifact: ARTIFACT,
      artifactType: ARTIFACT_TYPE,
      context: CONTEXT,
      criticOutput: JSON.stringify(criticResult),
      _model: model,
    });

    const judgeResult = await debateJudge({
      artifact: ARTIFACT,
      artifactType: ARTIFACT_TYPE,
      criticOutput: JSON.stringify(criticResult),
      defenderOutput: JSON.stringify(defenderResult),
      _model: model,
    });

    expect(judgeResult.verdict).toBe('REJECT');
    expect(judgeResult.confidence).toBeGreaterThan(0.5);
  });
});
