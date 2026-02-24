/**
 * Tests for GET /api/health
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { app } from '../src/app';
import type { Server } from 'http';

let server: Server;
const request = supertest(app);

beforeAll(() => {
    server = app.listen(0); // port 0 = random available port
});

afterAll(() => {
    server.close();
});

describe('GET /api/health', () => {
    it('should return 200 with status ok', async () => {
        const res = await request.get('/api/health');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('ok');
        expect(res.body.data).toHaveProperty('uptime');
        expect(res.body.data).toHaveProperty('timestamp');
    });

    it('should return 404 for unknown routes', async () => {
        const res = await request.get('/api/unknown-route');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});
