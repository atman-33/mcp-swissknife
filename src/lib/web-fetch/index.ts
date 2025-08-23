import type { ToolModule } from '../../types/index.js';
import { webFetchHandlers } from './handlers.js';
import { webFetchTools } from './tools.js';

/**
 * Web Fetch Module definition for retrieving content from URLs.
 */
export const webFetchModule: ToolModule = {
  name: 'web-fetch',
  tools: webFetchTools,
  handlers: webFetchHandlers,
  initialize: async () => true,
};
