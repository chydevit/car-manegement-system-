const express = require("express");
const { createCar, listCars, findById, updateCar, deleteCar } = require("../models/car");
const { authRequired, rolesAllowed } = require("../middleware/auth");

const router = express.Router();

// Public: list cars
router.get("/", (req, res) => {
  res.json(listCars());
});

// Public: get car by ID
router.get("/:id", (req, res) => {
  const car = findById(req.params.id);
  if (!car) return res.status(404).json({ error: "Not found" });
  res.json(car);
});

// Create car (seller or admin)
router.post("/", authRequired, rolesAllowed("seller", "admin"), (req, res) => {
  const { title, price, description } = req.body;
  const car = createCar({ title, price, description, sellerId: req.user.id });
  res.json(car);
});

// Seller can update their car, admin can update any
router.put("/:id", authRequired, (req, res) => {
  const car = findById(req.params.id);
  if (!car) return res.status(404).json({ error: "Not found" });
  if (req.user.role !== "admin" && car.sellerId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });
  const updated = updateCar(req.params.id, req.body);
  res.json(updated);
});

// Delete car (seller self or admin)
router.delete("/:id", authRequired, (req, res) => {
  const car = findById(req.params.id);
  if (!car) return res.status(404).json({ error: "Not found" });
  if (req.user.role !== "admin" && car.sellerId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });
  deleteCar(req.params.id);
  res.json({ message: "Car listing removed" });
});

module.exports = router;
