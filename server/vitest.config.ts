import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
    // Isolate modules per file so process.env changes take effect
    isolate: true,
  },
});
