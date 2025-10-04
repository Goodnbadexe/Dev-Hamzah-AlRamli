// === METADATA ===
// Purpose: Configure Vitest for TS project with Next paths
// Author: @Goodnbad.exe
// Inputs: None
// Outputs: Vitest configuration object
// Tests: npm test
// Complexity: O(1)
// === END METADATA ===
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});