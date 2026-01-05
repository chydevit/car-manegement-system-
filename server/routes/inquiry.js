const express = require('express');
const { createInquiry, listByUser } = require('../models/inquiry');
const { authRequired } = require('../middleware/auth');
const { findById: findCarById } = require('../models/car');
const { findById: findUserById } = require('../models/user');
const telegramService = require('../services/telegramService');

const router = express.Router();

// Get current user's inquiries
router.get('/', authRequired, async (req, res) => {
    try {
        const inquiries = await listByUser(req.user.id);
        res.json(inquiries);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});

// Publicly submit inquiry (requires login for user identity)
router.post('/', authRequired, async (req, res) => {
    try {
        const { carId, message, type, requestedDate } = req.body;

        const car = await findCarById(carId);
        if (!car) return res.status(404).json({ error: 'Car not found' });

        const inquiry = await createInquiry({
            carId: Number(carId),
            userId: req.user.id,
            sellerId: car.sellerId,
            message,
            type,
            requestedDate,
        });

        // Send Telegram Notification asynchronously
        (async () => {
            try {
                const user = await findUserById(req.user.id);
                // car is already fetched above
                await telegramService.sendInquiryNotification(inquiry, car, user);
            } catch (err) {
                console.error('Failed to send Telegram inquiry notification:', err);
            }
        })();

        res.json(inquiry);
    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({ error: 'Failed to create inquiry' });
    }
});

module.exports = router;
