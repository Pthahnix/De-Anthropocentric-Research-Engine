import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.test.ts'],
    testTimeout: 15000,
    alias: {
      '@mariozechner/pi-ai': resolve(
        __dirname,
        'packages/agents/node_modules/@mariozechner/pi-ai/dist/index.js'
      ),
    },
  },
  resolve: {
    alias: {
      '@mariozechner/pi-ai': resolve(
        'packages/agents/node_modules/@mariozechner/pi-ai/dist/index.js'
      ),
    },
  },
});
