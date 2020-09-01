const mysql = require('mysql');
const dbConfig = require('./config.js').dbConfig;

const pool = mysql.createPool(dbConfig);
module.exports = pool
