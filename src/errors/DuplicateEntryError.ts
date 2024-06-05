export class DuplicateEntryError extends Error {
    status: 409;

    constructor(message: string, status: 409) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, DuplicateEntryError.prototype);
    }
}
