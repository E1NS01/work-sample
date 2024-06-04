import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import logger from './logger';

let mongoTest: MongoMemoryServer = null;

async function connect() {
    try {
        let dbUri = process.env.MONGO_URI;
        if (process.env.NODE_ENV === 'test') {
            mongoTest = await MongoMemoryServer.create();
            dbUri = await mongoTest.getUri();
        }
        await mongoose.connect(dbUri);
    } catch (error) {
        logger.error('Error connecting to the database: ', error);
        process.exit(1);
    }
    const dbConnection = mongoose.connection;
    dbConnection.on('error', (error) => {
        console.error('Database connection error: ', error);
    });
}

async function disconnect() {
    try {
        await mongoose.connection.close();
        if (mongoTest) {
            await mongoTest.stop();
        }
    } catch (error) {
        logger.error('Error disconnecting from the database: ', error);
        process.exit(1);
    }
}

export { connect, disconnect };
