import type { z } from 'zod';
import type { ToolHandler, ToolHandlerMap } from '../../types/index.js';
import { GetSoftwareDocumentationPromptArgsSchema } from './tools.js';

/**
 * Handler for getting software documentation prompt
 */
async function handleGetSoftwareDocumentationPrompt(
  _args: z.infer<typeof GetSoftwareDocumentationPromptArgsSchema>,
): Promise<{ content: { type: 'text'; text: string }[] }> {
  const prompt = `You are an assistant for creating software project design documents.  Generate the following three Markdown files and output them under the \`.tmp/steering\` folder.

1. product.md
- Provide a clear overview of the project
- List Core Functionality
- Summarize Key Features
- Describe Target Users

2. structure.md
- Document Root Files (main files in the project root)
- List Key Directories
- Explain Architecture Patterns (design approach, security model, tool implementations, error handling, etc.)
- Specify Naming Conventions and File Organization principles

3. tech.md
- Describe Runtime & Language (programming language, runtime environment, compilation target, module system, etc.)
- List Core Dependencies (main libraries/frameworks)
- Document Build System (how the project is built)
- Provide Common Commands (development, installation, Docker usage, etc.) with code blocks
- Specify Code Style rules
- Explain Distribution methods

Format the output as follows:
.tmp/steering/product.md
------------------------
# Product Overview
...

.tmp/steering/structure.md
--------------------------
# Project Structure
...

.tmp/steering/tech.md
---------------------
# Technology Stack
...`;

  return {
    content: [{ type: 'text', text: prompt }],
  };
}

/**
 * Create a wrapped handler that validates arguments against a Zod schema
 */
function createHandler<T extends z.ZodTypeAny>(
  schema: T,
  handler: (
    args: z.infer<T>,
  ) => Promise<{ content: { type: 'text'; text: string }[] }>,
): ToolHandler {
  return async (args: unknown) => {
    const parsed = schema.safeParse(args);
    if (!parsed.success) {
      throw new Error(`Invalid arguments: ${parsed.error}`);
    }
    return handler(parsed.data);
  };
}

// Export handlers map
export const softwareDocgenHandlers: ToolHandlerMap = new Map([
  [
    'get_software_documentation_prompt',
    createHandler(
      GetSoftwareDocumentationPromptArgsSchema,
      handleGetSoftwareDocumentationPrompt,
    ),
  ],
]);
