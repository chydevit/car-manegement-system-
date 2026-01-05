const express = require('express');
const { createCar, listCars, findById, updateCar, deleteCar } = require('../models/car');
const { authRequired, rolesAllowed } = require('../middleware/auth');

const router = express.Router();

// Public: list cars
router.get('/', async (req, res) => {
  try {
    const cars = await listCars();
    res.json(cars);
  } catch (error) {
    console.error('Error listing cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// Public: get car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Not found' });
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

// Create car (seller or admin)
router.post('/', authRequired, rolesAllowed('seller', 'admin'), async (req, res) => {
  try {
    const { title, price, description, brand, model, year, fuelType, image } = req.body;
    const car = await createCar({
      title,
      price: Number(price),
      description,
      sellerId: req.user.id,
      brand,
      model,
      year: year ? Number(year) : null,
      fuelType,
      image,
    });
    res.json(car);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ error: 'Failed to create car' });
  }
});

// Seller can update their car, admin can update any
router.put('/:id', authRequired, async (req, res) => {
  try {
    const car = await findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' && car.sellerId !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });
    const updated = await updateCar(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ error: 'Failed to update car' });
  }
});

// Delete car (seller self or admin)
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const car = await findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' && car.sellerId !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });
    await deleteCar(req.params.id);
    res.json({ message: 'Car listing removed' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

module.exports = router;
