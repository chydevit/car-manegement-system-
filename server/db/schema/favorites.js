const { pgTable, serial, integer, timestamp, unique } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { cars } = require('./cars');

const favorites = pgTable('favorites', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    carId: integer('car_id').notNull().references(() => cars.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
    uniqueUserCar: unique('unique_user_car').on(table.userId, table.carId),
}));

module.exports = { favorites };
