// Server-related type definitions
export interface ModuleConfig {
  [key: string]: unknown;
}

export interface ToolModule {
  name: string;
  tools: import('./tool.js').ToolDefinition[];
  handlers: import('./tool.js').ToolHandlerMap;
  initialize?: (config?: ModuleConfig) => Promise<void>;
}

export interface ServerConfig {
  name: string;
  version: string;
  modules: ToolModule[];
}
