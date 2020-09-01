import express from 'express';
import Event from './event.js';
import { randomId, firstOfMonth, lastOfMonth } from './util.js';
import { AppRepository, EventRepository } from './db.js';
import App from './app.js';

const app = express();
app.use(express.json());

let events = [];

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/id', (req, res) => {
    const length = Number.parseInt(req.query['length']) || 32;
    res.send(randomId(length));
});

app.get('/apps', (req, res) => {
    AppRepository.getApps()
        .then((apps) => {
            res.json(apps);
        }).catch((err) => {
            console.error(err);
            res.status(500).send();
        })
});

app.post('/apps', (req, res) => {
    const name = req.body.name;
    if (!name) {
        res.status(400).send({ message: 'Invalid app name' });
        return;
    }

    AppRepository.createApp(new App(name))
        .then((app) => {
            res.json(app);
        }).catch((err) => {
            res.status(500).send();
        })
});

app.get('/apps/:appId', (req, res) => {
    AppRepository.getApp(req.params.appId)
        .then((app) => {
            if (!app) {
                res.sendStatus(404);
            } else {
                res.json(app);
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).send();
        })
})

app.patch('/apps/:appId', (req, res) => {
    AppRepository.updateApp(req.params.appId, req.body.name)
        .then((app) => {
            if (!app) {
                res.sendStatus(404);
            } else {
                res.sendStatus(204);
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).send();
        })
})

app.delete('/apps/:appId', (req, res) => {
    AppRepository.deleteApp(req.params.appId)
        .then((app) => {
            res.send(204);
        }).catch((err) => {
            res.status(500).send();
        })
})

app.get('/events', (req, res) => {
    const appId = req.query.appId;
    if (!appId) {
        res.status(400).send({ message: 'Invalid appId' });
    }
    const from = req.query.from || firstOfMonth()
    const to = req.query.to || lastOfMonth()
    const count = req.query.count || 1000;
    const page = req.query.count || 1;
    EventRepository.getEvents(appId, from, to, count, page)
        .then((events) => {
            res.json(events);
        }).catch((err) => {
            res.status(500).send();
        })
});

app.post('/events', (req, res) => {
    if (typeof req.body.appId === "undefined") {
        // TODO: Use some kind of authentication for this? 
        res.status(400).json({ message: 'Invalid appId' });
        return;
    }

    if (typeof req.body.sessionId === "undefined") {
        res.status(400).json({ message: 'Invalid sessionId' });
        return;
    }

    if (Event.types.indexOf(req.body.type) === -1) {
        res.status(400).json({ message: 'Invalid event type' });
        return;
    }

    if (typeof req.body.data === "undefined") {
        // TODO: Handle data validation better than this
        res.status(400).json({ message: 'Invalid data' });
        return;
    }

    const event = new Event(
        req.body.appId,
        req.body.date,
        req.body.userAgent,
        req.body.platform,
        req.body.manufacturer,
        req.body.model,
        req.body.version,
        req.body.locale,
        req.body.sessionId,
        req.body.data,
        req.body.type,
    );

    events.push(event);
    res.json(event);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Started Flayre server on port ${port}`);
});