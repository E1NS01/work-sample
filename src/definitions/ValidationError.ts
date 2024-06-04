export interface ValidationError extends Error {
    status?: 400 | 422;
}

export class ValidationErrorImpl extends Error implements ValidationError {
    status: 400 | 422;

    constructor(message: string, status: 400 | 422) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, ValidationErrorImpl.prototype);
    }
}
