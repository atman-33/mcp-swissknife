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

export const WriteNoteArgsSchema = z.object({
  path: z.string(),
  content: z.string(),
});

// Tool definitions
export const obsidianTools: ToolDefinition[] = [
  {
    name: 'read_notes',
    description: `
Reads the contents of multiple notes from your Obsidian vault.
Each note's content is returned with its path as a reference.
The "paths" argument must be an array of strings, representing the relative paths of notes in the vault.
Failed reads for individual notes won't stop the entire operation.
Reading too many notes at once may result in an error.
Example: { "paths": ["Daily/2025-08-23.md", "Projects/Idea.md"] }
`,
    inputSchema: zodToJsonSchema(ReadNotesArgsSchema) as ToolInput,
  },
  {
    name: 'search_notes',
    description: `
Searches for notes in your Obsidian vault by name.
The search is case-insensitive and supports partial matches or valid regular expressions.
Returns an array of note paths that match the query.
Example: { "query": "meeting" }
`,
    inputSchema: zodToJsonSchema(SearchNotesArgsSchema) as ToolInput,
  },
  {
    name: 'write_note',
    description: `
Writes content to an Obsidian note. If the note at the specified path does not exist, it will be created. If it exists, its content will be overwritten.
The "path" argument must be a string representing the relative path of the note in the vault (e.g., "Daily/2025-08-23.md").
The "content" argument must be a string containing the full content to write to the note.
Example: { "path": "Daily/2025-08-23.md", "content": "# Daily Log\\n- Meeting with team\\n- Work on project X" }
`,
    inputSchema: zodToJsonSchema(WriteNoteArgsSchema) as ToolInput,
  },
];
