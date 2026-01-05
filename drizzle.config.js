require('dotenv').config({ path: './.env' });

/** @type { import("drizzle-kit").Config } */
module.exports = {
    schema: './server/db/schema/index.js',
    out: './server/db/migrations',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
};
