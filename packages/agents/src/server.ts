// packages/agents/src/server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { facetExtract } from './tools/facet-extract.js';
import { digestExtract } from './tools/digest-extract.js';
import { paperRate } from './tools/paper-rate.js';
import { selfReview } from './tools/self-review.js';
import { debateCritic } from './tools/debate-critic.js';
import { debateDefender } from './tools/debate-defender.js';
import { debateJudge } from './tools/debate-judge.js';
import { insightRootCause } from './tools/insight-root-cause.js';
import { insightStakeholder } from './tools/insight-stakeholder.js';
import { insightTension } from './tools/insight-tension.js';
import { insightHmw } from './tools/insight-hmw.js';
import { insightAbstraction } from './tools/insight-abstraction.js';
import { insightAssumption } from './tools/insight-assumption.js';
import { insightValidation } from './tools/insight-validation.js';
import { qualityDiversityFilter } from './tools/quality-diversity-filter.js';
import { scamperSubstitute } from './tools/scamper-substitute.js';
import { scamperCombine } from './tools/scamper-combine.js';
import { scamperAdapt } from './tools/scamper-adapt.js';
import { scamperModify } from './tools/scamper-modify.js';
import { scamperPutOtherUse } from './tools/scamper-put-other-use.js';
import { scamperEliminate } from './tools/scamper-eliminate.js';
import { scamperReverse } from './tools/scamper-reverse.js';
import { surgerySubtract } from './tools/surgery-subtract.js';
import { surgeryMultiply } from './tools/surgery-multiply.js';
import { surgeryDivide } from './tools/surgery-divide.js';
import { surgeryUnify } from './tools/surgery-unify.js';
import { surgeryRedirect } from './tools/surgery-redirect.js';
import { trizContradiction } from './tools/triz-contradiction.js';
import { morphologicalMatrix } from './tools/morphological-matrix.js';
import { facetBisociation } from './tools/facet-bisociation.js';
import { analogicalTransfer } from './tools/analogical-transfer.js';
import { randomPaperEntry } from './tools/random-paper-entry.js';
import { forcedBridge } from './tools/forced-bridge.js';
import { axiomNegation } from './tools/axiom-negation.js';
import { reverseEngineering } from './tools/reverse-engineering.js';
import { worstMethodAnalysis } from './tools/worst-method-analysis.js';
import { antiBenchmark } from './tools/anti-benchmark.js';
import { reviewer2Hat } from './tools/reviewer2-hat.js';
import { practitionerHat } from './tools/practitioner-hat.js';
import { theoristHat } from './tools/theorist-hat.js';
import { constraintInjection } from './tools/constraint-injection.js';
import { timeMachine } from './tools/time-machine.js';
import { benchmarkSweep } from './tools/benchmark-sweep.js';
import { methodProblemMatrix } from './tools/method-problem-matrix.js';
import { ablationBrainstorm } from './tools/ablation-brainstorm.js';
import { failureTaxonomy } from './tools/failure-taxonomy.js';
import { methodEvolveMutate } from './tools/method-evolve-mutate.js';
import { methodEvolveCrossover } from './tools/method-evolve-crossover.js';
import { methodEvolveEvaluate } from './tools/method-evolve-evaluate.js';

const server = new McpServer({
  name: 'dare-agents',
  version: '0.1.0',
  description: 'DARE v3.0 pi-ai agent tools — facet extraction, paper rating, debate, and more',
});

// --- Tool registrations added by Tasks 3-9 ---
// (each task adds its import + server.tool() call here)

