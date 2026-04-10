// packages/agents/src/server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { facetExtract } from './tools/facet-extract.js';
import { digestExtract } from './tools/digest-extract.js';

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

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
