const { pgTable, serial, integer, text, varchar, date, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { cars } = require('./cars');

const inquiries = pgTable('inquiries', {
    id: serial('id').primaryKey(),
    carId: integer('car_id').notNull().references(() => cars.id),
    userId: integer('user_id').notNull().references(() => users.id),
    sellerId: integer('seller_id').notNull().references(() => users.id),
    message: text('message').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('open'), // 'open', 'closed'
    type: varchar('type', { length: 20 }).notNull().default('general'), // 'general', 'test_drive'
    requestedDate: date('requested_date'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

module.exports = { inquiries };
