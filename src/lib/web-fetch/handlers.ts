import axios from 'axios';
import type { TranslatorConfigObject } from 'node-html-markdown';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { type Browser, chromium, type Page } from 'playwright';
import TurndownService from 'turndown';
import type { z } from 'zod';
import type { ToolHandler, ToolHandlerMap } from '../../types/index.js';
import { WebFetchArgsSchema } from './tools.js';

const TIMEOUT = 20000;

/**
 * Handler for getting raw text content from a URL
 */
async function handleGetRawText(
  args: z.infer<typeof WebFetchArgsSchema>,
): Promise<{ content: { type: 'text'; text: string }[] }> {
  try {
    const response = await axios.get(args.url);
    return {
      content: [{ type: 'text', text: String(response.data) }],
    };
  } catch (error) {
    console.error(`Failed to fetch raw text from ${args.url}:`, error);
    throw new Error(
      `Failed to fetch raw text from URL: ${args.url}. Error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Handler for getting rendered HTML content using headless browser
 */
async function handleGetRenderedHtml(
  args: z.infer<typeof WebFetchArgsSchema>,
): Promise<{ content: { type: 'text'; text: string }[] }> {
  try {
    const htmlString = await getHtmlString(args.url);
    return {
      content: [{ type: 'text', text: htmlString }],
    };
  } catch (error) {
    console.error(`Failed to fetch rendered HTML from ${args.url}:`, error);
    throw new Error(
      `Failed to fetch rendered HTML from URL: ${args.url}. Error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Handler for converting web page to Markdown
 */
async function handleGetMarkdown(
  args: z.infer<typeof WebFetchArgsSchema>,
): Promise<{ content: { type: 'text'; text: string }[] }> {
  try {
    const markdownString = await getMarkdownStringFromHtmlByNHM(args.url);
    return {
      content: [{ type: 'text', text: markdownString }],
    };
  } catch (error) {
    console.error(`Failed to convert to Markdown from ${args.url}:`, error);
    throw new Error(
      `Failed to convert to Markdown from URL: ${args.url}. Error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Handler for extracting main content and converting to Markdown
 */
async function handleGetMarkdownSummary(
  args: z.infer<typeof WebFetchArgsSchema>,
): Promise<{ content: { type: 'text'; text: string }[] }> {
  try {
    const markdownString = await getMarkdownStringFromHtmlByTD(args.url, true);
    return {
      content: [{ type: 'text', text: markdownString }],
    };
  } catch (error) {
    console.error(`Failed to extract main content from ${args.url}:`, error);
    throw new Error(
      `Failed to extract main content from URL: ${args.url}. Error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Helper method to fetch rendered HTML content using a headless browser
 */
async function getHtmlString(requestUrl: string): Promise<string> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
    });
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto(requestUrl, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT,
    });
    const htmlString = await page.content();
    return htmlString;
  } catch (error) {
    console.error(`Failed to fetch HTML for ${requestUrl}:`, error);
    return '';
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.error('Error closing page:', e);
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }
}

/**
 * Helper method to convert HTML to Markdown using Turndown with custom rules for tables and definition lists
 */
async function getMarkdownStringFromHtmlByTD(
  requestUrl: string,
  mainOnly = false,
): Promise<string> {
  const htmlString = await getHtmlString(requestUrl);
  const turndownService = new TurndownService({ headingStyle: 'atx' });

  turndownService.remove('script');
  turndownService.remove('style');

  if (mainOnly) {
    turndownService.remove('header');
    turndownService.remove('footer');
    turndownService.remove('nav');
  }

  turndownService.addRule('table', {
    filter: 'table',
    replacement: (_content, node) => {
      // Process each row in the table
      const rows = Array.from(node.querySelectorAll('tr'));
      if (rows.length === 0) {
        return '';
      }

      const headerRow = rows[0];
      const headerCells = Array.from(headerRow.querySelectorAll('th, td')).map(
        (cell) => cell.textContent?.trim() || '',
      );
      const separator = headerCells.map(() => '---').join('|');

      // Header row and separator line
      let markdown = `\n| ${headerCells.join(' | ')} |\n|${separator}|`;

      // Process remaining rows
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rowCells = Array.from(row.querySelectorAll('th, td')).map(
          (cell) => cell.textContent?.trim() || '',
        );
        markdown += `\n| ${rowCells.join(' | ')} |`;
      }

      return `${markdown}\n`;
    },
  });

  turndownService.addRule('dl', {
    filter: 'dl',
    replacement: (_content, node) => {
      let markdown = '\n\n';
      const items = Array.from(node.children);
      let currentDt = '';

      items.forEach((item) => {
        if (item.tagName === 'DT') {
          currentDt = item.textContent?.trim() || '';
          if (currentDt) {
            markdown += `**${currentDt}:**`;
          }
        } else if (item.tagName === 'DD') {
          const ddContent = item.textContent?.trim() || '';
          if (ddContent) {
            markdown += ` ${ddContent}\n`;
          }
        }
      });

      return `${markdown}\n`;
    },
  });

  const markdownString = turndownService.turndown(htmlString);
  return markdownString;
}

/**
 * Helper method to convert HTML to Markdown using NodeHtmlMarkdown with custom translators for special elements
 */
async function getMarkdownStringFromHtmlByNHM(
  requestUrl: string,
  mainOnly = false,
): Promise<string> {
  const htmlString = await getHtmlString(requestUrl);
  const customTranslators: TranslatorConfigObject = {
    dl: () => ({
      preserveWhitespace: false,
      surroundingNewlines: true,
    }),
    dt: () => ({
      prefix: '**',
      postfix: ':** ',
      surroundingNewlines: false,
    }),
    dd: () => ({
      postfix: '\n',
      surroundingNewlines: false,
    }),
    Head: () => ({
      postfix: '\n',
      ignore: false,
      postprocess: (ctx) => {
        const titleNode = ctx.node.querySelector('title');
        if (titleNode) {
          return titleNode.textContent || '';
        }
        return '';
      },
      surroundingNewlines: true,
    }),
  };

  if (mainOnly) {
    customTranslators.Header = () => ({
      ignore: true,
    });
    customTranslators.Footer = () => ({
      ignore: true,
    });
    customTranslators.Nav = () => ({
      ignore: true,
    });
  }

  const markdownString = NodeHtmlMarkdown.translate(
    htmlString,
    {},
    customTranslators,
  );
  return markdownString;
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
export const webFetchHandlers: ToolHandlerMap = new Map([
  ['get_raw_text', createHandler(WebFetchArgsSchema, handleGetRawText)],
  [
    'get_rendered_html',
    createHandler(WebFetchArgsSchema, handleGetRenderedHtml),
  ],
  ['get_markdown', createHandler(WebFetchArgsSchema, handleGetMarkdown)],
  [
    'get_markdown_summary',
    createHandler(WebFetchArgsSchema, handleGetMarkdownSummary),
  ],
]);
