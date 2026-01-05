const { pgTable, serial, integer, text, boolean, timestamp } = require('drizzle-orm/pg-core');
const { cars } = require('./cars');

const carImages = pgTable('car_images', {
    id: serial('id').primaryKey(),
    carId: integer('car_id').notNull().references(() => cars.id, { onDelete: 'cascade' }),
    imageUrl: text('image_url').notNull(),
    isPrimary: boolean('is_primary').notNull().default(false),
    displayOrder: integer('display_order').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

module.exports = { carImages };
