import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { app } from '../src/app';
import type { Server } from 'http';

const prisma = new PrismaClient();
let server: Server;
const request = supertest(app);

let adminToken = '';
let adminUserId = '';
let userToken = '';
let userId = '';
let otherUserToken = '';

beforeAll(async () => {
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

beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    const adminRegister = await request.post('/api/auth/register').send({
        email: 'admin@test.local',
        password: 'Password123!',
    });
    adminToken = adminRegister.body.data.token;
    adminUserId = adminRegister.body.data.user.id;
    await prisma.user.update({
        where: { id: adminUserId },
        data: { role: 'admin' },
    });
    const adminLogin = await request.post('/api/auth/login').send({
        email: 'admin@test.local',
        password: 'Password123!',
    });
    adminToken = adminLogin.body.data.token;

    const userRegister = await request.post('/api/auth/register').send({
        email: 'user@test.local',
        password: 'Password123!',
    });
    userToken = userRegister.body.data.token;
    userId = userRegister.body.data.user.id;

    const otherRegister = await request.post('/api/auth/register').send({
        email: 'other@test.local',
        password: 'Password123!',
    });
    otherUserToken = otherRegister.body.data.token;
});

function withAuth(token: string) {
    return { Authorization: `Bearer ${token}` };
}

async function createTask(token: string, payload: Record<string, unknown> = {}) {
    return request
        .post('/api/tasks')
        .set(withAuth(token))
        .send({
            title: 'Test Task',
            description: 'A test description',
            status: 'todo',
            priority: 'medium',
            ...payload,
        });
}

describe('Authentication guard', () => {
    it('should return 401 when requesting tasks without token', async () => {
        const res = await request.get('/api/tasks');
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});

describe('RBAC and CRUD', () => {
    it('user should create a task and own it', async () => {
        const res = await createTask(userToken, { title: 'Owned by user' });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.ownerId).toBe(userId);
        expect(res.body.data.createdById).toBe(userId);
        expect(res.body.data.updatedById).toBe(userId);
    });

    it('user should only see their own tasks', async () => {
        await createTask(userToken, { title: 'User task' });
        await createTask(otherUserToken, { title: 'Other task' });

        const res = await request.get('/api/tasks').set(withAuth(userToken));

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].title).toBe('User task');
        expect(res.body.meta.total).toBe(1);
    });

    it('admin should see all tasks', async () => {
        await createTask(userToken, { title: 'User task' });
        await createTask(otherUserToken, { title: 'Other task' });

        const res = await request.get('/api/tasks').set(withAuth(adminToken));

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.meta.total).toBe(2);
    });

    it('user should not update task owned by someone else', async () => {
        const created = await createTask(otherUserToken, { title: 'Other owner task' });
        const taskId = created.body.data.id;

        const res = await request
            .put(`/api/tasks/${taskId}`)
            .set(withAuth(userToken))
            .send({ title: 'Hacked title' });

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
    });

    it('admin should be able to update any task', async () => {
        const created = await createTask(userToken, { title: 'Needs admin update' });
        const taskId = created.body.data.id;

        const res = await request
            .put(`/api/tasks/${taskId}`)
            .set(withAuth(adminToken))
            .send({ status: 'done', priority: 'high' });

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('done');
        expect(res.body.data.priority).toBe('high');
        expect(res.body.data.updatedById).toBe(adminUserId);
    });
});

