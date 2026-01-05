const { db } = require('../db');
const { cars, carImages } = require('../db/schema');
const { eq, and } = require('drizzle-orm');

// Create a new car listing
async function createCar({ title, price, description, sellerId, brand, model, year, fuelType, image, status = 'pending' }) {
  try {
    const result = await db
      .insert(cars)
      .values({
        title,
        price: String(price),
        description,
        sellerId: Number(sellerId),
        status,
        brand,
        model,
        year: year ? Number(year) : null,
        fuelType,
        image,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error creating car:', error);
    throw error;
  }
}

// List all cars with primary images
async function listCars() {
  try {
    const allCars = await db.select().from(cars);

    // Fetch primary image for each car
    const carsWithImages = await Promise.all(
      allCars.map(async (car) => {
        const primaryImage = await db
          .select()
          .from(carImages)
          .where(and(
            eq(carImages.carId, car.id),
            eq(carImages.isPrimary, true)
          ))
          .limit(1);

        return {
          ...car,
          primaryImage: primaryImage[0] || null,
        };
      })
    );

    return carsWithImages;
  } catch (error) {
    console.error('Error listing cars:', error);
    throw error;
  }
}

// Find car by ID with all images
async function findById(id) {
  try {
    const result = await db
      .select()
      .from(cars)
      .where(eq(cars.id, Number(id)))
      .limit(1);

    if (!result[0]) return null;

    // Fetch all images for this car
    const images = await db
      .select()
      .from(carImages)
      .where(eq(carImages.carId, Number(id)))
      .orderBy(carImages.displayOrder);

    return {
      ...result[0],
      images: images || [],
    };
  } catch (error) {
    console.error('Error finding car by ID:', error);
    throw error;
  }
}

// Get car with all images (helper function)
async function getCarWithImages(id) {
  return findById(id);
}

// Update car
async function updateCar(id, patch) {
  try {
    const result = await db
      .update(cars)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(cars.id, Number(id)))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
}

// Delete car
async function deleteCar(id) {
  try {
    const result = await db
      .delete(cars)
      .where(eq(cars.id, Number(id)))
      .returning();

    return result.length > 0;
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
}

module.exports = {
  createCar,
  listCars,
  findById,
  getCarWithImages,
  updateCar,
  deleteCar,
};
