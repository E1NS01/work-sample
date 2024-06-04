import { NextFunction, Request, Response } from 'express';
import UserModel from '../model/user';
import logger from '../config/logger';

export async function createUser(req: Request, res: Response, next: NextFunction) {
    const user = new UserModel(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        let users;
        if (req.query.created === 'ascending') {
            users = await UserModel.find().sort({ createdAt: 1 });
        } else users = await UserModel.find().sort({ createdAt: -1 });
        res.status(200).send(users);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
}
