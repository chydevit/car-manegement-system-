const { pgTable, serial, integer, varchar, jsonb, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const adminActions = pgTable('admin_actions', {
    id: serial('id').primaryKey(),
    adminId: integer('admin_id').notNull().references(() => users.id),
    actionType: varchar('action_type', { length: 50 }).notNull(),
    targetId: integer('target_id'),
    details: jsonb('details'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

module.exports = { adminActions };
