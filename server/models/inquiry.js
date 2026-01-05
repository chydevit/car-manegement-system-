const { db } = require('../db');
const { inquiries } = require('../db/schema');
const { eq } = require('drizzle-orm');

// Create a new inquiry
async function createInquiry({ carId, userId, sellerId, message, type = 'general', requestedDate = null }) {
    try {
        const result = await db
            .insert(inquiries)
            .values({
                carId: Number(carId),
                userId: Number(userId),
                sellerId: Number(sellerId),
                message,
                status: 'open',
                type,
                requestedDate,
            })
            .returning();

        return result[0];
    } catch (error) {
        console.error('Error creating inquiry:', error);
        throw error;
    }
}

// List inquiries by seller
async function listBySeller(sellerId) {
    try {
        const result = await db
            .select()
            .from(inquiries)
            .where(eq(inquiries.sellerId, Number(sellerId)));

        return result;
    } catch (error) {
        console.error('Error listing inquiries by seller:', error);
        throw error;
    }
}

// List inquiries by user
async function listByUser(userId) {
    try {
        const result = await db
            .select()
            .from(inquiries)
            .where(eq(inquiries.userId, Number(userId)));

        return result;
    } catch (error) {
        console.error('Error listing inquiries by user:', error);
        throw error;
    }
}

// Update inquiry
async function updateInquiry(id, patch) {
    try {
        const result = await db
            .update(inquiries)
            .set({ ...patch, updatedAt: new Date() })
            .where(eq(inquiries.id, Number(id)))
            .returning();

        return result[0] || null;
    } catch (error) {
        console.error('Error updating inquiry:', error);
        throw error;
    }
}

module.exports = {
    createInquiry,
    listBySeller,
    listByUser,
    updateInquiry,
};
