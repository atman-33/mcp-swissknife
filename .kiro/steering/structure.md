# Project Structure

## Directory Organization

```
src/
├── index.ts              # Main entry point with CLI setup
├── lib/                  # Feature modules
│   ├── datetime/         # Datetime utilities module
│   │   ├── index.ts      # Module definition and exports
│   │   ├── tools.ts      # Tool definitions and schemas
│   │   └── handlers.ts   # Tool implementation handlers
│   └── obsidian/         # Obsidian integration module
│       ├── index.ts      # Module definition with initialization
│       ├── tools.ts      # Tool definitions and schemas
│       ├── handlers.ts   # Tool implementation handlers
│       └── validation.ts # Module-specific validation logic
├── types/                # TypeScript type definitions
│   ├── index.ts          # Re-exports all types
│   ├── server.ts         # Server and module configuration types
│   └── tool.ts           # Tool-related type definitions
└── utils/                # Shared utilities
    ├── index.ts          # Re-exports all utilities
    ├── path.ts           # Path manipulation utilities
    ├── server.ts         # Server creation and startup logic
    └── validation.ts     # Common validation functions
```

## Module Architecture Pattern

Each feature module follows a consistent structure:

- **`index.ts`**: Module definition implementing `ToolModule` interface
- **`tools.ts`**: Tool definitions with schemas and descriptions
- **`handlers.ts`**: Implementation of tool handlers
- **`validation.ts`**: Module-specific validation (optional)

## Key Conventions

- **Barrel Exports**: Each directory has an `index.ts` that re-exports everything
- **File Extensions**: Always use `.js` extensions in import statements for ES modules
- **Type Imports**: Use `import type` for type-only imports
- **Module Registration**: All modules are registered in main `serverConfig` in `src/index.ts`
- **Initialization**: Modules can optionally implement async `initialize()` method
- **Error Handling**: Console.error for logging, structured error responses for tools

## Adding New Modules

1. Create new directory under `src/lib/`
2. Implement the standard module files (`index.ts`, `tools.ts`, `handlers.ts`)
3. Define module following `ToolModule` interface
4. Register module in main `serverConfig` array
5. Add any CLI options needed for module configuration