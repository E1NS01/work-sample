import express, { Express, NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { connect } from './config/database';
import UserModel from './model/user';
import errorHandler from './middleware/errorHandler';
import { User } from './definitions/user';
import validateUser from './middleware/validateUser';

dotenv.config();

connect();

export const app: Express = express();
app.use(cors()).use(express.json()).options('*', cors());

app.post('/users', validateUser, async (req: Request, res: Response, next: NextFunction) => {
    const user = new UserModel(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

app.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users: User[];
        if (req.query.created === 'ascending') {
            users = await UserModel.find().sort({ createdAt: 1 });
        } else users = await UserModel.find().sort({ createdAt: -1 });
        res.status(200).send(users);
    } catch (error) {
        console.log(error.message);
        error.status = 500;
        next(error);
    }
});

app.use(errorHandler);

const port = process.env.PORT || 3111;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
