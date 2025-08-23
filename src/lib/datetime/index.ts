import type { ToolModule } from '../../types/index.js';
import { datetimeHandlers } from './handlers.js';
import { datetimeTools } from './tools.js';

/**
 * Datetime module definition
 */
export const datetimeModule: ToolModule = {
  name: 'datetime',
  tools: datetimeTools,
  handlers: datetimeHandlers,
};
