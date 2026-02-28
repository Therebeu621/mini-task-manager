/**
 * Tasks service — all business logic and database access.
 * Uses Prisma Client to perform CRUD operations on the Task model.
 */
import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { requireOwnershipOrAdmin } from '../middleware/auth';
import type { AuthenticatedUser } from '../types/auth.types';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/task.validator';

const prisma = new PrismaClient();

function buildTaskWhere(query: TaskQueryInput, actor: AuthenticatedUser): Prisma.TaskWhereInput {
    const where: Prisma.TaskWhereInput = {};

    if (actor.role === 'user') {
        where.ownerId = actor.id;
    }

    if (!query.includeDeleted) {
        where.deletedAt = null;
    }

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

async function findTaskOrThrow(id: string): Promise<{
    id: string;
    ownerId: string;
    deletedAt: Date | null;
}> {
    const task = await prisma.task.findUnique({
        where: { id },
        select: {
            id: true,
            ownerId: true,
            deletedAt: true,
        },
    });

    if (!task) {
        throw new AppError(404, `Task with id "${id}" not found`);
    }

    return task;
}

async function assertTaskAccess(
    id: string,
    actor: AuthenticatedUser,
): Promise<{ id: string; ownerId: string; deletedAt: Date | null }> {
    const task = await findTaskOrThrow(id);
    requireOwnershipOrAdmin(actor, task.ownerId);
    return task;
}

export const TasksService = {
    /**
     * Return all tasks, optionally filtered, searched, and sorted.
     */
    async list(query: TaskQueryInput, actor: AuthenticatedUser) {
        const where = buildTaskWhere(query, actor);
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
     * Find a single non-deleted task by id. Throws if not found or not allowed.
     */
    async findById(id: string, actor: AuthenticatedUser) {
        await assertTaskAccess(id, actor);

        const task = await prisma.task.findFirst({
            where: {
                id,
                ...(actor.role === 'admin' ? {} : { ownerId: actor.id }),
                deletedAt: null,
            },
        });

        if (!task) {
            throw new AppError(404, `Task with id "${id}" not found`);
        }

        return task;
    },

    /**
     * Create a new task.
     */
    async create(input: CreateTaskInput, actor: AuthenticatedUser) {
        return prisma.task.create({
            data: {
                title: input.title,
                description: input.description ?? null,
                status: input.status ?? 'todo',
                priority: input.priority ?? 'medium',
                dueDate: input.dueDate ? new Date(input.dueDate) : null,
                ownerId: actor.id,
                createdById: actor.id,
                updatedById: actor.id,
            },
        });
    },

    /**
     * Update fields on an existing non-deleted task.
     */
    async update(id: string, input: UpdateTaskInput, actor: AuthenticatedUser) {
        const existingTask = await assertTaskAccess(id, actor);
        if (existingTask.deletedAt) {
            throw new AppError(409, 'Cannot update a deleted task. Restore it first.');
        }

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
                updatedById: actor.id,
            },
        });
    },

    /**
     * Soft-delete a task by id.
     */
    async remove(id: string, actor: AuthenticatedUser) {
        const existingTask = await assertTaskAccess(id, actor);
        if (existingTask.deletedAt) {
            throw new AppError(409, 'Task is already deleted');
        }

        return prisma.task.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedById: actor.id,
                updatedById: actor.id,
            },
        });
    },

    /**
     * Restore a soft-deleted task by id.
     */
    async restore(id: string, actor: AuthenticatedUser) {
        const existingTask = await assertTaskAccess(id, actor);
        if (!existingTask.deletedAt) {
            throw new AppError(409, 'Task is not deleted');
        }

        return prisma.task.update({
            where: { id },
            data: {
                deletedAt: null,
                deletedById: null,
                updatedById: actor.id,
            },
        });
    },
};
