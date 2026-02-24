import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Run tests in Node.js environment (not browser)
        environment: 'node',
        // Run tests sequentially to avoid SQLite concurrency issues
        pool: 'forks',
        poolOptions: {
            forks: {
                singleFork: true,
            },
        },
        // Load .env.test if it exists; otherwise fall back to .env
        env: {
            NODE_ENV: 'test',
            DATABASE_URL: 'file:./test.db',
            PORT: '3002',
        },
        // Show verbose output
        reporter: 'verbose',
    },
});
