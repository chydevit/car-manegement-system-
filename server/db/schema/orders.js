const { pgTable, serial, integer, decimal, varchar, jsonb, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { cars } = require('./cars');

const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    carId: integer('car_id').notNull().references(() => cars.id),
    buyerId: integer('buyer_id').notNull().references(() => users.id),
    sellerId: integer('seller_id').notNull().references(() => users.id),
    finalPrice: decimal('final_price', { precision: 10, scale: 2 }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('draft'), // 'draft', 'pending', 'completed', 'cancelled'
    documents: jsonb('documents'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

module.exports = { orders };
