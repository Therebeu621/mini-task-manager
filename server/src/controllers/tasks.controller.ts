/**
 * Tasks controller — thin HTTP layer.
 * Delegates all business logic to TasksService and serialises responses.
 */
import { Request, Response, NextFunction } from 'express';
import { TasksService } from '../services/tasks.service';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/task.validator';

export const TasksController = {
    /** GET /api/tasks */
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await TasksService.list(req.query as unknown as TaskQueryInput);
            res.json({ success: true, data: result.data, meta: result.meta });
        } catch (err) {
            next(err);
        }
    },

    /** POST /api/tasks */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await TasksService.create(req.body as CreateTaskInput);
            res.status(201).json({ success: true, data: task });
        } catch (err) {
            next(err);
        }
    },

    /** GET /api/tasks/:id */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await TasksService.findById(req.params.id);
            res.json({ success: true, data: task });
        } catch (err) {
            next(err);
        }
    },

    /** PUT /api/tasks/:id */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await TasksService.update(req.params.id, req.body as UpdateTaskInput);
            res.json({ success: true, data: task });
        } catch (err) {
            next(err);
        }
    },

    /** DELETE /api/tasks/:id */
    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await TasksService.remove(req.params.id);
            res.json({ success: true, data: task });
        } catch (err) {
            next(err);
        }
    },
};
