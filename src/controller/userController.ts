import { NextFunction, Request, Response } from 'express';
import UserModel from '../model/user';
import logger from '../config/logger';

export async function createUser(req: Request, res: Response, next: NextFunction) {
    const user = new UserModel(req.body);
    try {
        const found = await getUserByEmail(user.email);
        if (found) {
            res.status(400).send({ error: 'User already exists' });
            return;
        }
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

async function getUserByEmail(email: string) {
    try {
        const user = await UserModel.findOne({ email });
        return user;
    } catch (error) {
        logger.error(error.message);
        throw error;
    }
}
