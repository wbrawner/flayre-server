import { randomId, firstOfMonth, lastOfMonth } from './util.js';
import pool from './db.js';
import express from 'express';
import basicAuth from 'express-basic-auth';
import { basicAuthConfig } from './config.js'

export default class Event {
    static types = [
        'view',
        'click',
        'error',
        'crash',
    ];

    id = randomId(32);
    appId = '';
    date = new Date();

    // For web only
    userAgent = '';

    platform = '';
    // For native only
    manufacturer = '';
    // This doubles as the browser for web
    model = '';
    version = '';

    locale = '';
    sessionId = '';

    /**
     * This can have different meanings depending on what the event's type is:
     * 
     * view -> page path
     * click -> element identifier
     * error & crash -> stacktrace
     */
    data;

    /**
     * view,click, error, or crash 
    */
    type;

    constructor(
        appId,
        date,
        userAgent,
        platform,
        manufacturer,
        model,
        version,
        locale,
        sessionId,
        data,
        type,
    ) {
        this.appId = appId;
        this.date = date;
        this.userAgent = userAgent;
        this.platform = platform;
        this.manufacturer = manufacturer;
        this.model = model;
        this.version = version;
        this.locale = locale;
        this.sessionId = sessionId;
        this.data = data;
        this.type = type;
    }
}

pool.query(`CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(32) PRIMARY KEY,
    appId VARCHAR(32) NOT NULL,
    date DATETIME NOT NULL,
    userAgent VARCHAR(256),
    platform VARCHAR(32),
    manufacturer VARCHAR(256),
    model VARCHAR(256),
    version VARCHAR(32),
    locale VARCHAR(8),
    sessionId VARCHAR(32),
    data TEXT DEFAULT NULL,
    type VARCHAR(256) DEFAULT NULL,
    FOREIGN KEY (appId)
        REFERENCES apps(id)
        ON DELETE CASCADE
)`);

export class EventRepository {
    static getEvents(
        appId,
        from,
        to,
        count,
        page,
    ) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM events WHERE appId = ?';
            let queryParams = [appId]
            if (from) {
                query += ' AND date >= ?'
                queryParams.push(from)
            }
            if (to) {
                query += ' AND date <= ?'
                queryParams.push(to)
            }
            if (count) {
                let limit = count;
                let offset = 0;
                if (page) {
                    offset = count * (page - 1);
                    limit = count * page;
                }
                query += ' LIMIT ?,?';
                queryParams.push(offset, limit);
            }
            pool.query(query, queryParams, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(res);
            });
        });
    }

    static createEvent(event) {
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO events SET ?', event, (err, res, fields) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(event);
            });
        })
    }
}

export const eventRouter = express.Router()
eventRouter.get('/', basicAuth(basicAuthConfig), (req, res) => {
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

// This is one of the few routes that don't require authentication. Since 
// events will be coming from all over the place, I don't think it makes
// sense to try to put auth in front of this. Even some kind of client
// "secret" would be trivial to deduce by examining the requests.
eventRouter.post('/', (req, res) => {
    if (typeof req.body.appId === "undefined") {
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

    EventRepository.createEvent(new Event(
        req.body.appId,
        new Date(req.body.date),
        req.body.userAgent,
        req.body.platform,
        req.body.manufacturer,
        req.body.model,
        req.body.version,
        req.body.locale,
        req.body.sessionId,
        req.body.data,
        req.body.type,
    ))
        .then((event) => {
            res.json(event);
        }).catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});
