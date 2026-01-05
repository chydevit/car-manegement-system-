// Server updated: force restart
require('dotenv').config({ path: '../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const carImageRoutes = require('./routes/carImages');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const favoriteRoutes = require('./routes/favorites');
const adminRoutes = require('./routes/admin');
const sellerRoutes = require('./routes/seller');
const publicInquiryRoutes = require('./routes/inquiry');
const reviewRoutes = require('./routes/review');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/ping', async (req, res) => {
    try {
        const { db } = require('./db');
        const { sql } = require('drizzle-orm');

        // Test database connection
        await db.execute(sql`SELECT 1`);

        res.json({
            status: 'alive',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({
            status: 'degraded',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/cars', carImageRoutes); // Car images routes
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/inquiries', publicInquiryRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/ping`);
    console.log(`💾 Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
});
