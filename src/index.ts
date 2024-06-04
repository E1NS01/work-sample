import express, { Express, NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { connect } from './config/database';
import UserModel from './model/user';
import errorHandler from './middleware/errorHandler';

interface User {
    email: string;
    createdAt?: Date;
}

dotenv.config();

connect();

export const app: Express = express();
app.use(cors()).use(express.json()).options('*', cors());

app.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        if (!body.email) {
            throw new Error('Email is required');
        }
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(body.email)) {
            throw new Error('Email is not valid');
        }
    } catch (error) {
        console.log(error.message);
        next(error);
        return;
    }

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
        let users: User[] = [];
        if (req.query.created === 'ascending') {
            users = await UserModel.find().sort({ createdAt: 1 });
        } else users = await UserModel.find().sort({ createdAt: -1 });
        res.status(200).send(users);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

app.use(errorHandler);

const port = process.env.PORT || 3111;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
