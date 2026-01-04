const express = require("express");
const { listUsers } = require("../models/user");
const { authRequired, rolesAllowed } = require("../middleware/auth");

const router = express.Router();

// Admin-only: list users
router.get("/", authRequired, rolesAllowed("admin"), (req, res) => {
  res.json(listUsers());
});

module.exports = router;
