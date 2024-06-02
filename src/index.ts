import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { connect } from './database';
import UserModel from './user';

dotenv.config();

connect();

export const app: Express = express();
app.use(cors()).use(express.json()).options('*', cors());

app.post('/users', async (req: Request, res: Response) => {
    try {
        const body = req.body;
        if (!body.email) {
            throw new Error('Email is required');
        }
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(body.email)) {
            throw new Error('Email is not valid');
        }
        const user = new UserModel(req.body);
        try {
            await user.save();
            res.status(201).send(user);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});
app.get('/users', (req: Request, res: Response) => {
    console.log(req.query);
    //getting all users from mock db
    //sorting users by createdAt
    //return users
    res.status(200).send([]);
});

const port = process.env.PORT || 3111;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
