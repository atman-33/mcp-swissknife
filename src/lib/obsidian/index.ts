import type { ModuleConfig, ToolModule } from '../../types/index.js';
import { validateDirectories } from '../../utils/index.js';
import { obsidianHandlers, setVaultDirectories } from './handlers.js';
import { obsidianTools } from './tools.js';
import { setupVaultDirectories } from './validation.js';

/**
 * Initialize Obsidian module with vault directories
 */
async function initializeObsidian(config?: ModuleConfig): Promise<boolean> {
  const rawArgs = config?.args;
  const args: string[] =
    Array.isArray(rawArgs) && rawArgs.every((item) => typeof item === 'string')
      ? rawArgs
      : [];

  if (args.length === 0) {
    // This is not a fatal error, just a note that the module is not active
    // console.error('Obsidian module initialized without vault path');
    // console.error(
    //   'Note: Obsidian tools will not be available without --vault-path option',
    // );
    setVaultDirectories([]);
    return false;
  }

  const vaultDirectories = setupVaultDirectories(args);

  try {
    // Validate directories
    await validateDirectories(args);
  } catch (error) {
    console.error(`Error validating vault path: ${error}`);
    return false;
  }

  // Set vault directories for handlers
  setVaultDirectories(vaultDirectories);
  return true;
}

/**
 * Obsidian module definition
 */
export const obsidianModule: ToolModule = {
  name: 'obsidian',
  tools: obsidianTools,
  handlers: obsidianHandlers,
  initialize: initializeObsidian,
};
