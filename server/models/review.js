const { db } = require('../db');
const { reviews } = require('../db/schema');
const { eq } = require('drizzle-orm');

// Create a new review
async function createReview({ carId, userId, userName, rating, comment }) {
    try {
        const result = await db
            .insert(reviews)
            .values({
                carId: Number(carId),
                userId: Number(userId),
                userName,
                rating: Number(rating),
                comment,
            })
            .returning();

        return result[0];
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
}

// List reviews by car
async function listByCar(carId) {
    try {
        const result = await db
            .select()
            .from(reviews)
            .where(eq(reviews.carId, Number(carId)));

        return result;
    } catch (error) {
        console.error('Error listing reviews by car:', error);
        throw error;
    }
}

module.exports = {
    createReview,
    listByCar,
};
