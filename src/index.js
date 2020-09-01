import express from 'express';
import { eventRouter } from './event.js';
import { port } from './config.js';
import { randomId } from './util.js';
import { appRouter } from './app.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/id', (req, res) => {
    const length = Number.parseInt(req.query['length']) || 32;
    res.send(randomId(length));
});

app.use('/apps', appRouter)
app.use('/events', eventRouter)

app.listen(port, () => {
    console.log(`Started Flayre server on port ${port}`);
});
