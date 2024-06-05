import { NextFunction, Request, Response } from 'express';
import UserModel from '../model/user';
import logger from '../config/logger';
import { DuplicateEntryError } from '../errors/DuplicateEntryError';
import { User } from '../types/user';

export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = new UserModel(req.body);
        const existingUser = await getUserByEmail(user.email);
        if (existingUser) {
            throw new DuplicateEntryError('User already exists', 409);
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
        const sortOrder = req.query.created === 'ascending' ? 1 : -1;
        const users = await UserModel.find().sort({ createdAt: sortOrder });
        res.status(200).send(users);
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
}

async function getUserByEmail(email: string): Promise<User> {
    try {
        const user = await UserModel.findOne({ email });
        return user;
    } catch (error) {
        logger.error(error.message);
        throw error;
    }
}
