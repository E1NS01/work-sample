import { describe, test, beforeEach, expect } from '@jest/globals';
import request from 'supertest';
import express, { NextFunction, Request, Response } from 'express';
import errorHandler from '../src/middleware/errorHandler';
import { ValidationError } from '../src/errors/ValidationError';
import { DuplicateEntryError } from '../src/errors/DuplicateEntryError';

describe('Error handler', () => {
    let app: express.Application;
    beforeEach(() => {
        app = express();
    });

    test('should send 200 when no error is thrown', async () => {
        app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(200).send('No error');
        });

        app.use(errorHandler);

        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('No error');
    });

    test('should return 404 for non existent route', async () => {
        app.use(errorHandler);

        const res = await request(app).get('/this-route-does-not-exist');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({});
    });

    test('should handle errors and return JSON (code 500)', async () => {
        app.use((req: Request, res: Response, next: NextFunction) => {
            const err = new Error('Something went wrong');
            next(err);
        });

        app.use(errorHandler);

        const res = await request(app).get('/');
        expect(res.status).toBe(500);
        expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(res.body).toEqual({
            success: false,
            stack: expect.any(String),
            message: 'Something went wrong',
            status: 500,
        });
    });

    test('should handle ValidationErrors', async () => {
        app.use((req: Request, res: Response, next: NextFunction) => {
            throw new ValidationError('Testing validationError', 422);
        });

        app.use(errorHandler);

        const res = await request(app).get('/');
        expect(res.status).toBe(422);
        expect(res.body).toEqual({
            success: false,
            stack: expect.any(String),
            message: 'Testing validationError',
            status: 422,
        });
    });
    test('should handle DuplicateEntryErrors', async () => {
        app.use((req: Request, res: Response, next: NextFunction) => {
            throw new DuplicateEntryError('Testing DuplicateEntryError', 409);
        });

        app.use(errorHandler);

        const res = await request(app).get('/');
        expect(res.status).toBe(409);
        expect(res.body).toEqual({
            success: false,
            stack: expect.any(String),
            message: 'Testing DuplicateEntryError',
            status: 409,
        });
    });
});
