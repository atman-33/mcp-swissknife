import type { z } from 'zod';
import type { ToolHandler, ToolHandlerMap } from '../../types/index.js';
import { GetCurrentDatetimeArgsSchema } from './tools.js';

/**
 * Handler for getting the current date and time
 */
async function handleGetCurrentDatetime(
  _args: z.infer<typeof GetCurrentDatetimeArgsSchema>,
): Promise<{ content: { type: 'text'; text: string }[] }> {
  const now = new Date();
  return {
    content: [{ type: 'text' as const, text: now.toISOString() }],
  };
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
export const datetimeHandlers: ToolHandlerMap = new Map([
  [
    'get_current_datetime',
    createHandler(GetCurrentDatetimeArgsSchema, handleGetCurrentDatetime),
  ],
]);
