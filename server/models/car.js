// Simple in-memory car store
const cars = []; // { id, title, price, description, sellerId, status }
let idSeq = 1;

function createCar({ title, price, description, sellerId }) {
  const car = {
    id: idSeq++,
    title,
    price,
    description,
    sellerId,
    status: "available",
  };
  cars.push(car);
  return car;
}

function listCars() {
  return cars;
}

function findById(id) {
  return cars.find((c) => c.id === Number(id));
}

function updateCar(id, patch) {
  const car = findById(id);
  if (!car) return null;
  Object.assign(car, patch);
  return car;
}

function deleteCar(id) {
  const index = cars.findIndex((c) => c.id === Number(id));
  if (index === -1) return false;
  cars.splice(index, 1);
  return true;
}

module.exports = { createCar, listCars, findById, updateCar, deleteCar };

// Seed default cars for testing
createCar({
  title: "Aura GT-S Concept",
  price: 185000,
  description: "A sleek modern luxury sports car with a silver metallic finish and aerodynamic carbon fiber body. Zero to sixty in 2.8 seconds.",
  sellerId: 2,
});
createCar({
  title: "Mountain Defender Pro",
  price: 74900,
  description: "A rugged modern off-road SUV in deep blue. Equipped with terrain response systems and adventure-ready gear. Perfect for the unknown path.",
  sellerId: 2,
});
createCar({
  title: "Lunar Lucid Sedan",
  price: 92000,
  description: "A futuristic electric sedan in pearl white. Offers autonomous driving capabilities and a minimalist Scandinavian interior. Experience the future of mobility.",
  sellerId: 2,
});

// Map local images to the seeded cars (since IDs are 1, 2, 3)
const fs = require('fs');
const carData = listCars();
if (carData[0]) carData[0].image = "/images/car1.png";
if (carData[1]) carData[1].image = "/images/car2.png";
if (carData[2]) carData[2].image = "/images/car3.png";
