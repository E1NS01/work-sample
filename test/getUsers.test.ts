import { describe, expect, test, afterEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../src';
import UserModel from '../src/model/user';
import { User } from '../src/definitions/user';
import addUser from './helper/addUser';

describe('API test', () => {
    afterEach(async () => {
        await UserModel.deleteMany({});
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
});