describe('Soft delete and restore', () => {
    it('delete should soft-delete and hide task from default list', async () => {
        const created = await createTask(userToken, { title: 'Soft delete target' });
        const taskId = created.body.data.id;

        const deleted = await request.delete(`/api/tasks/${taskId}`).set(withAuth(userToken));
        expect(deleted.status).toBe(200);
        expect(deleted.body.data.deletedAt).toBeTruthy();
        expect(deleted.body.data.deletedById).toBe(userId);

        const list = await request.get('/api/tasks').set(withAuth(userToken));
        expect(list.status).toBe(200);
        expect(list.body.data).toHaveLength(0);
        expect(list.body.meta.total).toBe(0);
    });

    it('admin includeDeleted=true should return soft-deleted tasks', async () => {
        const created = await createTask(userToken, { title: 'Deleted for admin listing' });
        const taskId = created.body.data.id;
        await request.delete(`/api/tasks/${taskId}`).set(withAuth(userToken));

        const res = await request
            .get('/api/tasks?includeDeleted=true')
            .set(withAuth(adminToken));

        expect(res.status).toBe(200);
        expect(res.body.meta.total).toBe(1);
        expect(res.body.data[0].deletedAt).toBeTruthy();
    });

    it('restore should reactivate a deleted task', async () => {
        const created = await createTask(userToken, { title: 'Restore target' });
        const taskId = created.body.data.id;
        await request.delete(`/api/tasks/${taskId}`).set(withAuth(userToken));

        const restored = await request
            .patch(`/api/tasks/${taskId}/restore`)
            .set(withAuth(userToken));
        expect(restored.status).toBe(200);
        expect(restored.body.data.deletedAt).toBeNull();
        expect(restored.body.data.deletedById).toBeNull();

        const list = await request.get('/api/tasks').set(withAuth(userToken));
        expect(list.status).toBe(200);
        expect(list.body.data).toHaveLength(1);
    });

    it('restore should return 409 if task is not deleted', async () => {
        const created = await createTask(userToken, { title: 'Active task' });
        const taskId = created.body.data.id;

        const res = await request.patch(`/api/tasks/${taskId}/restore`).set(withAuth(userToken));

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });
});

describe('Pagination and validation', () => {
    it('page=1&limit=2 should return up to 2 items with coherent metadata', async () => {
        await createTask(userToken, { title: 'Task 1' });
        await createTask(userToken, { title: 'Task 2' });
        await createTask(userToken, { title: 'Task 3' });
        await createTask(userToken, { title: 'Task 4' });
        await createTask(userToken, { title: 'Task 5' });

        const res = await request
            .get('/api/tasks?page=1&limit=2&sortBy=createdAt&sortOrder=asc')
            .set(withAuth(userToken));

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeLessThanOrEqual(2);
        expect(res.body.meta).toMatchObject({
            page: 1,
            limit: 2,
            total: 5,
            totalPages: 3,
        });
    });

    it('page=2&limit=2 should return next slice and keep total constant', async () => {
        await createTask(userToken, { title: 'Task A' });
        await createTask(userToken, { title: 'Task B' });
        await createTask(userToken, { title: 'Task C' });
        await createTask(userToken, { title: 'Task D' });
        await createTask(userToken, { title: 'Task E' });

        const firstPage = await request
            .get('/api/tasks?page=1&limit=2&sortBy=createdAt&sortOrder=asc')
            .set(withAuth(userToken));
        const secondPage = await request
            .get('/api/tasks?page=2&limit=2&sortBy=createdAt&sortOrder=asc')
            .set(withAuth(userToken));

        expect(firstPage.status).toBe(200);
        expect(secondPage.status).toBe(200);
        expect(firstPage.body.meta.total).toBe(secondPage.body.meta.total);
        expect(secondPage.body.meta).toMatchObject({
            page: 2,
            limit: 2,
            total: 5,
            totalPages: 3,
        });
        expect(secondPage.body.data).toHaveLength(2);
    });

    it('invalid page/limit should return 400', async () => {
        const invalidPage = await request
            .get('/api/tasks?page=0&limit=10')
            .set(withAuth(userToken));
        const invalidLimit = await request
            .get('/api/tasks?page=1&limit=101')
            .set(withAuth(userToken));

        expect(invalidPage.status).toBe(400);
        expect(invalidPage.body.success).toBe(false);
        expect(invalidPage.body.error).toBe('Validation failed');

        expect(invalidLimit.status).toBe(400);
        expect(invalidLimit.body.success).toBe(false);
        expect(invalidLimit.body.error).toBe('Validation failed');
    });

    it('pagination total should exclude soft-deleted by default', async () => {
        const one = await createTask(userToken, { title: 'A' });
        await createTask(userToken, { title: 'B' });
        await createTask(userToken, { title: 'C' });

        await request.delete(`/api/tasks/${one.body.data.id}`).set(withAuth(userToken));

        const res = await request.get('/api/tasks?page=1&limit=10').set(withAuth(userToken));

        expect(res.status).toBe(200);
        expect(res.body.meta.total).toBe(2);
        expect(res.body.data).toHaveLength(2);
    });
});
