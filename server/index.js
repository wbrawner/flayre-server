const express = require('express');
const eventRouter = require('./event.js').router;
const port = require('./config.js').port;
const appRouter = require('./app.js').router;
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // TODO: Enable this for event creation only

// app.get('/id', (req, res) => {
//     const length = Number.parseInt(req.query['length']) || 32;
//     res.send(require('./util.js').randomId(length));
// });

app.use(express.static('server/static'));
app.use('/api/apps', appRouter);
app.use('/api/events', eventRouter);

app.listen(port, () => {
    console.log(`Started Flayre server on port ${port}`);
});
