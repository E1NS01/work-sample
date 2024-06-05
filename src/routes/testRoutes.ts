import express from 'express';

const testRouter = express.Router();

testRouter.get('/test', (req, res) => {
    res.send('test');
});

testRouter.get('/test-error', (req, res) => {
    throw new Error('error test');
});

export default testRouter;
