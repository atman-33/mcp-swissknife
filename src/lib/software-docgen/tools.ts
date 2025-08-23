import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ToolDefinition, ToolInput } from '../../types/index.js';

// Schema definitions
export const GetSoftwareDocumentationPromptArgsSchema = z.object({});

// Tool definitions
export const softwareDocgenTools: ToolDefinition[] = [
  {
    name: 'get_software_documentation_prompt',
    description:
      'Get a prompt for creating software project design documents. Returns instructions for generating product.md, structure.md, and tech.md files.',
    inputSchema: zodToJsonSchema(
      GetSoftwareDocumentationPromptArgsSchema,
    ) as ToolInput,
  },
];
