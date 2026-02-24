/**
 * Centralised error handler middleware.
 * Must be registered as the LAST middleware in app.ts.
 * Converts any unhandled error into a consistent JSON response.
 */
import { Request, Response, NextFunction } from 'express';

/** Custom application error with an HTTP status code. */
export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
    ) {
        super(message);
        this.name = 'AppError';
        // Maintain proper prototype chain in transpiled code
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    // Known application error — surface the message and status code
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
        return;
    }

    // Log unexpected errors (in production you'd send these to a monitoring service)
    console.error('Unhandled error:', err);

    // Generic 500 for all other errors — don't leak internal details
    res.status(500).json({
        success: false,
        error: 'Internal server error',
    });
}
