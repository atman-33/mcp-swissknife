import { Command } from 'commander';
import { datetimeModule } from './lib/datetime/index.js';
import { obsidianModule } from './lib/obsidian/index.js';
import type { ServerConfig } from './types/index.js';
import { createServer, startServer } from './utils/index.js';

/**
 * Initialize all modules with configuration
 */
async function initializeModules(config: {
  vaultPath?: string;
}): Promise<import('./types/index.js').ToolModule[]> {
  const initializedModules: import('./types/index.js').ToolModule[] = [];
  for (const module of serverConfig.modules) {
    if (module.initialize) {
      const success = await module.initialize({
        args: config.vaultPath ? [config.vaultPath] : [],
      });
      if (success) {
        initializedModules.push(module);
      }
    } else {
      // If a module doesn't have an initialize function, assume it's always active
      initializedModules.push(module);
    }
  }
  return initializedModules;
}

/**
 * Main server startup function
 */
async function runServer(config: { vaultPath?: string }): Promise<void> {
  try {
    // Initialize all modules
    const loadedModules = await initializeModules(config);

    if (loadedModules.length > 0) {
      console.log(
        'Loaded modules:',
        loadedModules.map((m) => m.name).join(', '),
      );
    } else {
      console.log('No modules loaded.');
      // Optionally, exit if no modules are loaded
      // process.exit(0);
    }

    // Create and start server
    const server = createServer({ ...serverConfig, modules: loadedModules });
    await startServer(server);
  } catch (error) {
    console.error('Fatal error running server:', error);
    process.exit(1);
  }
}

// Setup CLI with commander
const program = new Command();

program
  .name('mcp-swissknife')
  .description('MCP Swiss Knife - Multi-purpose MCP server')
  .version('1.0.0')
  .option('--vault-path <path>', 'Path to Obsidian vault directory (optional)')
  .action(async (options) => {
    await runServer({ vaultPath: options.vaultPath });
  });

// Server configuration
const serverConfig: ServerConfig = {
  name: 'mcp-swissknife',
  version: '1.0.0',
  modules: [datetimeModule, obsidianModule],
};

// Parse command line arguments and start server
program.parse();
