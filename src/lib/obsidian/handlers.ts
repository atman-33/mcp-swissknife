import fs from 'node:fs/promises';
import path from 'node:path';
import type { ToolHandlerMap } from '../../types/index.js';
import { validatePath } from '../../utils/index.js';
import { ReadNotesArgsSchema, SearchNotesArgsSchema } from './tools.js';

// Maximum number of search results to return
const SEARCH_LIMIT = 200;

// Global vault directories - will be set during initialization
let vaultDirectories: string[] = [];

/**
 * Set vault directories for handlers
 */
export function setVaultDirectories(directories: string[]): void {
  vaultDirectories = directories;
}

/**
 * Search for notes in the allowed directories that match the query
 */
async function searchNotes(query: string): Promise<string[]> {
  const results: string[] = [];

  async function search(basePath: string, currentPath: string) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      try {
        // Validate each path before processing
        await validatePath(fullPath, vaultDirectories);

        let matches = entry.name.toLowerCase().includes(query.toLowerCase());
        try {
          matches =
            matches ||
            new RegExp(query.replace(/[*]/g, '.*'), 'i').test(entry.name);
        } catch {
          // Ignore invalid regex
        }

        if (entry.name.endsWith('.md') && matches) {
          // Turn into relative path
          results.push(fullPath.replace(basePath, ''));
        }

        if (entry.isDirectory()) {
          await search(basePath, fullPath);
        }
      } catch {
        // Skip files that can't be accessed
      }
    }
  }

  await Promise.all(vaultDirectories.map((dir) => search(dir, dir)));
  return results;
}

/**
 * Handler for reading multiple notes
 */
async function handleReadNotes(args: any) {
  const parsed = ReadNotesArgsSchema.safeParse(args);
  if (!parsed.success) {
    throw new Error(`Invalid arguments for read_notes: ${parsed.error}`);
  }

  const results = await Promise.all(
    parsed.data.paths.map(async (filePath: string) => {
      try {
        const validPath = await validatePath(
          path.join(vaultDirectories[0], filePath),
          vaultDirectories,
        );
        const content = await fs.readFile(validPath, 'utf-8');
        return `${filePath}:\n${content}\n`;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return `${filePath}: Error - ${errorMessage}`;
      }
    }),
  );

  return {
    content: [{ type: 'text' as const, text: results.join('\n---\n') }],
  };
}

/**
 * Handler for searching notes
 */
async function handleSearchNotes(args: any) {
  const parsed = SearchNotesArgsSchema.safeParse(args);
  if (!parsed.success) {
    throw new Error(`Invalid arguments for search_notes: ${parsed.error}`);
  }

  const results = await searchNotes(parsed.data.query);
  const limitedResults = results.slice(0, SEARCH_LIMIT);

  return {
    content: [
      {
        type: 'text' as const,
        text:
          (limitedResults.length > 0
            ? limitedResults.join('\n')
            : 'No matches found') +
          (results.length > SEARCH_LIMIT
            ? `\n\n... ${results.length - SEARCH_LIMIT} more results not shown.`
            : ''),
      },
    ],
  };
}

// Export handlers map
export const obsidianHandlers: ToolHandlerMap = new Map([
  ['read_notes', handleReadNotes],
  ['search_notes', handleSearchNotes],
]);
