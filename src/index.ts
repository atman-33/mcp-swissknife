import { Command } from 'commander';
import { obsidianModule } from './lib/obsidian/index.js';
import type { ServerConfig } from './types/index.js';
import { createServer, startServer } from './utils/index.js';

/**
 * Initialize all modules with configuration
 */
async function initializeModules(config: {
  vaultPath?: string;
}): Promise<void> {
  for (const module of serverConfig.modules) {
    if (module.initialize) {
      await module.initialize({
        args: config.vaultPath ? [config.vaultPath] : [],
      });
    }
  }
}

/**
 * Main server startup function
 */
async function runServer(config: { vaultPath?: string }): Promise<void> {
  try {
    // Initialize all modules
    await initializeModules(config);

    // Create and start server
    const server = createServer(serverConfig);
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
  modules: [obsidianModule],
};

// Parse command line arguments and start server
program.parse();
