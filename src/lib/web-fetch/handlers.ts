import type { z } from 'zod';
import type { ToolHandler, ToolHandlerMap } from '../../types/index.js';
import { WebFetchArgsSchema } from './tools.js';

/**
 * Handler for web fetch tool
 */
async function handleWebFetch(
  args: z.infer<typeof WebFetchArgsSchema>,
): Promise<{ content: { type: 'text'; text: string }[] }> {
  try {
    const response = await fetch(args.url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    let content = await response.text();

    // If content is HTML, convert to Markdown
    if (contentType?.includes('text/html')) {
      const TurndownService = (await import('turndown')).default;
      const turndownService = new TurndownService();
      content = turndownService.turndown(content);
    }

    return {
      content: [{ type: 'text', text: content }],
    };
  } catch (error) {
    console.error(`Failed to fetch or process URL: ${args.url}`, error);
    throw new Error(
      `Failed to fetch or process URL: ${args.url}. Error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Create a wrapped handler that validates arguments against a Zod schema
 */
function createHandler<T extends z.ZodTypeAny>(
  schema: T,
  handler: (
    args: z.infer<T>,
  ) => Promise<{ content: { type: 'text'; text: string }[] }>,
): ToolHandler {
  return async (args: unknown) => {
    const parsed = schema.safeParse(args);
    if (!parsed.success) {
      throw new Error(`Invalid arguments: ${parsed.error}`);
    }
    return handler(parsed.data);
  };
}

// Export handlers map
export const webFetchHandlers: ToolHandlerMap = new Map([
  ['web_fetch', createHandler(WebFetchArgsSchema, handleWebFetch)],
]);
