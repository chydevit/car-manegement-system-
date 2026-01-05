const express = require('express');
const { listBySeller: listInquiries, createInquiry, updateInquiry } = require('../models/inquiry');
const { listBySeller: listOrders, createOrder, updateOrder, findById: findOrderById } = require('../models/order');
const { updateCar, findById: findCarById } = require('../models/car');
const { authRequired, rolesAllowed } = require('../middleware/auth');

const router = express.Router();

// Apply seller or admin restriction to all routes here
router.use(authRequired, rolesAllowed('seller', 'admin'));

/**
 * CUSTOMER ENGAGEMENT (INQUIRIES)
 */

router.get('/inquiries', async (req, res) => {
    try {
        const inquiries = await listInquiries(req.user.id);
        res.json(inquiries);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});

router.patch('/inquiries/:id', async (req, res) => {
    try {
        const inquiry = await updateInquiry(req.params.id, req.body);
        if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
        if (inquiry.sellerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.json(inquiry);
    } catch (error) {
        console.error('Error updating inquiry:', error);
        res.status(500).json({ error: 'Failed to update inquiry' });
    }
});

/**
 * SALES PROCESSING (ORDERS)
 */

router.get('/orders', async (req, res) => {
    try {
        const orders = await listOrders(req.user.id);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

router.post('/orders', async (req, res) => {
    try {
        const { carId, buyerId, finalPrice } = req.body;

        // Verify ownership
        const car = await findCarById(carId);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        if (car.sellerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const order = await createOrder({
            carId: Number(carId),
            buyerId: Number(buyerId),
            sellerId: req.user.id,
            finalPrice: Number(finalPrice),
        });

        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

router.patch('/orders/:id', async (req, res) => {
    try {
        const order = await updateOrder(req.params.id, req.body);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (order.sellerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // If order is completed, mark car as sold
        if (req.body.status === 'completed') {
            await updateCar(order.carId, { status: 'sold' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

/**
 * INVENTORY STATUS CONTROL
 */

router.patch('/inventory/:id/status', async (req, res) => {
    try {
        const car = await findCarById(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        if (car.sellerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const { status } = req.body;
        if (!['available', 'reserved', 'sold'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updated = await updateCar(req.params.id, { status });
        res.json(updated);
    } catch (error) {
        console.error('Error updating car status:', error);
        res.status(500).json({ error: 'Failed to update car status' });
    }
});

/**
 * METRICS & REPORTS
 */

router.get('/reports', async (req, res) => {
    try {
        const sellerOrders = await listOrders(req.user.id);
        const completedOrders = sellerOrders.filter(o => o.status === 'completed');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.finalPrice), 0);
        const totalSales = completedOrders.length;

        // Weekly aggregation mock
        const weeklyData = [
            { week: 'W1', sales: 2, revenue: 120000 },
            { week: 'W2', sales: totalSales, revenue: totalRevenue },
        ];

        res.json({
            totalRevenue,
            totalSales,
            weeklyData,
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

module.exports = router;
