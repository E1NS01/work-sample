import express from 'express';

const testRouter = express.Router();

//returns a test message
testRouter.get('/test', (req, res) => {
    res.send('test');
});

//returns a test error
testRouter.get('/test-error', (req, res) => {
    throw new Error('error test');
});

export default testRouter;
