import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'mcp-swissknife',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        '@modelcontextprotocol/sdk/server/index.js',
        '@modelcontextprotocol/sdk/server/stdio.js',
        '@modelcontextprotocol/sdk/types.js',
        'node:fs',
        'node:fs/promises',
        'node:os',
        'node:path',
        'zod',
        'zod-to-json-schema'
      ],
      output: {
        banner: '#!/usr/bin/env node'
      }
    },
    target: 'node18',
    outDir: 'dist',
    minify: false,
    sourcemap: true
  },
  esbuild: {
    platform: 'node',
    format: 'esm'
  }
});