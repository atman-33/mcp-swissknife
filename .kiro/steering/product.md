---
inclusion: always
---

# MCP Swiss Knife - Product Guide

MCP Swiss Knife (`mcp-swissknife`) is a multi-purpose Model Context Protocol server providing utility tools for AI assistants. Built with TypeScript and following MCP protocol standards.

## Architecture Principles

- **Modular Design**: Each feature is a self-contained module in `src/lib/`
- **Tool-Based Interface**: All functionality exposed as MCP tools with Zod schemas
- **Async Initialization**: Modules can implement optional `initialize()` for setup
- **CLI Configuration**: Commander.js handles arguments and module configuration

## Current Modules

- **datetime**: Date/time utilities (`get_current_datetime`)
- **obsidian**: Vault integration (`read_notes`, `search_notes`) - requires `--vault-path`
- **software-docgen**: Documentation generation (`get_software_documentation_prompt`)
- **web-fetch**: Web content tools (fetch, extract, search capabilities)

## Development Conventions

- **Module Structure**: Each module implements `ToolModule` interface with `name`, `description`, `tools`, `handlers`
- **Error Handling**: Use structured error responses, console.error for logging
- **Tool Registration**: All modules registered in `serverConfig.modules` array
- **Binary Name**: Distributed as `mcp-utils` executable
- **Initialization**: Modules with dependencies should implement `initialize()` method

## Configuration

- **CLI Options**: Use Commander.js for new configuration options
- **Module Dependencies**: Handle missing dependencies gracefully in `initialize()`
- **Optional Features**: Modules should work independently when possible