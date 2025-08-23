import type { ModuleConfig, ToolModule } from '../../types/index.js';
import { validateDirectories } from '../../utils/index.js';
import { obsidianHandlers, setVaultDirectories } from './handlers.js';
import { obsidianTools } from './tools.js';
import { setupVaultDirectories } from './validation.js';

/**
 * Initialize Obsidian module with vault directories
 */
async function initializeObsidian(config?: ModuleConfig): Promise<void> {
  const args = config?.args || process.argv.slice(2);
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
