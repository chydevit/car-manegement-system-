const express = require('express');
const { listUsers, updateUser, findById } = require('../models/user');
const { authRequired, rolesAllowed } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/profile', authRequired, async (req, res) => {
  try {
    const user = await findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.patch('/profile', authRequired, async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const updated = await updateUser(req.user.id, { name, phone, address, avatar });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Admin-only: list users
router.get('/', authRequired, rolesAllowed('admin'), async (req, res) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
