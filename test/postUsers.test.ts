import { describe, expect, test, afterEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../src';
import UserModel from '../src/model/user';

describe('API test', () => {
    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    describe('POST /users', () => {
        test('should require an email', async () => {
            const res = await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({ name: 'Test Name' });
            expect(res.status).toBe(400);
            expect(res.headers['content-type']).toEqual(
                expect.stringContaining('application/json'),
            );
            expect(res.body).toEqual({
                message: 'Email is required',
                stack: '',
                status: 400,
                success: false,
            });
        });
        test('should require a name', async () => {
            const res = await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({ email: 'test@test.com' });
            expect(res.status).toBe(400);
            expect(res.headers['content-type']).toEqual(
                expect.stringContaining('application/json'),
            );
            expect(res.body).toEqual({
                message: 'Name is required',
                stack: '',
                status: 400,
                success: false,
            });
        });
        test('should require a valid email', async () => {
            const res = await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({ email: 'email', name: 'Test Name' });
            expect(res.status).toBe(422);
            expect(res.headers['content-type']).toEqual(
                expect.stringContaining('application/json'),
            );
            expect(res.body).toEqual({
                message: 'Email is not valid',
                stack: '',
                status: 422,
                success: false,
            });
        });
        test('should require a valid name', async () => {
            const res = await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({ email: 'email@email.com', name: '1234' });
            expect(res.status).toBe(422);
            expect(res.headers['content-type']).toEqual(
                expect.stringContaining('application/json'),
            );
            expect(res.body).toEqual({
                message: 'Name is not valid',
                stack: '',
                status: 422,
                success: false,
            });
        });
        test('should create a user and return status code 201', async () => {
            const res = await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({ name: 'Test Name', email: 'email@email.com' });
            expect(res.status).toBe(201);
            expect(res.headers['content-type']).toEqual(
                expect.stringContaining('application/json'),
            );
            expect(res.body).toEqual({
                _id: expect.any(String),
                name: 'Test Name',
                email: 'email@email.com',
                createdAt: expect.any(String),
            });
        });
    });
});
