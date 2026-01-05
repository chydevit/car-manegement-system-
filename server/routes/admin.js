const express = require('express');
const { listUsers, createUser, findById, updateUser } = require('../models/user');
const { listCars, findById: findCarById, updateCar } = require('../models/car');
const { adminRequired } = require('../middleware/auth');
const { generateSecurePassword, validatePasswordStrength } = require('../utils/passwordGenerator');
const { logAdminAction, getAdminActionsWithDetails } = require('../models/adminAction');

const router = express.Router();

// Apply adminRequired to all routes in this router
router.use(adminRequired);

/**
 * USER MANAGEMENT
 */

// List all users
router.get('/users', async (req, res) => {
    try {
        const users = await listUsers();
        res.json(users);
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Create admin or seller
router.post('/users', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!['admin', 'seller', 'user'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        const user = await createUser({ name, email, password, role });
        res.json(user);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create seller account (dedicated endpoint with password generation)
router.post('/sellers', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Generate password if not provided
        let finalPassword = password;
        let generatedPassword = null;

        if (!finalPassword) {
            finalPassword = generateSecurePassword(12);
            generatedPassword = finalPassword;
        } else {
            // Validate provided password
            const validation = validatePasswordStrength(finalPassword);
            if (!validation.isValid) {
                return res.status(400).json({
                    error: 'Password does not meet strength requirements',
                    details: validation.errors
                });
            }
        }

        // Create seller user
        const seller = await createUser({
            name,
            email,
            password: finalPassword,
            role: 'seller',
            phone,
            address,
            isActive: true,
        });

        // Log admin action
        await logAdminAction(
            req.user.id,
            'create_seller',
            seller.id,
            {
                sellerEmail: email,
                sellerName: name,
                passwordGenerated: !!generatedPassword,
            }
        );

        // Return seller info (without password hash) and temporary password if generated
        const response = {
            message: 'Seller account created successfully',
            seller: {
                id: seller.id,
                name: seller.name,
                email: seller.email,
                role: seller.role,
                phone: seller.phone,
                address: seller.address,
                isActive: seller.isActive,
            },
        };

        if (generatedPassword) {
            response.temporaryPassword = generatedPassword;
            response.note = 'Please share this password with the seller. It will not be shown again.';
        }

        res.status(201).json(response);
    } catch (error) {
        console.error('Error creating seller:', error);

        // Handle duplicate email error
        if (error.message && error.message.includes('duplicate') || error.message.includes('unique')) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        res.status(500).json({ error: 'Failed to create seller account' });
    }
});

// Update user (including isActive status)
router.patch('/users/:id', async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

/**
 * CAR MANAGEMENT
 */

// List all cars (global view)
router.get('/cars', async (req, res) => {
    try {
        const cars = await listCars();
        res.json(cars);
    } catch (error) {
        console.error('Error listing cars:', error);
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
});

// Approve or reject listing
router.patch('/cars/:id/approval', async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        if (!['approved', 'rejected', 'available'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Map 'approved' to 'available' for public visibility if that's the logic
        const finalStatus = status === 'approved' ? 'available' : status;

        const car = await updateCar(req.params.id, { status: finalStatus, rejectionReason });
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.json(car);
    } catch (error) {
        console.error('Error updating car approval:', error);
        res.status(500).json({ error: 'Failed to update car approval' });
    }
});

/**
 * AUDIT LOG
 */

// Get admin actions audit log
router.get('/actions', async (req, res) => {
    try {
        const { actionType, startDate, endDate, limit, offset } = req.query;

        const filters = {
            actionType,
            startDate,
            endDate,
            limit: limit ? parseInt(limit) : 50,
            offset: offset ? parseInt(offset) : 0,
        };

        const actions = await getAdminActionsWithDetails(filters);

        res.json({
            actions,
            pagination: {
                limit: filters.limit,
                offset: filters.offset,
            },
        });
    } catch (error) {
        console.error('Error fetching admin actions:', error);
        res.status(500).json({ error: 'Failed to fetch audit log' });
    }
});

/**
 * SETTINGS & REPORTS (Stubs for now)
 */

router.get('/reports/sales', (req, res) => {
    // Mock data for now
    res.json({
        totalRevenue: 351900,
        totalSales: 3,
        sellerPerformance: [
            { name: 'Seller User', sales: 3, revenue: 351900, listings: 3 },
        ],
        recentTransactions: [
            { id: 1, car: 'Aura GT-S Concept', price: 185000, date: new Date(), buyer: 'John Doe' },
            { id: 2, car: 'Mountain Defender Pro', price: 74900, date: new Date(), buyer: 'Jane Smith' },
            { id: 3, car: 'Lunar Lucid Sedan', price: 92000, date: new Date(), buyer: 'Bob Wilson' },
        ],
    });
});

module.exports = router;
