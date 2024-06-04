import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { connect } from './config/database';
import errorHandler from './middleware/errorHandler';
import router from './routes/userRoutes';

dotenv.config();

connect();

export const app: Express = express();
app.use(cors()).use(express.json()).options('*', cors());

app.use(router);

app.use(errorHandler);

const port = process.env.PORT || 3111;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
