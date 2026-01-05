const { pgTable, serial, varchar, decimal, text, integer, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const cars = pgTable('cars', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    description: text('description'),
    sellerId: integer('seller_id').notNull().references(() => users.id),
    status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'available', 'reserved', 'sold'
    brand: varchar('brand', { length: 100 }),
    model: varchar('model', { length: 100 }),
    year: integer('year'),
    fuelType: varchar('fuel_type', { length: 50 }),
    image: text('image'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

module.exports = { cars };
