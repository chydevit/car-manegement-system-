const express = require('express');
const { createReview, listByCar } = require('../models/review');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Get reviews for a car
router.get('/car/:carId', async (req, res) => {
    try {
        const reviews = await listByCar(req.params.carId);
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Submit a review
router.post('/', authRequired, async (req, res) => {
    try {
        const { carId, rating, comment } = req.body;

        if (!carId || !rating || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const review = await createReview({
            carId: Number(carId),
            userId: req.user.id,
            userName: req.user.name || req.user.email,
            rating,
            comment,
        });

        res.json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

module.exports = router;
