const express = require('express');
const { authRequired } = require('../middleware/auth');
const favoriteModel = require('../models/favorite');

const router = express.Router();

// Get all favorites for the current user
router.get('/', authRequired, async (req, res) => {
    try {
        const favorites = await favoriteModel.listByUser(req.user.id);
        // Return just the car IDs for backward compatibility
        const carIds = favorites.map(f => f.carId);
        res.json(carIds);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// Toggle a car in favorites
router.post('/toggle', authRequired, async (req, res) => {
    try {
        const { carId } = req.body;

        if (!carId) {
            return res.status(400).json({ error: 'carId is required' });
        }

        // Check if already favorited
        const isFav = await favoriteModel.isFavorite({
            userId: req.user.id,
            carId: Number(carId),
        });

        let status;
        if (isFav) {
            await favoriteModel.removeFavorite({
                userId: req.user.id,
                carId: Number(carId),
            });
            status = 'removed';
        } else {
            await favoriteModel.addFavorite({
                userId: req.user.id,
                carId: Number(carId),
            });
            status = 'added';
        }

        // Get updated favorites list
        const favorites = await favoriteModel.listByUser(req.user.id);
        const carIds = favorites.map(f => f.carId);

        res.json({ status, favorites: carIds });
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ error: 'Failed to toggle favorite' });
    }
});

module.exports = router;
