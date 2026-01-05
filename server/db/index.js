const postgres = require('postgres');
const { drizzle } = require('drizzle-orm/postgres-js');
require('dotenv').config({ path: '../.env' });

// Create postgres connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}

// Create postgres client
const client = postgres(connectionString);

// Create drizzle instance
const db = drizzle(client);

module.exports = { db, client };
