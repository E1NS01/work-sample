import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../definitions/CustomError';

function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong';
    res.status(errorStatus).send({
        sucess: false,
        status: errorStatus,
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? err.stack : '',
    });
}

export default errorHandler;
