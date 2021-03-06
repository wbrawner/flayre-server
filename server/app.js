const express = require('express');
const basicAuth = require('express-basic-auth');
const randomId = require('./util.js').randomId;
const basicAuthConfig = require('./config.js').basicAuthConfig;
const pool = require('./db.js');

pool.query(`CREATE TABLE IF NOT EXISTS apps (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(256) UNIQUE NOT NULL
)`, (err, res) => {
    if (err) console.error(err);
});

class App {
    id = randomId(32);
    name;

    constructor(name) {
        this.name = name;
    }
}

class AppRepository {
    static getApps() {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM apps', (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(res);
            });
        })
    }

    static getApp(appId) {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM apps WHERE id = ? LIMIT 1', appId, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(res[0]);
            });
        })
    }

    static createApp(app) {
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO apps SET ?', app, (err, res, fields) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(app);
            });
        })
    }

    static updateApp(appId, name) {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE apps SET name = ? WHERE id = ?', [name, appId], (err, res, fields) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(res.affectedRows === 1);
            });
        })
    }

    static deleteApp(appId) {
        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM apps WHERE id = ?', appId, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(res);
            });
        })
    }
}

const router = express.Router();
router.use(basicAuth(basicAuthConfig));

router.get('/', (req, res) => {
    AppRepository.getApps()
        .then((apps) => {
            res.json(apps);
        }).catch((err) => {
            console.error(err);
            res.status(500).send();
        })
});

router.post('/', basicAuth(basicAuthConfig), (req, res) => {
    const name = req.body.name;
    if (!name) {
        res.status(400).send({ message: 'Invalid app name' });
        return;
    }

    AppRepository.createApp(new App(name))
        .then((app) => {
            res.json(app);
        }).catch((err) => {
            console.error(err);
            res.sendStatus(500);
        })
});

router.get('/:appId', basicAuth(basicAuthConfig), (req, res) => {
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

router.patch('/:appId', (req, res) => {
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

router.delete('/:appId', (req, res) => {
    AppRepository.deleteApp(req.params.appId)
        .then((app) => {
            res.send(204);
        }).catch((err) => {
            res.status(500).send();
        })
})

module.exports = {
    App,
    AppRepository,
    router
}
