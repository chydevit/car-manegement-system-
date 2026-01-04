const express = require("express");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

// Mock store for favorites: { userId: [carId1, carId2] }
const userFavorites = {};

router.get("/", authRequired, (req, res) => {
    const favorites = userFavorites[req.user.id] || [];
    res.json(favorites);
});

router.post("/toggle", authRequired, (req, res) => {
    const { carId } = req.body;
    if (!userFavorites[req.user.id]) {
        userFavorites[req.user.id] = [];
    }

    const index = userFavorites[req.user.id].indexOf(Number(carId));
    if (index === -1) {
        userFavorites[req.user.id].push(Number(carId));
        res.json({ status: "added", favorites: userFavorites[req.user.id] });
    } else {
        userFavorites[req.user.id].splice(index, 1);
        res.json({ status: "removed", favorites: userFavorites[req.user.id] });
    }
});

module.exports = router;
