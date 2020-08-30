import App from './app.js';
import Event from './event.js';
import mysql from 'mysql';

const pool = mysql.createPool({
    connectionLimit: process.env.DB_POOL_SIZE || 10,
    host: process.env.DB_HOST || 'localhost',
    host: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'flayre',
    password: process.env.DB_PASSWORD || 'flayre',
    database: process.env.DB_NAME || 'flayre'
});

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
    data JSON DEFAULT NULL,
    element VARCHAR(256) DEFAULT NULL,
    type VARCHAR(256) DEFAULT NULL,
    stacktrace VARCHAR(2048) DEFAULT NULL,
    fatal BOOLEAN DEFAULT NULL
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
}