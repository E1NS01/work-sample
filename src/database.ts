import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoTest: MongoMemoryServer = null;

async function connect() {
    try {
        let dbUri = process.env.MONGO_URI;
        if (process.env.NODE_ENV === 'test') {
            mongoTest = await MongoMemoryServer.create();
            dbUri = await mongoTest.getUri();
        } else {
            mongoose.connect(dbUri);
        }
    } catch (error) {
        console.error('Error connecting to the database: ', error);
        process.exit(1);
    }
    const dbConnection = mongoose.connection;
    dbConnection.once('open', () => {
        console.log('Database connected');
    });
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
        console.error('Error disconnecting from the database: ', error);
        process.exit(1);
    }
}

export { connect, disconnect };
