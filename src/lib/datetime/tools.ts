import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ToolDefinition, ToolInput } from '../../types/index.js';

// Schema definitions
export const GetCurrentDatetimeArgsSchema = z.object({});

// Tool definitions
export const datetimeTools: ToolDefinition[] = [
  {
    name: 'get_current_datetime',
    description: 'Get the current date and time in ISO 8601 format.',
    inputSchema: zodToJsonSchema(GetCurrentDatetimeArgsSchema) as ToolInput,
  },
];
