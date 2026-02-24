/**
 * Validation middleware factory.
 * Validates request body and/or query params against Zod schemas.
 * Returns a 400 JSON response with structured errors on validation failure.
 */
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

interface ValidateSchemas {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}

/**
 * Formats a ZodError into a human-friendly record of field → messages.
 */
function formatZodErrors(error: ZodError): Record<string, string[]> {
    return error.errors.reduce(
        (acc, issue) => {
            const key = issue.path.join('.') || '_root';
            if (!acc[key]) acc[key] = [];
            acc[key].push(issue.message);
            return acc;
        },
        {} as Record<string, string[]>,
    );
}

export function validate(schemas: ValidateSchemas) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Validate and coerce each section if a schema was provided
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.query) {
                req.query = schemas.query.parse(req.query) as typeof req.query;
            }
            if (schemas.params) {
                req.params = schemas.params.parse(req.params);
            }
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    errors: formatZodErrors(err),
                });
                return;
            }
            next(err);
        }
    };
}
