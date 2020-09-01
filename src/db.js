import mysql from 'mysql';
import { dbConfig } from './config.js';

const pool = mysql.createPool(dbConfig);

export default pool
