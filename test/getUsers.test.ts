import { describe, expect, test, afterEach } from '@jest/globals';
import UserModel from '../src/model/user';
import { User } from '../src/types/user';
import addUser from './helper/addUser';
import { sendGetRequest } from './helper/sendGetRequest';

describe('API test', () => {
    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    describe('GET /users', () => {
        test('should return application/json content type', async () => {
            const res = await sendGetRequest('/users');
            expect(res.headers['content-type']).toEqual(
                expect.stringContaining('application/json'),
            );
        });

        test('should return an empty array without users', async () => {
            const res = await sendGetRequest('/users');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        test('should return an array of users (without query)', async () => {
            const result: User[] = [];

            result.push(await addUser('Test Name', 'test@test.com'));

            const res = await sendGetRequest('/users');

            expect(res.status).toBe(200);
            expect(result[0]._id.toString()).toEqual(res.body[0]._id);
        });

        test('should return an array of users, sorted by createdAt (descending)', async () => {
            let result: User[] = [];

            result.push(await addUser('Test NameONE', 'test1@test.com'));
            result.push(await addUser('Test NameTWO', 'test2@test.com'));

            result = result.reverse();

            const res = await sendGetRequest('/users?created=descending');

            expect(res.status).toBe(200);

            const userIds = res.body.map((user: User) => user._id);
            for (let i = 0; i < res.body.length - 1; i++) {
                expect(userIds).toContain(res.body[i]._id);
                expect(res.body[i].createdAt >= res.body[i + 1].createdAt).toBe(true);
            }
        });

        test('should return an array of users, sorted by createdAt (ascending)', async () => {
            const result: User[] = [];

            result.push(await addUser('Test NameONE', 'test1@test.com'));
            result.push(await addUser('Test NameTWO', 'test2@test.com'));

            const res = await sendGetRequest('/users?created=ascending');

            expect(res.status).toBe(200);

            const userIds = res.body.map((user: User) => user._id);
            for (let i = 0; i < res.body.length - 1; i++) {
                expect(userIds).toContain(res.body[i]._id);
                expect(res.body[i].createdAt <= res.body[i + 1].createdAt).toBe(true);
            }
        });
    });
});
