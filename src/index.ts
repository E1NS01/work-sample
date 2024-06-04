import express, { Express, NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { connect } from './config/database';
import { body, query, validationResult } from 'express-validator';
import { User } from './definitions/user';
import UserModel from './model/user';
import errorHandler from './middleware/errorHandler';
import validateUser from './middleware/validateUser';
import logger from './config/logger';
import { ValidationErrorImpl } from './definitions/ValidationError';

dotenv.config();

connect();

export const app: Express = express();
app.use(cors()).use(express.json()).options('*', cors());

app.post(
    '/users',
    [
        body('name').isString().trim().escape(),
        body('email').isString().trim().escape(),
        validateUser,
    ],

    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        console.log(
            errors
                .array()
                .map((error) => error.msg)
                .join(', '),
        );
        if (!errors.isEmpty()) {
            throw new ValidationErrorImpl(
                errors
                    .array()
                    .map((error) => error.msg)
                    .join(', '),
                422,
            );
        }

        const user = new UserModel(req.body);
        try {
            await user.save();
            res.status(201).send(user);
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    },
);

app.get(
    '/users',
    [query('created').optional().isIn(['ascending', 'descending']).trim().escape()],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let users: User[];
            if (req.query.created === 'ascending') {
                users = await UserModel.find().sort({ createdAt: 1 });
            } else users = await UserModel.find().sort({ createdAt: -1 });
            res.status(200).send(users);
        } catch (error) {
            logger.error(error.message);
            error.status = 500;
            next(error);
        }
    },
);

app.use(errorHandler);

const port = process.env.PORT || 3111;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
