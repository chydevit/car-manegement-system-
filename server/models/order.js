const { db } = require('../db');
const { orders } = require('../db/schema');
const { eq } = require('drizzle-orm');

// Create a new order
async function createOrder({ carId, buyerId, sellerId, finalPrice }) {
    try {
        const result = await db
            .insert(orders)
            .values({
                carId: Number(carId),
                buyerId: Number(buyerId),
                sellerId: Number(sellerId),
                finalPrice: String(finalPrice),
                status: 'draft',
                documents: [],
            })
            .returning();

        return result[0];
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

// List orders by seller
async function listBySeller(sellerId) {
    try {
        const result = await db
            .select()
            .from(orders)
            .where(eq(orders.sellerId, Number(sellerId)));

        return result;
    } catch (error) {
        console.error('Error listing orders by seller:', error);
        throw error;
    }
}

// List orders by buyer
async function listByBuyer(buyerId) {
    try {
        const result = await db
            .select()
            .from(orders)
            .where(eq(orders.buyerId, Number(buyerId)));

        return result;
    } catch (error) {
        console.error('Error listing orders by buyer:', error);
        throw error;
    }
}

// Find order by ID
async function findById(id) {
    try {
        const result = await db
            .select()
            .from(orders)
            .where(eq(orders.id, Number(id)))
            .limit(1);

        return result[0] || null;
    } catch (error) {
        console.error('Error finding order by ID:', error);
        throw error;
    }
}

// Update order
async function updateOrder(id, patch) {
    try {
        const result = await db
            .update(orders)
            .set({ ...patch, updatedAt: new Date() })
            .where(eq(orders.id, Number(id)))
            .returning();

        return result[0] || null;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
}

module.exports = {
    createOrder,
    listBySeller,
    listByBuyer,
    findById,
    updateOrder,
};
