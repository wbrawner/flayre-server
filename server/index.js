const express = require('express');
const eventRouter = require('./event.js').router;
const port = require('./config.js').port;
const randomId = require('./util.js').randomId;
const appRouter = require('./app.js').router;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/id', (req, res) => {
    const length = Number.parseInt(req.query['length']) || 32;
    res.send(randomId(length));
});

app.use('/api/apps', appRouter)
app.use('/api/events', eventRouter)

app.listen(port, () => {
    console.log(`Started Flayre server on port ${port}`);
});
