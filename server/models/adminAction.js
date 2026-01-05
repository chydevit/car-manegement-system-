const { db } = require('../db');
const { adminActions, users } = require('../db/schema');
const { eq, and, gte, lte, desc } = require('drizzle-orm');

// Log an admin action
async function logAdminAction(adminId, actionType, targetId = null, details = null) {
    try {
        const result = await db
            .insert(adminActions)
            .values({
                adminId: Number(adminId),
                actionType,
                targetId: targetId ? Number(targetId) : null,
                details,
            })
            .returning();

        return result[0];
    } catch (error) {
        console.error('Error logging admin action:', error);
        throw error;
    }
}

// Get admin actions with optional filters
async function getAdminActions(filters = {}) {
    try {
        const { actionType, startDate, endDate, limit = 50, offset = 0 } = filters;

        let query = db.select().from(adminActions);

        // Apply filters
        const conditions = [];
        if (actionType) {
            conditions.push(eq(adminActions.actionType, actionType));
        }
        if (startDate) {
            conditions.push(gte(adminActions.createdAt, new Date(startDate)));
        }
        if (endDate) {
            conditions.push(lte(adminActions.createdAt, new Date(endDate)));
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions));
        }

        // Order by most recent first
        query = query.orderBy(desc(adminActions.createdAt));

        // Apply pagination
        query = query.limit(limit).offset(offset);

        const result = await query;
        return result;
    } catch (error) {
        console.error('Error getting admin actions:', error);
        throw error;
    }
}

// Get admin actions with user details (admin name, target user name)
async function getAdminActionsWithDetails(filters = {}) {
    try {
        const actions = await getAdminActions(filters);

        // Fetch user details for each action
        const actionsWithDetails = await Promise.all(
            actions.map(async (action) => {
                // Get admin user details
                const adminUser = await db
                    .select({ id: users.id, name: users.name, email: users.email })
                    .from(users)
                    .where(eq(users.id, action.adminId))
                    .limit(1);

                // Get target user details if targetId exists
                let targetUser = null;
                if (action.targetId) {
                    const target = await db
                        .select({ id: users.id, name: users.name, email: users.email, role: users.role })
                        .from(users)
                        .where(eq(users.id, action.targetId))
                        .limit(1);
                    targetUser = target[0] || null;
                }

                return {
                    ...action,
                    admin: adminUser[0] || null,
                    targetUser,
                };
            })
        );

        return actionsWithDetails;
    } catch (error) {
        console.error('Error getting admin actions with details:', error);
        throw error;
    }
}

module.exports = {
    logAdminAction,
    getAdminActions,
    getAdminActionsWithDetails,
};
