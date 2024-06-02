import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../src';
import { connect, disconnect } from '../src/database';

describe('API test', () => {
    beforeAll(() => {
        connect();
    });
    afterAll(() => {
        disconnect();
    });

    describe('GET /users', () => {
        test('should return an empty array without users', async () => {
            const res = await request(app).get('/users').set('Accept', 'application/json');
            expect(res.body).toEqual([]);
            expect(res.status).toBe(200);
        });
        test('should return an array of users', async () => {
            const res = await request(app).get('/users').set('Accept', 'application/json');
            expect(res.body).toEqual([]);
        });

        test('should return an array of users, sorted by createdAt (descending)', async () => {
            const res = await request(app).get('/users').set('Accept', 'application/json');
            expect(res.body).toEqual([]);
        });

        test('should return an array of users, sorted by createdAt (ascending)', async () => {
            const res = await request(app).get('/users').set('Accept', 'application/json');
            expect(res.body).toEqual([]);
        });
    });
    describe('POST /users', () => {
        test('should return a status code of 400 without email', async () => {
            const res = await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({});
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Email is required' });
        });
        test('should return a status code of 400 without a valid email', async () => {
            const res = await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({ email: 'email' });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'Email is not valid' });
        });
        test('should return a status code of 201', async () => {
            const res = await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({ email: 'email@email.com' });
            expect(res.status).toBe(201);
            expect(res.body).toEqual({});
        });
    });
});

async function addUser(email: string) {
    await request(app).post('/users').set('Accept', 'application/json').send({ email });
}
