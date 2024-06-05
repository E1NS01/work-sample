import { describe, expect, test, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/index';

describe('Server setup', () => {
    test('should have cors enabled', async () => {
        const res = await request(app).get('/test');
        expect(res.headers['access-control-allow-origin']).toEqual('*');
    });

    test('should use json middleware', async () => {
        const res = await request(app).get('/test');
        expect(res.body).toEqual(expect.any(Object));
    });

    test('should have error handler middleware', async () => {
        const res = await request(app).get('/test-error');
        expect(res.status).toBe(500);
    });
});
