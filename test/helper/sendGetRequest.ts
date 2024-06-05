import request from 'supertest';
import { app } from '../../src/index';

export async function sendGetRequest(path: string) {
    return await request(app).get(path).set('Accept', 'application/json');
}
