/**
 * Express application factory.
 * Configures middlewares, mounts routes, and attaches error handler.
 */
import express, { type Application } from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health';
import { tasksRouter } from './routes/tasks';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Application {
    const app = express();

    // ─── Middlewares ──────────────────────────────────────────────────────────

    // Parse CORS_ORIGIN env var (supports comma-separated multiple origins)
    const corsOrigin = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
        : 'http://localhost:5173';

    app.use(
        cors({
            origin: corsOrigin,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        }),
    );

    // Parse incoming JSON bodies
    app.use(express.json());

    // ─── Routes ───────────────────────────────────────────────────────────────
    app.use('/api/health', healthRouter);
    app.use('/api/tasks', tasksRouter);

    // 404 handler for unmatched routes
    app.use((_req, res) => {
        res.status(404).json({ success: false, error: 'Route not found' });
    });

    // ─── Centralised error handler (must be last) ─────────────────────────────
    app.use(errorHandler);

    return app;
}

// Export the default singleton instance
export const app = createApp();
