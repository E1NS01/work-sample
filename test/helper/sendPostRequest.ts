import request from 'supertest';
import { app } from '../../src/index';

export async function sendPostRequest(path: string, body: any) {
    return await request(app).post(path).set('Accept', 'application/json').send(body);
}
