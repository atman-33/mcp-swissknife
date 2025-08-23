import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ToolDefinition, ToolInput } from '../../types/index.js';

// Schema definitions
export const WebFetchArgsSchema = z.object({
  url: z.string().url('Invalid URL format.'),
});

// Tool definitions
export const webFetchTools: ToolDefinition[] = [
  {
    name: 'web_fetch',
    description:
      'Fetches content from a specified URL and processes into markdown',
    inputSchema: zodToJsonSchema(WebFetchArgsSchema) as ToolInput,
  },
];
