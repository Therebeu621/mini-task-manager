/**
 * Tasks service — all business logic and database access.
 * Uses Prisma Client to perform CRUD operations on the Task model.
 */
import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/task.validator';

const prisma = new PrismaClient();

function buildTaskWhere(query: TaskQueryInput): Prisma.TaskWhereInput {
    const where: Prisma.TaskWhereInput = {};

    if (query.status) {
        where.status = query.status;
    }
    if (query.priority) {
        where.priority = query.priority;
    }
    if (query.search) {
        where.OR = [
            { title: { contains: query.search } },
            { description: { contains: query.search } },
        ];
    }

    return where;
}

export const TasksService = {
    /**
     * Return all tasks, optionally filtered, searched, and sorted.
     */
    async list(query: TaskQueryInput) {
        const where = buildTaskWhere(query);
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const sortBy = query.sortBy ?? 'createdAt';
        const sortOrder = query.sortOrder ?? 'desc';

        const orderBy: Prisma.TaskOrderByWithRelationInput[] =
            sortBy === 'createdAt'
                ? [{ createdAt: sortOrder }, { id: 'asc' }]
                : [{ [sortBy]: sortOrder }, { createdAt: 'desc' }, { id: 'asc' }];

        const [data, total] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            prisma.task.count({ where }),
        ]);

        const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    },

    /**
     * Find a single task by id. Throws 404 if not found.
     */
    async findById(id: string) {
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) {
            throw new AppError(404, `Task with id "${id}" not found`);
        }
        return task;
    },

    /**
     * Create a new task.
     */
    async create(input: CreateTaskInput) {
        return prisma.task.create({
            data: {
                title: input.title,
                description: input.description ?? null,
                status: input.status ?? 'todo',
                priority: input.priority ?? 'medium',
                dueDate: input.dueDate ? new Date(input.dueDate) : null,
            },
        });
    },

    /**
     * Update fields on an existing task. Throws 404 if not found.
     */
    async update(id: string, input: UpdateTaskInput) {
        // Verify the task exists before attempting to update
        await TasksService.findById(id);

        return prisma.task.update({
            where: { id },
            data: {
                ...(input.title !== undefined && { title: input.title }),
                ...(input.description !== undefined && { description: input.description }),
                ...(input.status !== undefined && { status: input.status }),
                ...(input.priority !== undefined && { priority: input.priority }),
                ...(input.dueDate !== undefined && {
                    dueDate: input.dueDate ? new Date(input.dueDate) : null,
                }),
            },
        });
    },

    /**
     * Delete a task by id. Throws 404 if not found.
     */
    async remove(id: string) {
        await TasksService.findById(id);
        return prisma.task.delete({ where: { id } });
    },
};
