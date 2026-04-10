/**
 * E2E test: full 7-step INSIGHT pipeline using faux provider.
 * Each step produces output that feeds into the next step.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { insightRootCause } from '../../../packages/agents/src/tools/insight-root-cause.js';
import { insightStakeholder } from '../../../packages/agents/src/tools/insight-stakeholder.js';
import { insightTension } from '../../../packages/agents/src/tools/insight-tension.js';
import { insightHmw } from '../../../packages/agents/src/tools/insight-hmw.js';
import { insightAbstraction } from '../../../packages/agents/src/tools/insight-abstraction.js';
import { insightAssumption } from '../../../packages/agents/src/tools/insight-assumption.js';
import { insightValidation } from '../../../packages/agents/src/tools/insight-validation.js';

import type { RootCauseResult } from '../../../packages/agents/src/tools/insight-root-cause.js';
import type { StakeholderResult } from '../../../packages/agents/src/tools/insight-stakeholder.js';
import type { TensionResult } from '../../../packages/agents/src/tools/insight-tension.js';
import type { HmwResult } from '../../../packages/agents/src/tools/insight-hmw.js';
import type { AbstractionResult } from '../../../packages/agents/src/tools/insight-abstraction.js';
import type { AssumptionResult } from '../../../packages/agents/src/tools/insight-assumption.js';
import type { ValidationResult } from '../../../packages/agents/src/tools/insight-validation.js';

const GAP =
  'No existing method provides adversarial validation of AI-generated research ideas before human review';
const EVIDENCE =
  'Sakai AI Scientist generates and self-rates ideas. OpenAI Deep Research synthesizes without adversarial checking. AutoResearcher uses single-model self-evaluation throughout.';
const KNOWLEDGE =
  'LLMs are prone to sycophancy and confirmation bias. Multi-agent debate improves reasoning quality. Research automation systems lack independent evaluators.';

describe('INSIGHT pipeline — full 7-step E2E', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('Step 1 — insightRootCause: surface gap → root cause via why-chain', async () => {
    faux = registerFauxProvider();
    const expected: RootCauseResult = {
      surfaceGap:
        'No existing method provides adversarial validation of AI-generated research ideas before human review',
      whyChain: [
        {
          level: 1,
          why: 'Why does this gap exist?',
          because:
            'Idea generators and evaluators are typically the same model, creating a self-evaluation conflict of interest',
        },
        {
          level: 2,
          why: 'Why are generator and evaluator the same?',
          because:
            'Adversarial multi-agent frameworks for idea evaluation are not standard in research automation',
        },
        {
          level: 3,
          why: 'Why are adversarial frameworks not standard?',
          because:
            'The field lacks an operationalizable definition of research novelty suitable for adversarial testing',
        },
      ],
      rootCause:
        'No operationalizable definition of research novelty exists that can be adversarially tested without ground-truth labels',
      hiddenAssumptions: [
        'A single model can objectively assess novelty of ideas it generates',
        'Human review is the gold standard for idea quality',
      ],
      unexploredAngles: [
        'Citation graph embeddings to quantify semantic distance from existing work',
        'Multi-agent Elo-ranking tournaments to establish relative novelty scores',
      ],
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightRootCause({
      gap: GAP,
      evidence: EVIDENCE,
      knowledge: KNOWLEDGE,
      _model: faux.getModel(),
    });

    expect(result.surfaceGap).toBeTruthy();
    expect(result.surfaceGap.length).toBeGreaterThan(10);
    expect(result.whyChain).toHaveLength(3);
    expect(result.whyChain[0]).toHaveProperty('level', 1);
    expect(result.whyChain[0]).toHaveProperty('why');
    expect(result.whyChain[0]).toHaveProperty('because');
    expect(result.rootCause.length).toBeGreaterThan(20);
    expect(result.hiddenAssumptions).toBeInstanceOf(Array);
    expect(result.hiddenAssumptions.length).toBeGreaterThan(0);
    expect(result.unexploredAngles).toBeInstanceOf(Array);
    expect(result.unexploredAngles.length).toBeGreaterThan(0);
  });

  it('Step 2 — insightStakeholder: root cause → stakeholder map with underserved group', async () => {
    faux = registerFauxProvider();
    const rootCauseOutput: RootCauseResult = {
      surfaceGap: GAP,
      whyChain: [
        { level: 1, why: 'Why?', because: 'Self-evaluation conflict of interest' },
        { level: 2, why: 'Why no adversarial?', because: 'Not standard in automation' },
        { level: 3, why: 'Why not standard?', because: 'No operationalizable novelty definition' },
      ],
      rootCause: 'No operationalizable novelty definition for adversarial testing',
      hiddenAssumptions: ['Single model can assess its own novelty'],
      unexploredAngles: ['Citation graph embeddings'],
    };

    const expected: StakeholderResult = {
      stakeholders: [
        {
          name: 'ML Researcher',
          role: 'Primary research consumer',
          jtbd: 'Rapidly identify genuinely novel research directions without wasting lab resources on already-explored ideas',
          painPoints: [
            'Spends weeks on ideas that turn out to be incremental',
            'Cannot trust AI systems to self-report their own novelty assessments',
          ],
          gainOpportunities: [
            'Could review only pre-validated ideas with known novelty scores',
            'Could use adversarial audit trails to understand why an idea was flagged',
          ],
        },
        {
          name: 'Research Automation Tool Developer',
          role: 'System builder',
          jtbd: 'Build research automation systems that produce trustworthy outputs',
          painPoints: [
            'No standardized adversarial evaluation component to integrate',
            'Difficult to benchmark idea quality objectively',
          ],
          gainOpportunities: [
            'Could modularize adversarial validation as a reusable microservice',
          ],
        },
        {
          name: 'PhD Student',
          role: 'Emerging researcher',
          jtbd: 'Identify research gaps that are both novel and tractable within a 3-5 year PhD',
          painPoints: [
            'Limited access to senior researcher guidance on novelty assessment',
            'High risk of investing years in a contribution that is later shown to be incremental',
          ],
          gainOpportunities: [
            'Automated adversarial review could substitute for inaccessible senior mentorship',
          ],
        },
      ],
      underservedStakeholder:
        'PhD Student — most underserved because they bear the highest personal cost of novelty misjudgment with the least access to correction mechanisms',
      conflictingNeeds:
        'ML Researchers want fast throughput of ideas (accept more false positives) while Research Tool Developers want precision and auditability (minimize false positives even at the cost of speed)',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightStakeholder({
      gap: GAP,
      rootCauseOutput: JSON.stringify(rootCauseOutput),
      _model: faux.getModel(),
    });

    expect(result.stakeholders).toHaveLength(3);
    result.stakeholders.forEach((s) => {
      expect(s.name).toBeTruthy();
      expect(s.role).toBeTruthy();
      expect(s.jtbd).toBeTruthy();
      expect(s.painPoints).toBeInstanceOf(Array);
      expect(s.painPoints.length).toBeGreaterThan(0);
      expect(s.gainOpportunities).toBeInstanceOf(Array);
      expect(s.gainOpportunities.length).toBeGreaterThan(0);
    });
    expect(result.underservedStakeholder.length).toBeGreaterThan(10);
    expect(result.conflictingNeeds.length).toBeGreaterThan(10);
  });

  it('Step 3 — insightTension: stakeholders → productive tensions with innovation lever', async () => {
    faux = registerFauxProvider();
    const stakeholderOutput: StakeholderResult = {
      stakeholders: [
        {
          name: 'ML Researcher',
          role: 'Primary consumer',
          jtbd: 'Identify novel research directions fast',
          painPoints: ['Cannot trust self-rated novelty'],
          gainOpportunities: ['Pre-validated idea pipeline'],
        },
        {
          name: 'PhD Student',
          role: 'Emerging researcher',
          jtbd: 'Find tractable novel gaps',
          painPoints: ['No senior guidance substitute'],
          gainOpportunities: ['Automated adversarial mentorship'],
        },
      ],
      underservedStakeholder: 'PhD Student',
      conflictingNeeds: 'Speed vs precision tradeoff',
    };

    const expected: TensionResult = {
      tensions: [
        {
          tensionType: 'Epistemic vs Operational',
          description:
            'Research novelty requires deep semantic understanding (epistemic) but evaluation must be fast and automatable (operational)',
          sideA: 'True novelty assessment requires reading and understanding every prior paper deeply',
          sideB:
            'Practical research automation needs evaluation in seconds, not weeks of literature reading',
          currentBalance:
            'Field currently sacrifices operational speed (human review) for epistemic accuracy',
          innovationLever:
            'Approximate novelty via citation graph embedding similarity — sacrifices some epistemic depth for operational speed at acceptable precision',
        },
        {
          tensionType: 'Creativity vs Rigor',
          description:
            'Highly novel ideas are inherently speculative and hard to evaluate rigorously; rigorously evaluable ideas tend to be incremental',
          sideA: 'Breakthrough ideas must be allowed even when evidence is thin',
          sideB: 'Research tools must reject noise and low-quality ideas reliably',
          currentBalance: 'Human reviewers implicitly balance this with domain expertise',
          innovationLever:
            'Separate evaluation criteria for speculative vs incremental ideas — apply rigor test only to clearly incremental claims',
        },
      ],
      primaryTension: 'Creativity vs Rigor',
      tensionInsight:
        'The core innovation space is to make creativity and rigor complementary rather than adversarial — an adversarial debate protocol between a Generator and a Critic can operationalize both simultaneously',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightTension({
      gap: GAP,
      stakeholderOutput: JSON.stringify(stakeholderOutput),
      _model: faux.getModel(),
    });

    expect(result.tensions).toHaveLength(2);
    result.tensions.forEach((t) => {
      expect(t.tensionType).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.sideA).toBeTruthy();
      expect(t.sideB).toBeTruthy();
      expect(t.currentBalance).toBeTruthy();
      expect(t.innovationLever).toBeTruthy();
    });
    expect(result.primaryTension.length).toBeGreaterThan(5);
    expect(result.tensionInsight.length).toBeGreaterThan(20);
  });

  it('Step 4 — insightHmw: tensions → ranked HMW questions', async () => {
    faux = registerFauxProvider();
    const tensionOutput: TensionResult = {
      tensions: [
        {
          tensionType: 'Creativity vs Rigor',
          description: 'Highly novel ideas are speculative; rigorous ideas tend to be incremental',
          sideA: 'Breakthroughs require tolerance for speculation',
          sideB: 'Research tools must reliably reject noise',
          currentBalance: 'Human reviewers balance this implicitly',
          innovationLever: 'Adversarial debate protocol between Generator and Critic',
        },
      ],
      primaryTension: 'Creativity vs Rigor',
      tensionInsight: 'Make creativity and rigor complementary via adversarial protocol',
    };

    const expected: HmwResult = {
      hmwQuestions: [
        {
          question:
            'How might we design an adversarial idea validation system that rewards genuinely novel ideas while reliably filtering incremental ones?',
          sourceTension: 'Creativity vs Rigor',
          scope: 'System-level: covers idea generation through validation pipeline',
          actionability:
            'High — can be prototyped with existing multi-agent LLM frameworks in 3 months',
          noveltyPotential:
            'High — no existing system implements separate Critic and Defender roles with independent training',
        },
        {
          question:
            'How might we operationalize research novelty as a measurable score that can be computed without human ground-truth labels?',
          sourceTension: 'Epistemic vs Operational',
          scope: 'Metric-level: defines a computable novelty proxy',
          actionability:
            'Medium — requires embedding model training on citation graphs, available within 6 months',
          noveltyPotential:
            'Very high — directly addresses the root cause by creating the missing operationalizable novelty definition',
        },
        {
          question:
            'How might we give PhD students access to the equivalent of senior researcher adversarial critique at zero marginal cost?',
          sourceTension: 'Creativity vs Rigor',
          scope: 'Access-level: democratizes adversarial review for resource-constrained researchers',
          actionability:
            'High — an open-source adversarial validation agent would directly serve this need',
          noveltyPotential:
            'Medium — the gap is well-understood but no free-to-use adversarial review tool exists',
        },
      ],
      rankedQuestions: [
        'How might we operationalize research novelty as a measurable score that can be computed without human ground-truth labels?',
        'How might we design an adversarial idea validation system that rewards genuinely novel ideas while reliably filtering incremental ones?',
        'How might we give PhD students access to the equivalent of senior researcher adversarial critique at zero marginal cost?',
      ],
      rankingRationale:
        'Q2 is ranked first because it directly attacks the root cause (missing novelty definition) and has the highest novelty potential. Q1 is ranked second because it is actionable now and addresses the primary tension. Q3 is ranked third as it is an important access goal but downstream of the technical novelty.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightHmw({
      tensions: JSON.stringify(tensionOutput),
      _model: faux.getModel(),
    });

    expect(result.hmwQuestions).toHaveLength(3);
    result.hmwQuestions.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.sourceTension).toBeTruthy();
      expect(q.scope).toBeTruthy();
      expect(q.actionability).toBeTruthy();
      expect(q.noveltyPotential).toBeTruthy();
    });
    expect(result.rankedQuestions).toHaveLength(3);
    expect(result.rankingRationale.length).toBeGreaterThan(20);
    // ranked questions should be a subset of hmwQuestions
    result.rankedQuestions.forEach((rq) => {
      const found = result.hmwQuestions.some((q) => q.question === rq);
      expect(found).toBe(true);
    });
  });

  it('Step 5 — insightAbstraction: HMW questions → abstraction ladder with reframed problem', async () => {
    faux = registerFauxProvider();
    const hmwOutput: HmwResult = {
      hmwQuestions: [
        {
          question:
            'How might we operationalize research novelty as a measurable score without human ground-truth labels?',
          sourceTension: 'Epistemic vs Operational',
          scope: 'Metric-level',
          actionability: 'Medium',
          noveltyPotential: 'Very high',
        },
        {
          question:
            'How might we design an adversarial validation system that rewards genuinely novel ideas?',
          sourceTension: 'Creativity vs Rigor',
          scope: 'System-level',
          actionability: 'High',
          noveltyPotential: 'High',
        },
      ],
      rankedQuestions: [
        'How might we operationalize research novelty as a measurable score without human ground-truth labels?',
        'How might we design an adversarial validation system that rewards genuinely novel ideas?',
      ],
      rankingRationale: 'Root cause attack first, then actionable system second',
    };

    const expected: AbstractionResult = {
      ladder: [
        {
          level: 1,
          type: 'concrete',
          statement:
            'Build an adversarial LLM debate system where a Critic challenges and a Defender responds to a generated research idea, with a Judge deciding novelty',
        },
        {
          level: 2,
          type: 'abstract',
          statement:
            'Design a structurally independent evaluation protocol that separates idea generation from idea assessment to eliminate self-evaluation bias',
        },
        {
          level: 3,
          type: 'meta',
          statement:
            'Create a scientific peer review mechanism that scales to AI-generated content volume by replacing human reviewers with adversarially-trained specialist agents',
        },
      ],
      insightFromLadder:
        'The blind peer review process used in human science is the structural archetype: the key innovation is not the adversarial debate itself but the structural independence between generator and evaluator',
      reframedProblem:
        'How do we implement the structural independence of blind peer review in an automated system that can evaluate 1000+ research ideas per hour without access to ground-truth novelty labels?',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightAbstraction({
      hmwQuestions: JSON.stringify(hmwOutput),
      _model: faux.getModel(),
    });

    expect(result.ladder).toHaveLength(3);
    result.ladder.forEach((rung) => {
      expect(rung.level).toBeGreaterThan(0);
      expect(['concrete', 'abstract', 'meta']).toContain(rung.type);
      expect(rung.statement.length).toBeGreaterThan(10);
    });
    const types = result.ladder.map((r) => r.type);
    expect(types).toContain('concrete');
    expect(types).toContain('abstract');
    expect(types).toContain('meta');
    expect(result.insightFromLadder.length).toBeGreaterThan(20);
    expect(result.reframedProblem.length).toBeGreaterThan(20);
  });

  it('Step 6 — insightAssumption: full insight chain → assumption audit with critical vs safe split', async () => {
    faux = registerFauxProvider();
    const insightSoFar = JSON.stringify({
      step1RootCause: 'No operationalizable novelty definition for adversarial testing',
      step2Stakeholder: 'PhD Student most underserved; speed vs precision conflict',
      step3Tension: 'Creativity vs Rigor — make them complementary via adversarial protocol',
      step4HMW: 'How to operationalize novelty as a score without ground-truth labels?',
      step5Abstraction: 'Structural independence of blind peer review in automated system',
    });

    const expected: AssumptionResult = {
      assumptions: [
        {
          statement:
            'LLM-based adversarial debate produces assessments that correlate with expert human novelty judgments',
          source: 'step3 tension — adversarial protocol as innovation lever',
          verdict: 'questionable',
          evidence:
            'Some evidence from Constitutional AI and debate papers, but no direct study on research idea novelty specifically',
          risk: 'High — if this assumption is false, the entire adversarial validation approach produces unreliable verdicts',
        },
        {
          statement:
            'Citation graph embedding similarity is a valid proxy for semantic novelty of a research idea',
          source: 'step4 HMW — operationalizing novelty without labels',
          verdict: 'questionable',
          evidence:
            'Citation overlap is used as a proxy in bibliometrics but has known failure modes for cross-domain novelty',
          risk: 'Medium — if false, the metric-level approach needs a different proxy, but the system-level approach is unaffected',
        },
        {
          statement:
            'PhD students have access to and are willing to use an open-source adversarial validation tool',
          source: 'step2 stakeholder — underserved PhD student',
          verdict: 'valid',
          evidence: 'High adoption of tools like ChatGPT and Perplexity among PhD students confirms willingness',
          risk: 'Low — distribution and adoption barriers exist but are not fundamental to the technical approach',
        },
        {
          statement:
            'A structurally independent Critic and Defender can be instantiated from the same base LLM',
          source: 'step5 abstraction — structural independence via blind peer review analogy',
          verdict: 'questionable',
          evidence:
            'Shared weights mean the same priors are used; true independence requires either fine-tuning on different data or using different base models',
          risk: 'High — if structural independence cannot be achieved with a single model, the implementation complexity increases significantly',
        },
      ],
      criticalAssumptions: [
        'LLM-based adversarial debate produces assessments that correlate with expert human novelty judgments',
        'A structurally independent Critic and Defender can be instantiated from the same base LLM',
      ],
      safeAssumptions: [
        'PhD students have access to and are willing to use an open-source adversarial validation tool',
      ],
      recommendation:
        'Prioritize empirical validation of the two critical assumptions before full system build. Design a small-scale human study comparing adversarial LLM debate verdicts to expert novelty judgments on 20-50 ideas. Simultaneously test whether Critic/Defender role-prompting on the same base model produces sufficiently divergent assessments.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightAssumption({
      insightSoFar,
      _model: faux.getModel(),
    });

    expect(result.assumptions.length).toBeGreaterThan(0);
    result.assumptions.forEach((a) => {
      expect(a.statement).toBeTruthy();
      expect(a.source).toBeTruthy();
      expect(['valid', 'questionable', 'false']).toContain(a.verdict);
      expect(a.evidence).toBeTruthy();
      expect(a.risk).toBeTruthy();
    });
    expect(result.criticalAssumptions).toBeInstanceOf(Array);
    expect(result.criticalAssumptions.length).toBeGreaterThan(0);
    expect(result.safeAssumptions).toBeInstanceOf(Array);
    expect(result.recommendation.length).toBeGreaterThan(20);
  });

  it('Step 7 — insightValidation: full chain → 6-gate quality verdict', async () => {
    faux = registerFauxProvider();
    const fullInsight = JSON.stringify({
      gap: GAP,
      rootCause: 'No operationalizable novelty definition for adversarial testing',
      underservedStakeholder: 'PhD Student',
      primaryTension: 'Creativity vs Rigor',
      topHmwQuestion:
        'How to operationalize novelty as a score without ground-truth labels?',
      reframedProblem: 'Structural independence of blind peer review in automated system',
      criticalAssumptions: ['LLM debate correlates with expert novelty judgment'],
    });

    const expected: ValidationResult = {
      gates: [
        {
          gate: 1,
          name: 'Specificity',
          passed: true,
          reasoning:
            'The gap is precisely scoped to adversarial validation of AI-generated ideas before human review. The root cause is a specific missing artifact (operationalizable novelty definition), not a vague hand-wave.',
        },
        {
          gate: 2,
          name: 'Evidence',
          passed: true,
          reasoning:
            'The root cause is grounded in observed behaviors of Sakai AI Scientist and OpenAI Deep Research with specific failure mode descriptions.',
        },
        {
          gate: 3,
          name: 'Stakeholder Clarity',
          passed: true,
          reasoning:
            'Three distinct stakeholders with concrete pain points identified. PhD Student underserved status is justified with clear reasoning about asymmetric cost of novelty misjudgment.',
        },
        {
          gate: 4,
          name: 'Tension Productivity',
          passed: true,
          reasoning:
            'Creativity vs Rigor is a genuine trade-off with real value on both sides. The adversarial protocol innovation lever is concrete and directional.',
        },
        {
          gate: 5,
          name: 'Actionability',
          passed: true,
          reasoning:
            'The reframed problem (blind peer review structural independence at scale) can be prototyped with existing multi-agent LLM frameworks within 3 months.',
        },
        {
          gate: 6,
          name: 'Assumption Safety',
          passed: true,
          reasoning:
            'Critical assumptions are explicitly identified with proposed test designs. Safe assumptions are grounded in observable behavior.',
        },
      ],
      overallVerdict: 'PASS',
      failedGates: [],
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await insightValidation({
      fullInsight,
      _model: faux.getModel(),
    });

    expect(result.gates).toHaveLength(6);
    result.gates.forEach((g) => {
      expect(typeof g.gate).toBe('number');
      expect(g.name).toBeTruthy();
      expect(typeof g.passed).toBe('boolean');
      expect(g.reasoning.length).toBeGreaterThan(10);
    });
    expect(['PASS', 'FAIL', 'REVISE']).toContain(result.overallVerdict);
    expect(result.failedGates).toBeInstanceOf(Array);
  });

  it('Full pipeline chained: output of each step feeds the next', async () => {
    faux = registerFauxProvider();

    // Build all 7 expected responses in order
    const step1: RootCauseResult = {
      surfaceGap: GAP,
      whyChain: [
        { level: 1, why: 'Why?', because: 'Self-evaluation conflict' },
        { level: 2, why: 'Why no adversarial?', because: 'Not standard' },
        { level: 3, why: 'Why not standard?', because: 'No novelty definition' },
      ],
      rootCause: 'No operationalizable novelty definition for adversarial testing',
      hiddenAssumptions: ['Single model can rate its own ideas objectively'],
      unexploredAngles: ['Citation graph similarity as novelty proxy'],
    };

    const step2: StakeholderResult = {
      stakeholders: [
        {
          name: 'ML Researcher',
          role: 'Consumer',
          jtbd: 'Rapid novel direction identification',
          painPoints: ['Cannot trust self-rated novelty'],
          gainOpportunities: ['Pre-validated idea pipeline'],
        },
        {
          name: 'PhD Student',
          role: 'Emerging researcher',
          jtbd: 'Find tractable novel gaps',
          painPoints: ['No senior guidance substitute'],
          gainOpportunities: ['Automated adversarial mentorship'],
        },
      ],
      underservedStakeholder: 'PhD Student — bears highest cost of novelty misjudgment',
      conflictingNeeds: 'Speed (ML Researcher) vs accuracy (Tool Developer)',
    };

    const step3: TensionResult = {
      tensions: [
        {
          tensionType: 'Creativity vs Rigor',
          description: 'Novel ideas are speculative; rigorous ideas tend incremental',
          sideA: 'Allow speculation for breakthroughs',
          sideB: 'Reject noise reliably',
          currentBalance: 'Human reviewers balance implicitly',
          innovationLever: 'Adversarial debate protocol',
        },
      ],
      primaryTension: 'Creativity vs Rigor',
      tensionInsight: 'Make creativity and rigor complementary via adversarial protocol',
    };

    const step4: HmwResult = {
      hmwQuestions: [
        {
          question: 'How might we operationalize novelty as a score without ground-truth labels?',
          sourceTension: 'Epistemic vs Operational',
          scope: 'Metric-level',
          actionability: 'Medium',
          noveltyPotential: 'Very high',
        },
        {
          question: 'How might we design an adversarial system rewarding genuinely novel ideas?',
          sourceTension: 'Creativity vs Rigor',
          scope: 'System-level',
          actionability: 'High',
          noveltyPotential: 'High',
        },
      ],
      rankedQuestions: [
        'How might we operationalize novelty as a score without ground-truth labels?',
        'How might we design an adversarial system rewarding genuinely novel ideas?',
      ],
      rankingRationale: 'Root cause attack first, actionable system second',
    };

    const step5: AbstractionResult = {
      ladder: [
        { level: 1, type: 'concrete', statement: 'Build adversarial LLM debate for idea novelty' },
        {
          level: 2,
          type: 'abstract',
          statement: 'Structurally independent evaluation protocol separating generation from assessment',
        },
        {
          level: 3,
          type: 'meta',
          statement: 'Scaled scientific peer review mechanism for AI-generated content',
        },
      ],
      insightFromLadder: 'Blind peer review is the structural archetype',
      reframedProblem:
        'Implement structural independence of blind peer review at automated evaluation scale',
    };

    const step6: AssumptionResult = {
      assumptions: [
        {
          statement: 'LLM adversarial debate correlates with expert novelty judgment',
          source: 'step3 tension',
          verdict: 'questionable',
          evidence: 'Some evidence from debate papers, not directly on novelty',
          risk: 'High',
        },
        {
          statement: 'PhD students will adopt open-source adversarial tool',
          source: 'step2 stakeholder',
          verdict: 'valid',
          evidence: 'High ChatGPT adoption among PhD students',
          risk: 'Low',
        },
      ],
      criticalAssumptions: ['LLM adversarial debate correlates with expert novelty judgment'],
      safeAssumptions: ['PhD students will adopt open-source adversarial tool'],
      recommendation:
        'Empirically validate critical assumption with small human study before full build',
    };

    const step7: ValidationResult = {
      gates: [
        { gate: 1, name: 'Specificity', passed: true, reasoning: 'Precisely scoped gap' },
        { gate: 2, name: 'Evidence', passed: true, reasoning: 'Grounded in observed system behavior' },
        { gate: 3, name: 'Stakeholder Clarity', passed: true, reasoning: 'Three stakeholders with concrete pain points' },
        { gate: 4, name: 'Tension Productivity', passed: true, reasoning: 'Genuine trade-off with concrete innovation lever' },
        { gate: 5, name: 'Actionability', passed: true, reasoning: 'Prototypable in 3 months' },
        { gate: 6, name: 'Assumption Safety', passed: true, reasoning: 'Critical assumptions flagged with test designs' },
      ],
      overallVerdict: 'PASS',
      failedGates: [],
    };

    faux.setResponses([
      fauxAssistantMessage([fauxText(JSON.stringify(step1))]),
      fauxAssistantMessage([fauxText(JSON.stringify(step2))]),
      fauxAssistantMessage([fauxText(JSON.stringify(step3))]),
      fauxAssistantMessage([fauxText(JSON.stringify(step4))]),
      fauxAssistantMessage([fauxText(JSON.stringify(step5))]),
      fauxAssistantMessage([fauxText(JSON.stringify(step6))]),
      fauxAssistantMessage([fauxText(JSON.stringify(step7))]),
    ]);

    const model = faux.getModel();

    // Execute pipeline — each step output feeds the next
    const rootCauseResult = await insightRootCause({
      gap: GAP,
      evidence: EVIDENCE,
      knowledge: KNOWLEDGE,
      _model: model,
    });
    expect(rootCauseResult.whyChain.length).toBeGreaterThan(0);

    const stakeholderResult = await insightStakeholder({
      gap: GAP,
      rootCauseOutput: JSON.stringify(rootCauseResult),
      _model: model,
    });
    expect(stakeholderResult.stakeholders.length).toBeGreaterThan(0);

    const tensionResult = await insightTension({
      gap: GAP,
      stakeholderOutput: JSON.stringify(stakeholderResult),
      _model: model,
    });
    expect(tensionResult.tensions.length).toBeGreaterThan(0);

    const hmwResult = await insightHmw({
      tensions: JSON.stringify(tensionResult),
      _model: model,
    });
    expect(hmwResult.hmwQuestions.length).toBeGreaterThan(0);

    const abstractionResult = await insightAbstraction({
      hmwQuestions: JSON.stringify(hmwResult),
      _model: model,
    });
    expect(abstractionResult.ladder.length).toBeGreaterThan(0);

    const insightSoFar = JSON.stringify({
      rootCause: rootCauseResult,
      stakeholder: stakeholderResult,
      tension: tensionResult,
      hmw: hmwResult,
      abstraction: abstractionResult,
    });
    const assumptionResult = await insightAssumption({
      insightSoFar,
      _model: model,
    });
    expect(assumptionResult.assumptions.length).toBeGreaterThan(0);

    const fullInsight = JSON.stringify({
      ...JSON.parse(insightSoFar),
      assumption: assumptionResult,
    });
    const validationResult = await insightValidation({
      fullInsight,
      _model: model,
    });

    // Final validation checks
    expect(validationResult.gates).toHaveLength(6);
    expect(['PASS', 'FAIL', 'REVISE']).toContain(validationResult.overallVerdict);
    expect(validationResult.overallVerdict).toBe('PASS');
    expect(validationResult.failedGates).toHaveLength(0);
  });
});
