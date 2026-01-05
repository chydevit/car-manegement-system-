const express = require("express");
const { authRequired } = require("../middleware/auth");
const { updateCar, findById: findCarById } = require("../models/car");
const { createOrder, updateOrder, findById: findOrderById, listByBuyer } = require("../models/order");
const { findById: findUserById } = require("../models/user");
const telegramService = require("../services/telegramService");

const router = express.Router();

router.post("/checkout", authRequired, async (req, res) => {
    try {
        const { carId } = req.body;
        const car = await findCarById(carId);

        if (!car) return res.status(404).json({ error: "Car not found" });
        if (car.status !== "available") return res.status(400).json({ error: "Car already sold or not available" });
        if (req.user.role === "admin" || req.user.role === "seller") {
            return res.status(403).json({ error: "Only buyers can purchase vehicles" });
        }

        // Create order in database
        const order = await createOrder({
            carId: car.id,
            buyerId: req.user.id,
            sellerId: car.sellerId,
            finalPrice: car.price,
        });

        // Update order to pending payment
        const updatedOrder = await updateOrder(order.id, { status: "pending_payment" });

        res.json({ message: "Order created", order: updatedOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
});

router.post("/confirm-payment", authRequired, async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await findOrderById(orderId);

        if (!order) return res.status(404).json({ error: "Order not found" });
        if (order.buyerId !== req.user.id) return res.status(403).json({ error: "Not authorized" });

        // Update car status
        await updateCar(order.carId, { status: "sold" });

        // Update order status
        const updatedOrder = await updateOrder(order.id, { status: "paid" });

        // Send Telegram notification asynchronously
        (async () => {
            try {
                // Fetch full details for notification
                const car = await findCarById(order.carId);
                const buyer = await findUserById(order.buyerId);
                const seller = await findUserById(order.sellerId);

                const orderDetails = {
                    ...updatedOrder,
                    car,
                    buyer,
                    seller,
                };

                await telegramService.sendPaymentNotification(orderDetails);
            } catch (err) {
                console.error("Error sending Telegram notification:", err);
            }
        })();

        res.json({ message: "Payment confirmed", order: updatedOrder });
    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ error: "Failed to confirm payment" });
    }
});

router.get("/my-orders", authRequired, async (req, res) => {
    try {
        const userOrders = await listByBuyer(req.user.id);

        // Enhance orders with car details
        const ordersWithDetails = await Promise.all(userOrders.map(async (order) => {
            const car = await findCarById(order.carId);
            return { ...order, car };
        }));

        res.json(ordersWithDetails);
    } catch (error) {
        console.error("Error listing my orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

module.exports = router;
