# Technology Stack

## Build System & Tools

- **Build Tool**: Vite for fast builds and development
- **TypeScript**: Full TypeScript with strict mode enabled
- **Package Manager**: npm with package-lock.json
- **Linting & Formatting**: Biome (replaces ESLint + Prettier)
- **Git Hooks**: Husky for pre-commit validation

## Runtime & Dependencies

- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Target**: ES2022 with NodeNext module resolution
- **Key Dependencies**:
  - `@modelcontextprotocol/sdk`: Core MCP protocol implementation
  - `commander`: CLI argument parsing
  - `glob`: File pattern matching
  - `zod-to-json-schema`: Schema validation and conversion

## Common Commands

```bash
# Development
npm run dev              # Start development server with vite-node
npm run build           # Production build with Vite
npm run build:tsc       # TypeScript compilation only
npm start               # Run built application

# Code Quality
npm run lint            # Check code with Biome
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Biome
npm run format:check    # Check formatting
npm run check           # Run all Biome checks and fix
npm run check:ci        # Run checks for CI (no fixes)
npm run typecheck       # TypeScript type checking
npm run quality         # Full quality check (typecheck + biome)
npm run quality:fix     # Full quality check with fixes
```

## Code Style

- **Quotes**: Single quotes preferred
- **Semicolons**: Always required
- **Indentation**: Spaces (configured in Biome)
- **Import Organization**: Automatic with Biome
- **File Extensions**: Use `.js` extensions in imports for ES modules