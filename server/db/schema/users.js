const { pgTable, serial, varchar, boolean, timestamp, text } = require('drizzle-orm/pg-core');

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    role: varchar('role', { length: 20 }).notNull().default('user'), // 'user', 'seller', 'admin'
    isActive: boolean('is_active').notNull().default(true),
    lastLogin: timestamp('last_login'),
    phone: varchar('phone', { length: 50 }),
    address: text('address'),
    avatar: text('avatar'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

module.exports = { users };
