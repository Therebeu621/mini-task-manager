/**
 * Tasks resource routes.
 * All mounted under /api/tasks by app.ts
 */
import { Router } from 'express';
import { TasksController } from '../controllers/tasks.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../validators/task.validator';

export const tasksRouter = Router();

tasksRouter.use(authMiddleware);

// GET /api/tasks — list all tasks (with optional filter/sort/search)
tasksRouter.get('/', validate({ query: taskQuerySchema }), TasksController.list);

// POST /api/tasks — create a new task
tasksRouter.post('/', validate({ body: createTaskSchema }), TasksController.create);

// GET /api/tasks/:id — get a single task
tasksRouter.get('/:id', TasksController.getById);

// PUT /api/tasks/:id — fully update a task
tasksRouter.put('/:id', validate({ body: updateTaskSchema }), TasksController.update);

// DELETE /api/tasks/:id — remove a task
tasksRouter.delete('/:id', TasksController.remove);

// PATCH /api/tasks/:id/restore — restore a soft-deleted task
tasksRouter.patch('/:id/restore', TasksController.restore);
