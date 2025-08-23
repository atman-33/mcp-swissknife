import { obsidianModule } from './lib/obsidian/index.js';
import type { ServerConfig } from './types/index.js';
import { createServer, startServer } from './utils/index.js';

// Server configuration
const serverConfig: ServerConfig = {
  name: 'mcp-swissknife',
  version: '1.0.0',
  modules: [obsidianModule],
};

/**
 * Initialize all modules
 */
async function initializeModules(): Promise<void> {
  for (const module of serverConfig.modules) {
    if (module.initialize) {
      await module.initialize();
    }
  }
}

/**
 * Main server startup function
 */
async function runServer(): Promise<void> {
  try {
    // Initialize all modules
    await initializeModules();

    // Create and start server
    const server = createServer(serverConfig);
    await startServer(server);
  } catch (error) {
    console.error('Fatal error running server:', error);
    process.exit(1);
  }
}

// Start the server
runServer();