server.tool(
  'facet_extract',
  'Extract (purpose, mechanism, evaluation) Facet triple from a paper',
  {
    paperMarkdown: z.string().describe('Full paper content in markdown format'),
    normalizedTitle: z.string().describe('Normalized paper title (cache key)'),
  },
  async (params) => {
    const result = await facetExtract(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'digest_extract',
  'Three-pass paper reading (Keshav method) producing structured Digest',
  {
    paperMarkdown: z.string().describe('Full paper content in markdown format'),
    normalizedTitle: z.string().describe('Normalized paper title (cache key)'),
    rating: z.enum(['High', 'Medium', 'Low']).describe('Reading depth: High=3 passes, Medium=2, Low=1'),
  },
  async (params) => {
    const result = await digestExtract(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'paper_rate',
  'Rate paper relevance (High/Medium/Low) based on metadata vs research topic',
  {
    title: z.string().describe('Paper title'),
    abstract: z.string().describe('Paper abstract'),
    year: z.number().optional().describe('Publication year'),
    citations: z.number().optional().describe('Citation count'),
    topic: z.string().describe('Research topic to rate relevance against'),
  },
  async (params) => {
    const result = await paperRate(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'self_review',
  'Single-call C→D→J self-review for any research artifact',
  {
    artifact: z.string().describe('The artifact to review (gap, idea, experiment plan, or results)'),
    artifactType: z.string().describe('Type: gap | idea | experiment-design | experiment-result'),
    context: z.string().describe('Supporting context (accumulated knowledge, evidence)'),
  },
  async (params) => {
    const result = await selfReview(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'debate_critic',
  'Critic role: attack artifact with evidence-based objections',
  {
    artifact: z.string(),
    artifactType: z.string(),
    context: z.string(),
    debateHistory: z.string().optional().describe('Previous debate rounds for context'),
  },
  async (params) => {
    const result = await debateCritic(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'debate_defender',
  'Defender role: defend artifact against critic attacks with evidence',
  {
    artifact: z.string(),
    artifactType: z.string(),
    context: z.string(),
    criticOutput: z.string().describe('JSON output from debate_critic'),
    debateHistory: z.string().optional(),
  },
  async (params) => {
    const result = await debateDefender(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'debate_judge',
  'Judge role: evaluate critic vs defender and render verdict',
  {
    artifact: z.string(),
    artifactType: z.string(),
    criticOutput: z.string().describe('JSON output from debate_critic'),
    defenderOutput: z.string().describe('JSON output from debate_defender'),
    debateHistory: z.string().optional(),
  },
  async (params) => {
    const result = await debateJudge(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'insight_root_cause',
  'Step 1 of INSIGHT pipeline: apply 5 Whys to drill from a surface research gap to its root cause',
  {
    gap: z.string().describe('The research gap to analyze'),
    evidence: z.string().describe('Evidence from literature supporting the existence of this gap'),
    knowledge: z.string().describe('Accumulated knowledge from the literature survey'),
  },
  async (params) => {
    const result = await insightRootCause(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'insight_stakeholder',
  'Step 2 of INSIGHT pipeline: JTBD stakeholder mapping — identify who is affected and how',
  {
    gap: z.string().describe('The research gap being analyzed'),
    rootCauseOutput: z.string().describe('JSON output from insight_root_cause'),
  },
  async (params) => {
    const result = await insightStakeholder(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'insight_tension',
  'Step 3 of INSIGHT pipeline: mine the tensions (opposing forces) that make the gap persistent',
  {
    gap: z.string().describe('The research gap being analyzed'),
    stakeholderOutput: z.string().describe('JSON output from insight_stakeholder'),
  },
  async (params) => {
    const result = await insightTension(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'insight_hmw',
  'Step 4 of INSIGHT pipeline: reformulate tensions as actionable How Might We questions',
  {
    tensions: z.string().describe('JSON output from insight_tension'),
  },
  async (params) => {
    const result = await insightHmw(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'insight_abstraction',
  'Step 5 of INSIGHT pipeline: build abstraction ladder from concrete problem to meta-principle and back',
  {
    hmwQuestions: z.string().describe('JSON output from insight_hmw'),
  },
  async (params) => {
    const result = await insightAbstraction(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'insight_assumption',
  'Step 6 of INSIGHT pipeline: audit all assumptions embedded in Steps 1-5 of the insight chain',
  {
    insightSoFar: z.string().describe('Concatenated JSON outputs from insight steps 1-5'),
  },
  async (params) => {
    const result = await insightAssumption(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'insight_validation',
  'Step 7 of INSIGHT pipeline: 6-gate validation checklist to determine if insight is ready for idea generation',
  {
    fullInsight: z.string().describe('Concatenated JSON outputs from all insight steps 1-6'),
  },
  async (params) => {
    const result = await insightValidation(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'quality_diversity_filter',
  'MAP-Elites-style quality-diversity filtering for ideas',
  {
    ideas: z.string().describe('JSON array of ideas to filter'),
    gaps: z.string().describe('JSON array of gaps defining the niche dimensions'),
  },
  async (params) => {
    const result = await qualityDiversityFilter(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'scamper_substitute',
  'SCAMPER: Replace a component with an alternative to generate idea variants',
  {
    idea: z.string().describe('JSON-serialized Idea object'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await scamperSubstitute(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'scamper_combine',
  'SCAMPER: Merge two ideas/methods into something new',
  {
    idea: z.string().describe('JSON-serialized Idea A object'),
    secondIdea: z.string().describe('JSON-serialized Idea B object to combine with Idea A'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await scamperCombine(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'scamper_adapt',
  'SCAMPER: Borrow and modify a technique from another domain',
  {
    idea: z.string().describe('JSON-serialized Idea object'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await scamperAdapt(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'scamper_modify',
  'SCAMPER: Magnify or minify a key aspect to generate idea variants',
  {
    idea: z.string().describe('JSON-serialized Idea object'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await scamperModify(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'scamper_put_other_use',
  'SCAMPER: Repurpose the method for a different problem or domain',
  {
    idea: z.string().describe('JSON-serialized Idea object'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await scamperPutOtherUse(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'scamper_eliminate',
  'SCAMPER: Remove a component while preserving core value',
  {
    idea: z.string().describe('JSON-serialized Idea object'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await scamperEliminate(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'scamper_reverse',
  'SCAMPER: Invert an assumption, order, or direction to generate idea variants',
  {
    idea: z.string().describe('JSON-serialized Idea object'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await scamperReverse(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'surgery_subtract',
  'Surgery: Remove a component and analyze what remains',
  {
    idea: z.string().describe('JSON-serialized Idea object'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await surgerySubtract(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'surgery_multiply',
  'Surgery: Duplicate a component into multiple variants and analyze what diversity enables',
  {
    idea: z.string().describe('JSON-serialized Idea object'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await surgeryMultiply(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'surgery_divide',
  'Surgery: Split a component into sub-problems and analyze if parts work better independently',
  {
    idea: z.string().describe('JSON-serialized Idea object'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await surgeryDivide(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'surgery_unify',
  'Surgery: Merge separate components into one and analyze what simplicity or emergence results',
  {
    idea: z.string().describe('JSON-serialized Idea object'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await surgeryUnify(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool(
  'surgery_redirect',
  'Surgery: Repurpose a component to serve a different goal and analyze what new capability emerges',
  {
    idea: z.string().describe('JSON-serialized Idea object'),
    context: z.string().describe('Research context and accumulated knowledge'),
  },
  async (params) => {
    const result = await surgeryRedirect(params);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
);

server.tool('triz_contradiction', 'TRIZ: Resolve conflicting metrics using inventive principles', {
  idea: z.string().describe('JSON-serialized Idea object'),
  metricX: z.string().describe('Metric to improve'),
  metricY: z.string().describe('Metric that suffers when metricX improves'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await trizContradiction(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('morphological_matrix', 'Morphological: Decompose problem into dimensions and enumerate novel combinations', {
  dimensions: z.string().describe('JSON array of { dimension: string, options: string[] }'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await morphologicalMatrix(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('facet_bisociation', 'Cross-Domain: Koestler bisociation between facets from different papers', {
  facetA: z.string().describe('Facet JSON from paper A'),
  facetB: z.string().describe('Facet JSON from paper B (different domain)'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await facetBisociation(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('analogical_transfer', 'Cross-Domain: Synectics — transfer principle from source to target', {
  sourceDomain: z.string().describe('Source domain description'),
  targetProblem: z.string().describe('Target problem to solve'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await analogicalTransfer(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('random_paper_entry', 'Cross-Domain: Random entry point stimulation from a distant paper', {
  randomPaperFacet: z.string().describe('Random paper facet JSON'),
  targetProblem: z.string().describe('Target problem'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await randomPaperEntry(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('forced_bridge', 'Cross-Domain: Force connections between two unrelated techniques', {
  techniqueA: z.string().describe('First technique description'),
  techniqueB: z.string().describe('Second technique description'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await forcedBridge(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('axiom_negation', 'Assumption: de Bono PO provocation — negate a fundamental assumption', {
  assumption: z.string().describe('The assumption to negate'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await axiomNegation(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('reverse_engineering', 'Assumption: Reverse brainstorm — how to make the problem WORSE', {
  problem: z.string().describe('The problem to reverse'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await reverseEngineering(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('worst_method_analysis', 'Assumption: Design the worst method, then extract insights from inverting it', {
  problem: z.string().describe('The problem to analyze'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await worstMethodAnalysis(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('anti_benchmark', 'Assumption: Challenge a benchmark\'s fundamental assumptions', {
  benchmark: z.string().describe('Benchmark name and description'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await antiBenchmark(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('reviewer2_hat', 'Perspective: Hostile reviewer finds fatal flaws', {
  idea: z.string(), context: z.string(),
}, async (params) => {
  const result = await reviewer2Hat(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('practitioner_hat', 'Perspective: Industry engineer evaluates practicality', {
  idea: z.string(), context: z.string(),
}, async (params) => {
  const result = await practitionerHat(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('theorist_hat', 'Perspective: Formal theorist evaluates foundations', {
  idea: z.string(), context: z.string(),
}, async (params) => {
  const result = await theoristHat(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('constraint_injection', 'Perspective: Add random constraint and find workarounds', {
  idea: z.string(), constraint: z.string(), context: z.string(),
}, async (params) => {
  const result = await constraintInjection(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('time_machine', 'Perspective: Project idea to future or past', {
  idea: z.string(), direction: z.enum(['future', 'past']), years: z.number(), context: z.string(),
}, async (params) => {
  const result = await timeMachine(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('benchmark_sweep', 'Enumerate: Systematic benchmark analysis with cross-benchmark ideas', {
  benchmarks: z.string().describe('JSON array of benchmark names'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await benchmarkSweep(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('method_problem_matrix', 'Enumerate: Method × Problem matrix to find unexplored combinations', {
  methods: z.string().describe('JSON array of method names'),
  problems: z.string().describe('JSON array of problem names'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await methodProblemMatrix(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('ablation_brainstorm', 'Enumerate: Ablation analysis — what if we remove/replace SOTA components?', {
  sotaComponents: z.string().describe('JSON array of SOTA method components'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await ablationBrainstorm(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

server.tool('failure_taxonomy', 'Enumerate: Categorize failure cases and generate targeted fixes', {
  failureCases: z.string().describe('JSON array of known failure cases'),
  context: z.string().describe('Research context'),
}, async (params) => {
  const result = await failureTaxonomy(params);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

// Method-Evolve tools (P3)
server.tool(
  'method_evolve_mutate',
  'Mutate a research method to produce an improved variant. Identifies weakest aspect and applies meaningful mutation.',
  {
    method: z.string().describe('Full method protocol (markdown)'),
    trackRecord: z.string().describe('Method usage history and performance data'),
    context: z.string().describe('Current research domain and constraints'),
  },
  async (params) => {
    const result = await methodEvolveMutate(params);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  'method_evolve_crossover',
  'Combine two research methods into a coherent hybrid. Preserves strengths of both parents.',
  {
    methodA: z.string().describe('First parent method protocol (markdown)'),
    methodB: z.string().describe('Second parent method protocol (markdown)'),
    trackRecords: z.string().describe('Track records for both methods'),
    context: z.string().describe('Current research domain and constraints'),
  },
  async (params) => {
    const result = await methodEvolveCrossover(params);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  'method_evolve_evaluate',
  'Head-to-head comparison of two methods. Evaluates criterion-by-criterion, determines winner, suggests Elo update.',
  {
    methodA: z.string().describe('First method protocol'),
    outputA: z.string().describe('Output produced by method A on test problem'),
    methodB: z.string().describe('Second method protocol'),
    outputB: z.string().describe('Output produced by method B on test problem'),
    criteria: z.string().describe('Evaluation criteria (e.g. novelty, feasibility, diversity)'),
  },
  async (params) => {
    const result = await methodEvolveEvaluate(params);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
