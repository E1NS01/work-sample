import express from 'express';
import { body, query } from 'express-validator';
import validateUser from '../middleware/validateUser';
import { createUser, getUsers } from '../controller/userController';

const router = express.Router();
router.post(
    '/users',
    [
        body('name').isString().trim().escape(),
        body('email').isString().trim().escape(),
        validateUser,
    ],
    createUser,
);
router.get(
    '/users',
    [query('created').optional().isIn(['ascending', 'descending']).trim().escape()],
    getUsers,
);

export default router;
