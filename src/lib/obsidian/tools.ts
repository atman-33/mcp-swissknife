import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ToolDefinition, ToolInput } from '../../types/index.js';

// Schema definitions
export const ReadNotesArgsSchema = z.object({
  paths: z.array(z.string()),
});

export const SearchNotesArgsSchema = z.object({
  query: z.string(),
});

// Tool definitions
export const obsidianTools: ToolDefinition[] = [
  {
    name: 'read_notes',
    description:
      "Read the contents of multiple notes. Each note's content is returned with its " +
      "path as a reference. Failed reads for individual notes won't stop " +
      'the entire operation. Reading too many at once may result in an error.',
    inputSchema: zodToJsonSchema(ReadNotesArgsSchema) as ToolInput,
  },
  {
    name: 'search_notes',
    description:
      'Searches for a note by its name. The search ' +
      'is case-insensitive and matches partial names. ' +
      'Queries can also be a valid regex. Returns paths of the notes ' +
      'that match the query.',
    inputSchema: zodToJsonSchema(SearchNotesArgsSchema) as ToolInput,
  },
];
