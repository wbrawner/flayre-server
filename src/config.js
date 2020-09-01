const users = {};
users[process.env.ADMIN_USER || 'admin'] = process.env.ADMIN_USER || 'flayre'
export const basicAuthConfig = {
    users: users
};

export const dbConfig = {
    connectionLimit: process.env.DB_POOL_SIZE || 10,
    host: process.env.DB_HOST || 'localhost',
    host: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'flayre',
    password: process.env.DB_PASSWORD || 'flayre',
    database: process.env.DB_NAME || 'flayre'
}

export const port = process.env.PORT || 3000;
