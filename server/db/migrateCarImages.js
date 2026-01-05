const { db } = require('./index');
const { cars, carImages } = require('./schema');
const { sql } = require('drizzle-orm');

async function migrateCarImages() {
    console.log('🔄 Migrating existing car images to car_images table...');

    try {
        // Get all cars that have an image
        const carsWithImages = await db
            .select()
            .from(cars)
            .where(sql`${cars.image} IS NOT NULL AND ${cars.image} != ''`);

        console.log(`Found ${carsWithImages.length} cars with images to migrate`);

        let migratedCount = 0;

        for (const car of carsWithImages) {
            // Check if this car already has images in car_images table
            const existingImages = await db
                .select()
                .from(carImages)
                .where(sql`${carImages.carId} = ${car.id}`);

            if (existingImages.length === 0) {
                // Insert the image as primary with display_order 0
                await db.insert(carImages).values({
                    carId: car.id,
                    imageUrl: car.image,
                    isPrimary: true,
                    displayOrder: 0,
                });
                migratedCount++;
            }
        }

        console.log(`✅ Successfully migrated ${migratedCount} car images`);
        console.log(`ℹ️  Skipped ${carsWithImages.length - migratedCount} cars (already had images in car_images table)`);

    } catch (error) {
        console.error('❌ Error migrating car images:', error);
        throw error;
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    migrateCarImages()
        .then(() => {
            console.log('Migration completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}

module.exports = { migrateCarImages };
