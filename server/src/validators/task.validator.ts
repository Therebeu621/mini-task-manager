/**
 * Zod validation schemas for the Task resource.
 * Used by the validate() middleware and can be re-exported to the client.
 */
import { z } from 'zod';

const taskStatusEnum = z.enum(['todo', 'doing', 'done']);
const taskPriorityEnum = z.enum(['low', 'medium', 'high']);
const booleanQueryParam = z.preprocess((value) => {
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'true') return true;
        if (normalized === 'false') return false;
    }
    return value;
}, z.boolean());

// ─── Create ────────────────────────────────────────────────────────────────

export const createTaskSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .min(1, 'Title cannot be empty')
        .max(200, 'Title must be at most 200 characters')
        .trim(),

    description: z
        .string()
        .max(2000, 'Description must be at most 2000 characters')
        .trim()
        .optional()
        .nullable(),

    status: taskStatusEnum.optional().default('todo'),

    priority: taskPriorityEnum.optional().default('medium'),

    dueDate: z
        .string()
        .datetime({ message: 'dueDate must be a valid ISO 8601 date-time string' })
        .optional()
        .nullable(),
});

// ─── Update ────────────────────────────────────────────────────────────────

// All fields optional for updates (partial patch semantics via PUT)
export const updateTaskSchema = z.object({
    title: z.string().min(1).max(200).trim().optional(),
    description: z.string().max(2000).trim().optional().nullable(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    dueDate: z.string().datetime().optional().nullable(),
});

// ─── Query Params ──────────────────────────────────────────────────────────

export const taskQuerySchema = z.object({
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    search: z.string().max(200).trim().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    includeDeleted: booleanQueryParam.optional().default(false),
    sortBy: z
        .enum(['title', 'dueDate', 'createdAt', 'priority', 'status'])
        .optional()
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ─── Inferred Types ────────────────────────────────────────────────────────

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
