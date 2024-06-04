import { describe, expect, it, afterAll } from '@jest/globals';
import { disconnect, connect } from '../src/config/database';
import mongoose from 'mongoose';

describe('Database Connection', () => {
    afterAll(async () => {
        await disconnect();
    });
    it('should connect to the database', async () => {
        await connect();
        const dbConnection = mongoose.connection;
        expect(dbConnection.readyState).toBe(1); // 1 means connected
    });

    it('should disconnect from the database', async () => {
        await disconnect();
        const dbConnection = mongoose.connection;
        expect(dbConnection.readyState).toBe(0); // 0 means disconnected
    });
});
