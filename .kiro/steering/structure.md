---
inclusion: always
---

# Project Structure & Architecture

## Directory Organization

```
src/
├── index.ts              # Main entry point with CLI setup and server config
├── lib/                  # Feature modules (each implements ToolModule interface)
│   ├── datetime/         # Date/time utilities
│   ├── obsidian/         # Obsidian vault integration
│   ├── software-docgen/  # Documentation generation
│   └── web-fetch/        # Web content fetching and processing
├── types/                # Shared TypeScript definitions
│   ├── server.ts         # ServerConfig, ToolModule interfaces
│   └── tool.ts           # Tool-related types
└── utils/                # Shared utilities and helpers
    ├── path.ts           # Path manipulation
    ├── server.ts         # MCP server creation logic
    └── validation.ts     # Common validation functions
```

## Module Architecture (Required Pattern)

Every module in `src/lib/` MUST follow this exact structure:

```typescript
// src/lib/[module-name]/index.ts - Module definition
export const moduleConfig: ToolModule = {
  name: 'module-name',
  description: 'Brief description',
  tools: toolDefinitions,
  handlers: toolHandlers,
  initialize?: async (options) => { /* optional setup */ }
};

// src/lib/[module-name]/tools.ts - Tool schemas with Zod
export const toolDefinitions: Tool[] = [
  {
    name: 'tool_name',
    description: 'What this tool does',
    inputSchema: zodToJsonSchema(InputSchema)
  }
];

// src/lib/[module-name]/handlers.ts - Implementation
export const toolHandlers: Record<string, ToolHandler> = {
  tool_name: async (args) => {
    // Implementation with proper error handling
    return { content: [{ type: 'text', text: result }] };
  }
};
```

## Critical Implementation Rules

- **Module Registration**: Add new modules to `serverConfig.modules` array in `src/index.ts`
- **Import Extensions**: Always use `.js` extensions in imports (ES modules requirement)
- **Type Imports**: Use `import type` for type-only imports to avoid runtime dependencies
- **Error Handling**: Return structured MCP responses, use `console.error()` for logging
- **Async Patterns**: Use async/await consistently, implement `initialize()` for setup
- **Schema Validation**: All tool inputs must use Zod schemas converted with `zodToJsonSchema`

## File Naming & Organization

- **Module Names**: Use kebab-case for directories (`web-fetch`, not `webFetch`)
- **File Names**: Use kebab-case for multi-word files (`tool-handlers.ts`)
- **Barrel Exports**: Each directory exports everything through `index.ts`
- **Type Definitions**: Keep interfaces in `src/types/`, import as needed

## Adding New Modules (Step-by-Step)

1. **Create Module Directory**: `src/lib/[module-name]/`
2. **Implement Required Files**: `index.ts`, `tools.ts`, `handlers.ts`
3. **Follow Module Pattern**: Use exact structure shown above
4. **Register Module**: Add to `serverConfig.modules` in `src/index.ts`
5. **Add CLI Options**: If needed, extend Commander.js configuration
6. **Test Integration**: Ensure module loads and tools are discoverable

## Code Organization Principles

- **Single Responsibility**: Each module handles one domain of functionality
- **Dependency Injection**: Pass configuration through `initialize()` method
- **Graceful Degradation**: Modules should handle missing dependencies elegantly
- **Consistent Interfaces**: All modules implement the same `ToolModule` contract