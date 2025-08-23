import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { ServerConfig } from '../types/index.js';

/**
 * Create and configure MCP server with modules
 */
export function createServer(config: ServerConfig): Server {
  const server = new Server(
    {
      name: config.name,
      version: config.version,
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Register list tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = config.modules.flatMap((module) => module.tools);
    return { tools };
  });

  // Register call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const { name, arguments: args } = request.params;

      // Find the module that handles this tool
      const module = config.modules.find((m) => m.handlers.has(name));
      if (!module) {
        throw new Error(`Unknown tool: ${name}`);
      }

      const handler = module.handlers.get(name);
      if (!handler) {
        throw new Error(`No handler found for tool: ${name}`);
      }

      return await handler(args);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text', text: `Error: ${errorMessage}` }],
        isError: true,
      };
    }
  });

  return server;
}

/**
 * Start the MCP server
 */
export async function startServer(server: Server): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server running on stdio');
}
