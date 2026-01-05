const { pgTable, serial, integer, varchar, text, timestamp, check } = require('drizzle-orm/pg-core');
const { sql } = require('drizzle-orm');
const { users } = require('./users');
const { cars } = require('./cars');

const reviews = pgTable('reviews', {
    id: serial('id').primaryKey(),
    carId: integer('car_id').notNull().references(() => cars.id),
    userId: integer('user_id').notNull().references(() => users.id),
    userName: varchar('user_name', { length: 255 }).notNull(),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
    ratingCheck: check('rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
}));

module.exports = { reviews };
