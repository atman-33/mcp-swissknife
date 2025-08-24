import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { z } from 'zod';
import type { ToolHandler, ToolHandlerMap } from '../../types/index.js';
import { GeminiWebSearchArgsSchema } from './tools.js';

const execAsync = promisify(exec);
const TIMEOUT = 30000; // 30 seconds

/**
 * Handler for Gemini web search
 */
async function handleGeminiWebSearch(
  args: z.infer<typeof GeminiWebSearchArgsSchema>,
): Promise<{ content: { type: 'text'; text: string }[] }> {
  try {
    // First attempt with default model
    const result = await executeGeminiSearch(args.query);
    return {
      content: [{ type: 'text', text: result }],
    };
  } catch (error) {
    console.error('Gemini web search failed:', error);

    // Check if it's a quota/rate limit error
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (isQuotaError(errorMessage)) {
      try {
        // Fallback to gemini-2.5-flash model
        console.log('Falling back to gemini-2.5-flash model...');
        const result = await executeGeminiSearch(
          args.query,
          'gemini-2.5-flash',
        );
        return {
          content: [{ type: 'text', text: result }],
        };
      } catch (fallbackError) {
        console.error('Fallback to flash model also failed:', fallbackError);
        const fallbackErrorMessage =
          fallbackError instanceof Error
            ? fallbackError.message
            : String(fallbackError);

        if (isQuotaError(fallbackErrorMessage)) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: Gemini API quota exceeded for both Pro and Flash models. Please try again later or check your quota limits.',
              },
            ],
          };
        }

        throw fallbackError;
      }
    }

    throw error;
  }
}

/**
 * Execute Gemini search command
 */
async function executeGeminiSearch(
  query: string,
  model?: string,
): Promise<string> {
  const command = model
    ? `gemini --model ${model} --prompt 'WebSearch: ${query.replace(/'/g, "\\'")}'`
    : `gemini --prompt 'WebSearch: ${query.replace(/'/g, "\\'")}'`;

  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout: TIMEOUT,
      encoding: 'utf8',
    });

    if (stderr?.trim()) {
      console.error('Gemini stderr:', stderr);

      // Check if stderr contains quota error
      if (isQuotaError(stderr)) {
        throw new Error(stderr);
      }
    }

    if (!stdout || stdout.trim() === '') {
      throw new Error('Gemini returned empty response');
    }

    return stdout.trim();
  } catch (error) {
    if (error instanceof Error) {
      // Handle timeout
      if (error.message.includes('timeout')) {
        throw new Error('Gemini search timed out after 30 seconds');
      }

      // Handle command not found
      if (
        error.message.includes('command not found') ||
        error.message.includes('ENOENT')
      ) {
        throw new Error(
          'Gemini CLI not found. Please install and configure the Gemini CLI tool.',
        );
      }
    }

    throw error;
  }
}

/**
 * Check if error message indicates quota/rate limit exceeded
 */
function isQuotaError(errorMessage: string): boolean {
  const quotaKeywords = [
    'quota exceeded',
    'rate limit',
    'RESOURCE_EXHAUSTED',
    'rateLimitExceeded',
    'Quota exceeded for quota metric',
  ];

  const lowerMessage = errorMessage.toLowerCase();
  return quotaKeywords.some((keyword) =>
    lowerMessage.includes(keyword.toLowerCase()),
  );
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
export const geminiWebSearchHandlers: ToolHandlerMap = new Map([
  [
    'gemini_web_search',
    createHandler(GeminiWebSearchArgsSchema, handleGeminiWebSearch),
  ],
]);
