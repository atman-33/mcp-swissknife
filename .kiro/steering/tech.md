---
inclusion: always
---

# MCP Swiss Knife Development Guide

MCP Swiss Knife is a modular Model Context Protocol server providing utility tools for AI assistants. This guide covers essential patterns and conventions for development.

## Architecture & Module System

### Required Module Structure
Every module in `src/lib/` MUST follow this exact pattern:

```typescript
// src/lib/[module-name]/index.ts
export const moduleConfig: ToolModule = {
  name: 'module-name',
  description: 'Brief description',
  tools: toolDefinitions,
  handlers: toolHandlers,
  initialize?: async (options) => { /* optional setup */ }
};

// src/lib/[module-name]/tools.ts
export const toolDefinitions: Tool[] = [
  {
    name: 'tool_name',
    description: 'What this tool does',
    inputSchema: zodToJsonSchema(InputSchema)
  }
];

// src/lib/[module-name]/handlers.ts
export const toolHandlers: Record<string, ToolHandler> = {
  tool_name: async (args) => {
    return { content: [{ type: 'text', text: result }] };
  }
};
```

### Adding New Modules
1. Create directory: `src/lib/[module-name]/`
2. Implement required files: `index.ts`, `tools.ts`, `handlers.ts`
3. Register in `serverConfig.modules` array in `src/index.ts`
4. Add CLI options if needed via Commander.js

## Critical Code Rules

### Import & Module Requirements
- **Import Extensions**: Always use `.js` extensions in imports (ES modules)
- **Type Imports**: Use `import type` for type-only imports
- **Barrel Exports**: Export everything through `index.ts` files

### Naming Conventions
- **Directories**: kebab-case (`web-fetch`, not `webFetch`)
- **Files**: kebab-case for multi-word files
- **Tools**: snake_case for MCP tool names (`get_current_datetime`)

### Error Handling & Responses
- Return structured MCP responses: `{ content: [{ type: 'text', text: result }] }`
- Use `console.error()` for logging errors
- Handle missing dependencies gracefully in `initialize()` methods

### Schema Validation
- All tool inputs MUST use Zod schemas
- Convert schemas with `zodToJsonSchema()` for MCP compatibility
- Define input schemas in `tools.ts` files

## Technology Stack

### Build & Runtime
- **Build**: Vite with TypeScript (strict mode)
- **Runtime**: Node.js ES modules (`"type": "module"`)
- **Target**: ES2022 with NodeNext resolution
- **Formatting**: Biome (single quotes, semicolons required)

### Key Dependencies
- `@modelcontextprotocol/sdk`: Core MCP implementation
- `commander`: CLI argument parsing
- `zod-to-json-schema`: Schema validation
- `glob`: File pattern matching

## Development Commands

```bash
npm run dev              # Development with vite-node
npm run build           # Production build
npm run quality:fix     # Format, lint, and typecheck
npm run typecheck       # TypeScript validation only
```

## Current Modules
- **datetime**: Date/time utilities
- **obsidian**: Vault integration (requires `--vault-path`)
- **software-docgen**: Documentation generation
- **web-fetch**: Web content fetching and processing