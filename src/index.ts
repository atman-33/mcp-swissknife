import { Command } from 'commander';
import { datetimeModule } from './lib/datetime/index.js';
import { geminiWebSearchModule } from './lib/gemini-web-search/index.js';
import { obsidianModule } from './lib/obsidian/index.js';
import { softwareDocgenModule } from './lib/software-docgen/index.js';
import { webFetchModule } from './lib/web-fetch/index.js';
import type { ServerConfig } from './types/index.js';
import { createServer, startServer } from './utils/index.js';

/**
 * Initialize all modules with configuration
 */
async function initializeModules(config: {
  vaultPath?: string;
  modules: import('./types/index.js').ToolModule[];
}): Promise<import('./types/index.js').ToolModule[]> {
  const initializedModules: import('./types/index.js').ToolModule[] = [];
  for (const module of config.modules) {
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
async function runServer(config: {
  vaultPath?: string;
  disabledModules?: string[];
}): Promise<void> {
  try {
    // Filter out disabled modules
    const enabledModules = serverConfig.modules.filter(
      (module) => !config.disabledModules?.includes(module.name),
    );

    // Initialize enabled modules
    const loadedModules = await initializeModules({
      ...config,
      modules: enabledModules,
    });

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
  .option(
    '--disable <modules>',
    'Comma-separated list of modules to disable (e.g., obsidian,web-fetch)',
  )
  .action(async (options) => {
    const disabledModules = options.disable
      ? options.disable.split(',').map((m: string) => m.trim())
      : [];

    await runServer({
      vaultPath: options.vaultPath,
      disabledModules,
    });
  });

// Server configuration
const serverConfig: ServerConfig = {
  name: 'mcp-swissknife',
  version: '1.0.0',
  modules: [
    datetimeModule,
    geminiWebSearchModule,
    obsidianModule,
    softwareDocgenModule,
    webFetchModule,
  ],
};

// Parse command line arguments and start server
program.parse();
