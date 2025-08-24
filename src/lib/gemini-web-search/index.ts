import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { ToolModule } from '../../types/index.js';
import { geminiWebSearchHandlers } from './handlers.js';
import { geminiWebSearchTools } from './tools.js';

const execAsync = promisify(exec);

/**
 * Check if Gemini CLI is available
 */
async function checkGeminiAvailability(): Promise<boolean> {
  try {
    await execAsync('which gemini', { timeout: 5000 });
    return true;
  } catch {
    try {
      // Alternative check for Windows
      await execAsync('where gemini', { timeout: 5000 });
      return true;
    } catch {
      console.error(
        'Gemini CLI not found. Please install and configure the Gemini CLI tool.',
      );
      return false;
    }
  }
}

/**
 * Gemini Web Search Module definition for performing web searches using Gemini AI.
 */
export const geminiWebSearchModule: ToolModule = {
  name: 'gemini-web-search',
  tools: geminiWebSearchTools,
  handlers: geminiWebSearchHandlers,
  initialize: async () => {
    const isAvailable = await checkGeminiAvailability();
    if (!isAvailable) {
      console.log(
        'Gemini Web Search module disabled: Gemini CLI not available',
      );
    }
    return isAvailable;
  },
};
