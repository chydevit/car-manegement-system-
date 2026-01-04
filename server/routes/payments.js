const express = require("express");
const { authRequired } = require("../middleware/auth");
const { updateCar, findById } = require("../models/car");

const router = express.Router();

// Mock store for orders
const orders = [];
let orderIdSeq = 1;

router.post("/checkout", authRequired, (req, res) => {
    const { carId } = req.body;
    const car = findById(carId);

    if (!car) return res.status(404).json({ error: "Car not found" });
    if (car.status !== "available") return res.status(400).json({ error: "Car already sold" });
    if (req.user.role === "admin" || req.user.role === "seller") return res.status(403).json({ error: "Only buyers can purchase vehicles" });

    // Create order
    const order = {
        id: orderIdSeq++,
        carId: car.id,
        userId: req.user.id,
        amount: car.price,
        status: "pending_payment",
        timestamp: new Date()
    };

    orders.push(order);
    res.json({ message: "Order created", order });
});

router.post("/confirm-payment", authRequired, (req, res) => {
    const { orderId } = req.body;
    const order = orders.find(o => o.id === Number(orderId));

    if (!order) return res.status(404).json({ error: "Order not found" });

    // Mark car as sold
    updateCar(order.carId, { status: "sold" });
    order.status = "paid";

    res.json({ message: "Payment confirmed", order });
});

router.get("/my-orders", authRequired, (req, res) => {
    const userOrders = orders.filter(o => o.userId === req.user.id && o.status === "paid");
    res.json(userOrders);
});

module.exports = router;
