/**
 * Tasks controller — thin HTTP layer.
 * Delegates all business logic to TasksService and serialises responses.
 */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { TasksService } from '../services/tasks.service';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/task.validator';

function getAuthenticatedUser(req: Request) {
    if (!req.user) {
        throw new AppError(401, 'Authorization token is required');
    }
    return req.user;
}

export const TasksController = {
    /** GET /api/tasks */
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const actor = getAuthenticatedUser(req);
            const result = await TasksService.list(req.query as unknown as TaskQueryInput, actor);
            res.json({ success: true, data: result.data, meta: result.meta });
        } catch (err) {
            next(err);
        }
    },

    /** POST /api/tasks */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const actor = getAuthenticatedUser(req);
            const task = await TasksService.create(req.body as CreateTaskInput, actor);
            res.status(201).json({ success: true, data: task });
        } catch (err) {
            next(err);
        }
    },

    /** GET /api/tasks/:id */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const actor = getAuthenticatedUser(req);
            const task = await TasksService.findById(req.params.id, actor);
            res.json({ success: true, data: task });
        } catch (err) {
            next(err);
        }
    },

    /** PUT /api/tasks/:id */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const actor = getAuthenticatedUser(req);
            const task = await TasksService.update(req.params.id, req.body as UpdateTaskInput, actor);
            res.json({ success: true, data: task });
        } catch (err) {
            next(err);
        }
    },

    /** DELETE /api/tasks/:id */
    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const actor = getAuthenticatedUser(req);
            const task = await TasksService.remove(req.params.id, actor);
            res.json({ success: true, data: task });
        } catch (err) {
            next(err);
        }
    },

    /** PATCH /api/tasks/:id/restore */
    async restore(req: Request, res: Response, next: NextFunction) {
        try {
            const actor = getAuthenticatedUser(req);
            const task = await TasksService.restore(req.params.id, actor);
            res.json({ success: true, data: task });
        } catch (err) {
            next(err);
        }
    },
};
