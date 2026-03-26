import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "dare-session",
  version: "2.0.0",
});

const transport = new StdioServerTransport();
await server.connect(transport);
