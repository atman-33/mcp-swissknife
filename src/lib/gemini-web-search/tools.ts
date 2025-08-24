import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ToolDefinition, ToolInput } from '../../types/index.js';

// Schema definitions
export const GeminiWebSearchArgsSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty'),
});

// Tool definitions
export const geminiWebSearchTools: ToolDefinition[] = [
  {
    name: 'gemini_web_search',
    description:
      'Performs web search using Gemini AI with WebSearch capability. Returns comprehensive search results with AI-powered analysis and summarization.',
    inputSchema: zodToJsonSchema(GeminiWebSearchArgsSchema) as ToolInput,
  },
];
