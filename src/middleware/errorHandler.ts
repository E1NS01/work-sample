import { NextFunction, Request, Response } from 'express';
import { ValidationErrorImpl } from '../definitions/ValidationError';

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    let errorStatus = 500;
    let errorMessage = 'Something went wrong';

    if (err instanceof ValidationErrorImpl) {
        errorStatus = err.status;
        errorMessage = err.message;
    }

    res.status(errorStatus).send({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? err.stack : '',
    });
}

export default errorHandler;
