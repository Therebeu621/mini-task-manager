/**
 * Integration tests for the /api/tasks resource.
 * Uses a separate test SQLite database (configured via vitest.config.ts env).
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { app } from '../src/app';
import type { Server } from 'http';

const prisma = new PrismaClient();
let server: Server;
const request = supertest(app);

beforeAll(async () => {
    // Push the Prisma schema to the test database
    execSync('npx prisma db push --skip-generate', {
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
        stdio: 'ignore',
    });
    server = app.listen(0);
});

afterAll(async () => {
    await prisma.$disconnect();
    server.close();
});

// Clean the tasks table before each test for isolation
beforeEach(async () => {
    await prisma.task.deleteMany();
});

// ─── Helper ────────────────────────────────────────────────────────────────

async function createTask(overrides: Record<string, unknown> = {}) {
    return request.post('/api/tasks').send({
        title: 'Test Task',
        description: 'A test description',
        status: 'todo',
        priority: 'medium',
        ...overrides,
    });
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('POST /api/tasks', () => {
    it('should create a task and return 201', async () => {
        const res = await createTask();

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toMatchObject({
            title: 'Test Task',
            description: 'A test description',
            status: 'todo',
            priority: 'medium',
        });
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.createdAt).toBeDefined();
    });

    it('should return 400 when title is missing', async () => {
        const res = await request.post('/api/tasks').send({ description: 'No title!' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Validation failed');
        expect(res.body.errors).toHaveProperty('title');
    });

    it('should return 400 when an invalid status is provided', async () => {
        const res = await createTask({ status: 'invalid-status' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.errors).toHaveProperty('status');
    });

    it('should use default status=todo and priority=medium when omitted', async () => {
        const res = await request.post('/api/tasks').send({ title: 'Minimal task' });

        expect(res.status).toBe(201);
        expect(res.body.data.status).toBe('todo');
        expect(res.body.data.priority).toBe('medium');
    });
});

describe('GET /api/tasks', () => {
    it('should return an empty array when no tasks exist', async () => {
        const res = await request.get('/api/tasks');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data).toHaveLength(0);
    });

    it('should return all created tasks', async () => {
        await createTask({ title: 'Task A' });
        await createTask({ title: 'Task B' });

        const res = await request.get('/api/tasks');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
    });

    it('should filter tasks by status', async () => {
        await createTask({ status: 'todo' });
        await createTask({ status: 'done' });

        const res = await request.get('/api/tasks?status=done');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].status).toBe('done');
    });

    it('should search tasks by title', async () => {
        await createTask({ title: 'Buy groceries' });
        await createTask({ title: 'Write tests' });

        const res = await request.get('/api/tasks?search=groceries');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].title).toBe('Buy groceries');
    });
});

describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
        const created = await createTask();
        const id = created.body.data.id;

        const res = await request.get(`/api/tasks/${id}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(id);
    });

    it('should return 404 for a non-existent id', async () => {
        const res = await request.get('/api/tasks/non-existent-id');

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
        const created = await createTask();
        const id = created.body.data.id;

        const res = await request.put(`/api/tasks/${id}`).send({ status: 'done', priority: 'high' });

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('done');
        expect(res.body.data.priority).toBe('high');
    });

    it('should return 404 when updating a non-existent task', async () => {
        const res = await request.put('/api/tasks/non-existent-id').send({ title: 'Ghost' });

        expect(res.status).toBe(404);
    });
});

describe('DELETE /api/tasks/:id', () => {
    it('should delete a task and return it', async () => {
        const created = await createTask();
        const id = created.body.data.id;

        const res = await request.delete(`/api/tasks/${id}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(id);

        // Confirm it's really gone
        const check = await request.get(`/api/tasks/${id}`);
        expect(check.status).toBe(404);
    });

    it('should return 404 when deleting a non-existent task', async () => {
        const res = await request.delete('/api/tasks/non-existent-id');

        expect(res.status).toBe(404);
    });
});
