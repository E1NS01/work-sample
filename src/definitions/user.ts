import { ObjectId } from 'mongoose';

export interface User {
    _id: any;
    name: string;
    email: string;
    createdAt: Date;
}
