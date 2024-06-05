import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { connect } from './config/database';
import errorHandler from './middleware/errorHandler';
import userRouter from './routes/userRoutes';
import testRouter from './routes/testRoutes';
import logger from './config/logger';

dotenv.config();

connect();

export const app: Express = express();

app.use(cors()).use(express.json()).options('*', cors());

app.use(userRouter);
if (process.env.NODE_ENV === 'test') app.use(testRouter);

app.use(errorHandler);

if (require.main === module) {
    const port = process.env.PORT || 3111;
    app.listen(port, () => {
        logger.info(`[server]: Server is running at http://localhost:${port}`);
    });
}
