import { describe, expect, test, afterEach } from '@jest/globals';
import UserModel from '../src/model/user';
import { sendPostRequest } from './helper/sendPostRequest';

describe('API test', () => {
    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    describe('POST /users', () => {
        test('should return application/json content type', async () => {
            const res = await sendPostRequest('/users', {});
            expect(res.headers['content-type']).toEqual(
                expect.stringContaining('application/json'),
            );
        });

        test('should require an email', async () => {
            const res = await sendPostRequest('/users', {
                name: 'Test Name',
            });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                message: 'Email is required',
                stack: '',
                status: 400,
                success: false,
            });
        });

        test('should require a name', async () => {
            const res = await sendPostRequest('/users', {
                email: 'email@email.com',
            });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                message: 'Name is required',
                stack: '',
                status: 400,
                success: false,
            });
        });

        test('should require a valid email', async () => {
            const res = await sendPostRequest('/users', {
                name: 'Test Name',
                email: 'email',
            });
            expect(res.status).toBe(422);
            expect(res.body).toEqual({
                message: 'Email is not valid',
                stack: '',
                status: 422,
                success: false,
            });
        });

        test('should require a valid name', async () => {
            const res = await sendPostRequest('/users', {
                name: '1234',
                email: 'email@email.com',
            });
            expect(res.status).toBe(422);
            expect(res.body).toEqual({
                message: 'Name is not valid',
                stack: '',
                status: 422,
                success: false,
            });
        });

        test('should create a user and return status code 201', async () => {
            const res = await sendPostRequest('/users', {
                name: 'Test Name',
                email: 'email@email.com',
            });
            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                _id: expect.any(String),
                name: 'Test Name',
                email: 'email@email.com',
                createdAt: expect.any(String),
            });
        });

        test('should not create a user if email already exists', async () => {
            await sendPostRequest('/users', {
                name: 'Test Name',
                email: 'test@test.com',
            });
            const res = await sendPostRequest('/users', {
                name: 'Test Name',
                email: 'test@test.com',
            });
            expect(res.status).toBe(409);
            expect(res.body).toEqual({
                message: 'User already exists',
                stack: '',
                status: 409,
                success: false,
            });
        });
    });
});
