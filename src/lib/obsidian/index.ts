import type { ModuleConfig, ToolModule } from '../../types/index.js';
import { validateDirectories } from '../../utils/index.js';
import { obsidianHandlers, setVaultDirectories } from './handlers.js';
import { obsidianTools } from './tools.js';
import { setupVaultDirectories } from './validation.js';

/**
 * Initialize Obsidian module with vault directories
 */
async function initializeObsidian(config?: ModuleConfig): Promise<void> {
  const rawArgs = config?.args;
  const args: string[] =
    Array.isArray(rawArgs) && rawArgs.every((item) => typeof item === 'string')
      ? rawArgs
      : [];

  if (args.length === 0) {
    console.error('Obsidian module initialized without vault path');
    console.error(
      'Note: Obsidian tools will not be available without --vault-path option',
    );
    setVaultDirectories([]);
    return;
  }

  const vaultDirectories = setupVaultDirectories(args);

  // Validate directories
  await validateDirectories(args);

  // Set vault directories for handlers
  setVaultDirectories(vaultDirectories);

  console.error('Obsidian module initialized');
  console.error('Allowed directories:', vaultDirectories);
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
