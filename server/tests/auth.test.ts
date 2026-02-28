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
});

describe('Auth endpoints', () => {
    it('register should create a user and return a token', async () => {
        const res = await request.post('/api/auth/register').send({
            email: 'register@test.local',
            password: 'Password123!',
        });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
        expect(res.body.data.user).toMatchObject({
            email: 'register@test.local',
            role: 'user',
        });
    });

    it('register should return 409 when email already exists', async () => {
        await request.post('/api/auth/register').send({
            email: 'taken@test.local',
            password: 'Password123!',
        });

        const second = await request.post('/api/auth/register').send({
            email: 'taken@test.local',
            password: 'Password123!',
        });

        expect(second.status).toBe(409);
        expect(second.body.success).toBe(false);
    });

    it('login should return token and user with valid credentials', async () => {
        await request.post('/api/auth/register').send({
            email: 'login@test.local',
            password: 'Password123!',
        });

        const res = await request.post('/api/auth/login').send({
            email: 'login@test.local',
            password: 'Password123!',
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
        expect(res.body.data.user.email).toBe('login@test.local');
    });

    it('login should return 401 with wrong password', async () => {
        await request.post('/api/auth/register').send({
            email: 'wrong-password@test.local',
            password: 'Password123!',
        });

        const res = await request.post('/api/auth/login').send({
            email: 'wrong-password@test.local',
            password: 'WrongPassword123!',
        });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('me should return 401 when token is missing', async () => {
        const res = await request.get('/api/auth/me');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});
