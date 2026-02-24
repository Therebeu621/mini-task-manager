/**
 * Application entry point.
 * Loads environment variables, then starts the HTTP server.
 */
import 'dotenv/config';
import { app } from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = app.listen(PORT, () => {
    console.info(`🚀 Server running on http://localhost:${PORT}`);
    console.info(`📋 Health check: http://localhost:${PORT}/api/health`);
    console.info(`🌿 Environment: ${process.env.NODE_ENV ?? 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.info('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.info('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.info('Server closed.');
        process.exit(0);
    });
});

export { server };
