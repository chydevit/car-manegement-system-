const express = require("express");
const jwt = require("jsonwebtoken");
const { createUser, validateUser, findByEmail } = require("../models/user");
const { SECRET } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await findByEmail(email);
  if (existing) return res.status(400).json({ error: "Email used" });
  const user = await createUser({ name, email, password, role });
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    SECRET
  );
  res.json({ user, token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);
  const user = await validateUser(email, password);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    SECRET
  );
  res.json({ user, token });
});

module.exports = router;
