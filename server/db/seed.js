const { db } = require('./index');
const { users, cars } = require('./schema');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

async function seed() {
    console.log('🌱 Starting database seeding...');

    try {
        // Seed default users
        console.log('Creating default users...');

        const salt = await bcrypt.genSalt(10);

        const adminHash = await bcrypt.hash('admin123', salt);
        const sellerHash = await bcrypt.hash('seller123', salt);
        const userHash = await bcrypt.hash('user123', salt);

        const seededUsers = await db
            .insert(users)
            .values([
                {
                    name: 'Admin User',
                    email: 'admin@example.com',
                    passwordHash: adminHash,
                    role: 'admin',
                    isActive: true,
                    phone: '+1-555-0100',
                    address: '123 Admin Street, Admin City, AC 12345',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin User',
                },
                {
                    name: 'Seller User',
                    email: 'seller@example.com',
                    passwordHash: sellerHash,
                    role: 'seller',
                    isActive: true,
                    phone: '+1-555-0200',
                    address: '456 Seller Avenue, Seller Town, ST 23456',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Seller User',
                },
                {
                    name: 'Regular User',
                    email: 'user@example.com',
                    passwordHash: userHash,
                    role: 'user',
                    isActive: true,
                    phone: '+1-555-0300',
                    address: '789 User Boulevard, User City, UC 34567',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Regular User',
                },
            ])
            .returning();

        console.log(`✅ Created ${seededUsers.length} users`);

        // Find seller user for car listings
        const seller = seededUsers.find(u => u.role === 'seller');

        if (seller) {
            console.log('Creating sample car listings...');

            const seededCars = await db
                .insert(cars)
                .values([
                    {
                        title: 'Aura GT-S Concept',
                        price: '185000',
                        description: 'A sleek modern luxury sports car with a silver metallic finish and aerodynamic carbon fiber body. Zero to sixty in 2.8 seconds.',
                        sellerId: seller.id,
                        brand: 'Aura',
                        model: 'GT-S',
                        year: 2024,
                        fuelType: 'Electric',
                        status: 'available',
                        image: '/images/car1.png',
                    },
                    {
                        title: 'Mountain Defender Pro',
                        price: '74900',
                        description: 'A rugged modern off-road SUV in deep blue. Equipped with terrain response systems and adventure-ready gear. Perfect for the unknown path.',
                        sellerId: seller.id,
                        brand: 'Defender',
                        model: 'Pro',
                        year: 2023,
                        fuelType: 'Gasoline',
                        status: 'available',
                        image: '/images/car2.png',
                    },
                    {
                        title: 'Lunar Lucid Sedan',
                        price: '92000',
                        description: 'A futuristic electric sedan in pearl white. Offers autonomous driving capabilities and a minimalist Scandinavian interior. Experience the future of mobility.',
                        sellerId: seller.id,
                        brand: 'Lunar',
                        model: 'Lucid',
                        year: 2024,
                        fuelType: 'Electric',
                        status: 'available',
                        image: '/images/car3.png',
                    },
                ])
                .returning();

            console.log(`✅ Created ${seededCars.length} sample cars`);
        }

        console.log('✅ Database seeding completed successfully!');
        console.log('\nDefault accounts:');
        console.log('  Admin:  admin@example.com / admin123');
        console.log('  Seller: seller@example.com / seller123');
        console.log('  User:   user@example.com / user123');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

seed();
