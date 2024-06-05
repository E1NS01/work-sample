import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../errors/ValidationError';

function validateUser(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    if (!body.email) {
        throw new ValidationError('Email is required', 400);
    }
    if (!body.name) {
        throw new ValidationError('Name is required', 400);
    }

    //basic email validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(body.email)) {
        throw new ValidationError('Email is not valid', 422);
    }
    //basic name validation (might miss some edge cases - not the focus of this test)
    const nameRegex = /^[a-zA-Z-' ]+$/;
    if (!nameRegex.test(body.name)) {
        throw new ValidationError('Name is not valid', 422);
    }

    next();
}

export default validateUser;
