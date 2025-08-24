# MCP Swiss Knife

A multi-purpose Model Context Protocol server providing utility tools for AI assistants. Built with TypeScript and following MCP protocol standards.

## Features

MCP Swiss Knife provides a modular collection of tools organized into focused modules:

- **datetime**: Date and time utilities
- **gemini-web-search**: AI-powered web search using Gemini with WebSearch capability
- **obsidian**: Obsidian vault integration for note management
- **software-docgen**: Documentation generation helpers
- **web-fetch**: Web content fetching, extraction, and processing

## Installation

### Global Installation

```bash
npm install -g mcp-swissknife
```

### Using npx (No Installation Required)

You can run MCP Swiss Knife directly without installation using npx:

```bash
npx mcp-swissknife
```

This is the recommended approach for MCP configurations as it ensures you're always using the latest version.

### Optional Dependencies

#### Gemini CLI (for gemini-web-search module)

To use the Gemini web search functionality, you need to install and configure the Gemini CLI:

1. Install the Gemini CLI tool
2. Configure it with your API key
3. Ensure it's available in your PATH

If the Gemini CLI is not available, the gemini-web-search module will be automatically disabled.

## Usage

### Basic Usage

```bash
# If installed globally
mcp-swissknife

# Or using npx
npx mcp-swissknife
```

### With Obsidian Integration

```bash
# If installed globally
mcp-swissknife --vault-path /path/to/your/obsidian/vault

# Or using npx
npx mcp-swissknife --vault-path /path/to/your/obsidian/vault
```

### Disabling Modules

You can disable specific modules using the `--disable` option:

```bash
# Disable a single module
mcp-swissknife --disable obsidian

# Disable multiple modules (comma-separated)
mcp-swissknife --disable obsidian,web-fetch

# Combine with other options
mcp-swissknife --vault-path /path/to/vault --disable gemini-web-search
```

Available modules to disable: `datetime`, `gemini-web-search`, `obsidian`, `software-docgen`, `web-fetch`

## MCP Configuration

To use MCP Swiss Knife with MCP-compatible clients, add it to your MCP configuration:

### Basic Configuration

```json
{
  "mcpServers": {
    "mcp-swissknife": {
      "command": "npx",
      "args": ["mcp-swissknife"],
      "env": {}
    }
  }
}
```

### With Obsidian Integration

```json
{
  "mcpServers": {
    "mcp-swissknife": {
      "command": "npx",
      "args": ["mcp-swissknife", "--vault-path", "/path/to/your/obsidian/vault"],
      "env": {}
    }
  }
}
```

### Example with Specific Vault Path

```json
{
  "mcpServers": {
    "mcp-swissknife": {
      "command": "npx",
      "args": ["mcp-swissknife", "--vault-path", "/mnt/c/obsidian"],
      "env": {}
    }
  }
}
```

### With Disabled Modules

```json
{
  "mcpServers": {
    "mcp-swissknife": {
      "command": "npx",
      "args": ["mcp-swissknife", "--disable", "obsidian,web-fetch"],
      "env": {}
    }
  }
}
```

## Available Tools

### DateTime Module
- `get_current_datetime` - Get current date and time in ISO 8601 format

### Gemini Web Search Module (requires Gemini CLI)
- `gemini_web_search` - Performs AI-powered web search using Gemini with WebSearch capability, providing comprehensive results with analysis and summarization

### Obsidian Module (requires --vault-path)
- `read_notes` - Read contents of multiple notes from your vault
- `search_notes` - Search for notes by name with partial matching

### Software Documentation Module
- `get_software_documentation_prompt` - Get prompts for creating project documentation

### Web Fetch Module
- Web content fetching and processing tools

## Development

### Prerequisites
- Node.js (ES2022+ support)
- npm or yarn

### Setup

```bash
git clone <repository-url>
cd mcp-swissknife
npm install
```

### Development Commands

```bash
npm run dev              # Development with vite-node
npm run build           # Production build
npm run quality:fix     # Format, lint, and typecheck
npm run typecheck       # TypeScript validation only
```

## Architecture

MCP Swiss Knife follows a modular architecture where each feature is implemented as a self-contained module in `src/lib/`. Each module implements the `ToolModule` interface and provides:

- Tool definitions with Zod schemas
- Handler implementations
- Optional initialization logic

### Adding New Modules

1. Create directory: `src/lib/[module-name]/`
2. Implement required files: `index.ts`, `tools.ts`, `handlers.ts`
3. Register in `serverConfig.modules` array in `src/index.ts`
4. Add CLI options if needed

## License

MIT