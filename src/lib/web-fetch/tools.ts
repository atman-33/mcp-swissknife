import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ToolDefinition, ToolInput } from '../../types/index.js';

// Schema definitions
export const WebFetchArgsSchema = z.object({
  url: z.string().url('Invalid URL format.'),
});

// Tool definitions
export const webFetchTools: ToolDefinition[] = [
  {
    name: 'get_raw_text',
    description:
      'Retrieves raw text content directly from a URL without browser rendering. Ideal for structured data formats like JSON, XML, CSV, TSV, or plain text files. Best used when fast, direct access to the source content is needed without processing dynamic elements.',
    inputSchema: zodToJsonSchema(WebFetchArgsSchema) as ToolInput,
  },
  {
    name: 'get_rendered_html',
    description:
      'Fetches fully rendered HTML content using a headless browser, including JavaScript-generated content. Essential for modern web applications, single-page applications (SPAs), or any content that requires client-side rendering to be complete.',
    inputSchema: zodToJsonSchema(WebFetchArgsSchema) as ToolInput,
  },
  {
    name: 'get_markdown',
    description:
      'Converts web page content to well-formatted Markdown, preserving structural elements like tables and definition lists. Recommended as the default tool for web content extraction when a clean, readable text format is needed while maintaining document structure.',
    inputSchema: zodToJsonSchema(WebFetchArgsSchema) as ToolInput,
  },
  {
    name: 'get_markdown_summary',
    description:
      'Extracts and converts the main content area of a web page to Markdown format, automatically removing navigation menus, headers, footers, and other peripheral content. Perfect for capturing the core content of articles, blog posts, or documentation pages.',
    inputSchema: zodToJsonSchema(WebFetchArgsSchema) as ToolInput,
  },
];
