const { db } = require('../db');
const { carImages } = require('../db/schema');
const { eq, and, sql } = require('drizzle-orm');

// Create a new car image
async function createCarImage(carId, imageUrl, isPrimary = false, displayOrder = 0) {
    try {
        const result = await db
            .insert(carImages)
            .values({
                carId: Number(carId),
                imageUrl,
                isPrimary,
                displayOrder,
            })
            .returning();

        return result[0];
    } catch (error) {
        console.error('Error creating car image:', error);
        throw error;
    }
}

// Get all images for a car, ordered by display_order
async function getCarImages(carId) {
    try {
        const result = await db
            .select()
            .from(carImages)
            .where(eq(carImages.carId, Number(carId)))
            .orderBy(carImages.displayOrder);

        return result;
    } catch (error) {
        console.error('Error getting car images:', error);
        throw error;
    }
}

// Update car image
async function updateCarImage(imageId, patch) {
    try {
        const result = await db
            .update(carImages)
            .set({ ...patch, updatedAt: new Date() })
            .where(eq(carImages.id, Number(imageId)))
            .returning();

        return result[0] || null;
    } catch (error) {
        console.error('Error updating car image:', error);
        throw error;
    }
}

// Delete car image
async function deleteCarImage(imageId) {
    try {
        const result = await db
            .delete(carImages)
            .where(eq(carImages.id, Number(imageId)))
            .returning();

        return result.length > 0;
    } catch (error) {
        console.error('Error deleting car image:', error);
        throw error;
    }
}

// Set primary image for a car (unsets all others)
async function setPrimaryImage(carId, imageId) {
    try {
        // First, unset all primary images for this car
        await db
            .update(carImages)
            .set({ isPrimary: false, updatedAt: new Date() })
            .where(eq(carImages.carId, Number(carId)));

        // Then set the specified image as primary
        const result = await db
            .update(carImages)
            .set({ isPrimary: true, updatedAt: new Date() })
            .where(and(
                eq(carImages.id, Number(imageId)),
                eq(carImages.carId, Number(carId))
            ))
            .returning();

        return result[0] || null;
    } catch (error) {
        console.error('Error setting primary image:', error);
        throw error;
    }
}

// Get primary image for a car
async function getPrimaryImage(carId) {
    try {
        const result = await db
            .select()
            .from(carImages)
            .where(and(
                eq(carImages.carId, Number(carId)),
                eq(carImages.isPrimary, true)
            ))
            .limit(1);

        return result[0] || null;
    } catch (error) {
        console.error('Error getting primary image:', error);
        throw error;
    }
}

module.exports = {
    createCarImage,
    getCarImages,
    updateCarImage,
    deleteCarImage,
    setPrimaryImage,
    getPrimaryImage,
};
