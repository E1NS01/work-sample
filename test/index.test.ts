import { describe, expect, test, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../src';
import { disconnect } from '../src/config/database';
import UserModel from '../src/model/user';
import { User } from '../src/definitions/user';

describe('API test', () => {
    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    afterAll(() => {
        disconnect();
    });

    describe('GET /users', () => {
        test('should return an empty array without users', async () => {
            const res = await request(app).get('/users').set('Accept', 'application/json');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toEqual(
                expect.stringContaining('application/json'),
            );
            expect(res.body).toEqual([]);
        });
        test('should return an array of users (without query)', async () => {
            const result: User[] = [];

            result.push(await addUser('Test Name', 'test@test.com'));

            const res = await request(app).get('/users').set('Accept', 'application/json');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toEqual(
                expect.stringContaining('application/json'),
            );
            for (let i = 0; i < res.body.length - 1; i++) {
                expect(result[i]._id.toString()).toEqual(res.body[i]._id);
            }
        });

        test('should return an array of users, sorted by createdAt (descending)', async () => {
            let result: User[] = [];

            result.push(await addUser('Test NameONE', 'test1@test.com'));
            result.push(await addUser('Test NameTWO', 'test2@test.com'));

            result = result.reverse();

            const res = await request(app)
                .get('/users?created=descending')
                .set('Accept', 'application/json');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toEqual(
                expect.stringContaining('application/json'),
            );

            for (let i = 0; i < res.body.length - 1; i++) {
                expect(result[i]._id.toString()).toEqual(res.body[i]._id);
            }

            for (let i = 0; i < res.body.length - 1; i++) {
                expect(res.body[i].createdAt >= res.body[i + 1].createdAt).toBe(true);
            }
        });

        test('should return an array of users, sorted by createdAt (ascending)', async () => {
            const result: User[] = [];

            result.push(await addUser('Test NameONE', 'test1@test.com'));
            result.push(await addUser('Test NameTWO', 'test2@test.com'));

            const res = await request(app)
                .get('/users?created=ascending')
                .set('Accept', 'application/json');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toEqual(
                expect.stringContaining('application/json'),
            );
            for (let i = 0; i < res.body.length - 1; i++) {
                expect(result[i]._id.toString()).toEqual(res.body[i]._id);
            }

            for (let i = 0; i < res.body.length - 1; i++) {
                expect(res.body[i].createdAt <= res.body[i + 1].createdAt).toBe(true);
            }
        });
    });
    describe('POST /users', () => {
        test('should require an email', async () => {
            const res = await request(app)
                .post('/users')
                .set('Accept', 'application/json')
                .send({});
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

async function addUser(name: string, email: string): Promise<User> {
    const user = new UserModel({ name, email });
    await user.save();
    return user;
}
