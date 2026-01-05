const { db } = require('../db');
const { favorites } = require('../db/schema');
const { eq, and } = require('drizzle-orm');

// Add a car to favorites
async function addFavorite({ userId, carId }) {
    try {
        const result = await db
            .insert(favorites)
            .values({
                userId: Number(userId),
                carId: Number(carId),
            })
            .returning();

        return result[0];
    } catch (error) {
        // If duplicate, return existing favorite
        if (error.code === '23505') {
            const existing = await db
                .select()
                .from(favorites)
                .where(and(
                    eq(favorites.userId, Number(userId)),
                    eq(favorites.carId, Number(carId))
                ))
                .limit(1);

            return existing[0];
        }
        console.error('Error adding favorite:', error);
        throw error;
    }
}

// Remove a car from favorites
async function removeFavorite({ userId, carId }) {
    try {
        const result = await db
            .delete(favorites)
            .where(and(
                eq(favorites.userId, Number(userId)),
                eq(favorites.carId, Number(carId))
            ))
            .returning();

        return result.length > 0;
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
}

// List all favorites for a user
async function listByUser(userId) {
    try {
        const result = await db
            .select()
            .from(favorites)
            .where(eq(favorites.userId, Number(userId)));

        return result;
    } catch (error) {
        console.error('Error listing favorites by user:', error);
        throw error;
    }
}

// Check if a car is favorited by a user
async function isFavorite({ userId, carId }) {
    try {
        const result = await db
            .select()
            .from(favorites)
            .where(and(
                eq(favorites.userId, Number(userId)),
                eq(favorites.carId, Number(carId))
            ))
            .limit(1);

        return result.length > 0;
    } catch (error) {
        console.error('Error checking favorite status:', error);
        throw error;
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    listByUser,
    isFavorite,
};
