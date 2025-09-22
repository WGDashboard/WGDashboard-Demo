import pg from 'pg'
const { Pool } = pg

pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value)
const pool = new Pool({
    host: process.env.DATABASE_URL,
    user:  process.env.DATABASE_USER,
    password:  process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

export default pool