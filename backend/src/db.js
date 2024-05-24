const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const db_host = process.env.DB_HOST
const db_name = process.env.DB_NAME
const db_port = process.env.DB_PORT
//const db_string = process.env.DATABASE_URL
const db_string = `postgresql://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`
const pool = new Pool({
    connectionString: db_string,
});

module.exports = pool;