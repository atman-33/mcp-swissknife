import type { ToolModule } from '../../types/index.js';
import { softwareDocgenHandlers } from './handlers.js';
import { softwareDocgenTools } from './tools.js';

/**
 * Software documentation generation module definition
 */
export const softwareDocgenModule: ToolModule = {
  name: 'software-docgen',
  tools: softwareDocgenTools,
  handlers: softwareDocgenHandlers,
  initialize: async () => true,
};
