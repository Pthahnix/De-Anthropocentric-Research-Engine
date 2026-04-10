// packages/agents/src/server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { facetExtract } from './tools/facet-extract.js';

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

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
