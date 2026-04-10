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

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
