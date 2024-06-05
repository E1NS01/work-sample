export class ValidationError extends Error {
    status: 400 | 422;

    constructor(message: string, status: 400 | 422) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
