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

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
