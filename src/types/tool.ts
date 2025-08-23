import type { ToolSchema } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

// Tool-related type definitions
export type ToolInput = z.infer<typeof ToolSchema.shape.inputSchema>;

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInput;
}

export type ToolHandler = (args: any) => Promise<{
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}>;

export type ToolHandlerMap = Map<string, ToolHandler>;
