# Database Integration Guide

## Overview
This application uses PostgreSQL with Drizzle ORM for data persistence. All data is now stored in a relational database instead of in-memory arrays.

## Prerequisites
- PostgreSQL 12 or higher installed and running
- Node.js 16 or higher

## Database Setup

### 1. Install PostgreSQL
If you haven't already, install PostgreSQL:
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

### 2. Start PostgreSQL Service
Make sure PostgreSQL is running:
- **Windows**: Start the PostgreSQL service from Services
- **Mac/Linux**: `sudo service postgresql start`

### 3. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cms;

# Exit psql
\q
```

### 4. Configure Environment Variables
The `.env` file in the root directory should contain:
```
DATABASE_URL=postgresql://postgresql:517170@localhost:5432/cms
JWT_SECRET=your-secret-key-change-in-production
PORT=4000
```

Update the `DATABASE_URL` with your PostgreSQL credentials if different.

### 5. Install Dependencies
```bash
cd server
npm install
```

### 6. Run Migrations
Apply the database schema:
```bash
npm run db:migrate
```

This will create all necessary tables (users, cars, orders, inquiries, reviews, favorites).

### 7. Seed Initial Data
Populate the database with default users and sample cars:
```bash
npm run db:seed
```

This creates:
- **Admin**: admin@example.com / admin123
- **Seller**: seller@example.com / seller123
- **User**: user@example.com / user123
- 3 sample car listings

### 8. Start the Server
```bash
npm run dev
```

## Database Schema

### Users Table
- `id`: Serial primary key
- `name`: User's full name
- `email`: Unique email address
- `passwordHash`: Bcrypt hashed password
- `role`: 'user', 'seller', or 'admin'
- `isActive`: Account status
- `lastLogin`: Last login timestamp
- `phone`, `address`, `avatar`: Profile information
- `createdAt`, `updatedAt`: Timestamps

### Cars Table
- `id`: Serial primary key
- `title`: Car listing title
- `price`: Decimal price
- `description`: Car description
- `sellerId`: Foreign key to users
- `status`: 'pending', 'available', 'reserved', 'sold'
- `brand`, `model`, `year`, `fuelType`: Car details
- `image`: Image URL
- `createdAt`, `updatedAt`: Timestamps

### Orders Table
- `id`: Serial primary key
- `carId`: Foreign key to cars
- `buyerId`: Foreign key to users (buyer)
- `sellerId`: Foreign key to users (seller)
- `finalPrice`: Negotiated price
- `status`: 'draft', 'pending', 'completed', 'cancelled'
- `documents`: JSONB array of documents
- `createdAt`, `updatedAt`: Timestamps

### Inquiries Table
- `id`: Serial primary key
- `carId`: Foreign key to cars
- `userId`: Foreign key to users (inquirer)
- `sellerId`: Foreign key to users (seller)
- `message`: Inquiry message
- `status`: 'open', 'closed'
- `type`: 'general', 'test_drive'
- `requestedDate`: Date for test drive
- `createdAt`, `updatedAt`: Timestamps

### Reviews Table
- `id`: Serial primary key
- `carId`: Foreign key to cars
- `userId`: Foreign key to users
- `userName`: Reviewer name
- `rating`: Integer 1-5
- `comment`: Review text
- `createdAt`: Timestamp

### Favorites Table
- `id`: Serial primary key
- `userId`: Foreign key to users
- `carId`: Foreign key to cars
- `createdAt`: Timestamp
- Unique constraint on (userId, carId)

## Available Scripts

### Database Management
- `npm run db:generate` - Generate new migration from schema changes
- `npm run db:migrate` - Run pending migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Drizzle Studio (database GUI)

### Development
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Drizzle Studio
To visually inspect and manage your database:
```bash
npm run db:studio
```

This opens a web interface at `https://local.drizzle.studio`

## Troubleshooting

### Connection Refused Error
If you see `ECONNREFUSED` error:
1. Verify PostgreSQL is running: `pg_isready`
2. Check the DATABASE_URL in `.env`
3. Ensure the database exists: `psql -U postgres -l`

### Migration Errors
If migrations fail:
1. Check PostgreSQL logs
2. Verify database credentials
3. Ensure database exists and is accessible

### Seed Errors
If seeding fails:
1. Run migrations first: `npm run db:migrate`
2. Check for existing data conflicts
3. Clear database and re-run migrations if needed

## Production Deployment

### Environment Variables
Set these in your production environment:
- `DATABASE_URL`: PostgreSQL connection string (use SSL in production)
- `JWT_SECRET`: Strong random secret
- `PORT`: Server port (default 5000)

### Database Security
- Use SSL connections: Add `?sslmode=require` to DATABASE_URL
- Use strong passwords
- Limit database user permissions
- Enable connection pooling
- Regular backups

### Migrations in Production
```bash
# Run migrations before deploying new code
npm run db:migrate
```

## Data Persistence
All data is now persisted in PostgreSQL:
- ✅ Data survives server restarts
- ✅ ACID transactions ensure data integrity
- ✅ Foreign key constraints maintain referential integrity
- ✅ Scalable to production workloads
- ✅ Supports concurrent users

## Migration from In-Memory
The application has been fully migrated from in-memory storage to PostgreSQL. All model APIs remain unchanged, ensuring backward compatibility with existing routes and client code.
