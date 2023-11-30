const { Pool } = require('pg');

const pool = new Pool({
    user: 'yasserreslan',
    host: 'localhost',
    database: 'users',
    password: 'yasser13',
    port: 5432,
});

module.exports = pool;
