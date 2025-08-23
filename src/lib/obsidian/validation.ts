import * as fsSync from 'node:fs';
import { expandHome, normalizePath } from '../../utils/index.js';

/**
 * Setup and validate vault directories from command line arguments
 */
export function setupVaultDirectories(args: string[]): string[] {
  if (args.length === 0) {
    return [];
  }

  // Normalize all paths consistently
  const initialDir = normalizePath(expandHome(args[0]));

  try {
    const canonicalDir = normalizePath(fsSync.realpathSync(initialDir));

    const vaultDirectories =
      initialDir === canonicalDir
        ? [initialDir] // no symlink → single entry
        : [initialDir, canonicalDir];

    return vaultDirectories;
  } catch (_error) {
    console.error(
      `Error: Vault directory "${initialDir}" does not exist or is not accessible.`,
    );
    process.exit(1);
  }
}
