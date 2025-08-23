import * as fsSync from 'node:fs';
import { expandHome, normalizePath } from '../../utils/index.js';

/**
 * Setup and validate vault directories from command line arguments
 */
export function setupVaultDirectories(args: string[]): string[] {
  if (args.length === 0) {
    console.error('Usage: mcp-obsidian <vault-directory>');
    process.exit(1);
  }

  // Normalize all paths consistently
  const initialDir = normalizePath(expandHome(args[0]));
  const canonicalDir = normalizePath(fsSync.realpathSync(initialDir));

  const vaultDirectories =
    initialDir === canonicalDir
      ? [initialDir] // no symlink → single entry
      : [initialDir, canonicalDir];

  return vaultDirectories;
}
