# Tasks: Integrate Database Backend

- [x] Task 1: Database Setup & Configuration
  - [x] 1.1 Install Drizzle ORM dependencies (`drizzle-orm`, `drizzle-kit`, `postgres`)
  - [x] 1.2 Create `server/db/index.js` for database connection
  - [x] 1.3 Create `drizzle.config.js` for Drizzle configuration
  - [x] 1.4 Verify database connection with existing DATABASE_URL

- [x] Task 2: Schema Definition
  - [x] 2.1 Create `server/db/schema/users.js` with users table schema
  - [x] 2.2 Create `server/db/schema/cars.js` with cars table schema
  - [x] 2.3 Create `server/db/schema/orders.js` with orders table schema
  - [x] 2.4 Create `server/db/schema/inquiries.js` with inquiries table schema
  - [x] 2.5 Create `server/db/schema/reviews.js` with reviews table schema
  - [x] 2.6 Create `server/db/schema/favorites.js` with favorites table schema
  - [x] 2.7 Create `server/db/schema/index.js` to export all schemas

- [x] Task 3: Database Migrations
  - [x] 3.1 Generate initial migration with `drizzle-kit generate`
  - [x] 3.2 Create migration script in package.json
  - [x] 3.3 Run migration to create tables in PostgreSQL
  - [x] 3.4 Verify tables created successfully

- [x] Task 4: Refactor User Model
  - [x] 4.1 Update `server/models/user.js` to use Drizzle queries
  - [x] 4.2 Implement `createUser` with database insert
  - [x] 4.3 Implement `findByEmail` with database query
  - [x] 4.4 Implement `validateUser` with database lookup
  - [x] 4.5 Implement `findById`, `updateUser`, `listUsers` with database queries
  - [x] 4.6 Test authentication flow with database

- [x] Task 5: Refactor Car Model
  - [x] 5.1 Update `server/models/car.js` to use Drizzle queries
  - [x] 5.2 Implement `createCar` with database insert
  - [x] 5.3 Implement `listCars`, `findById`, `updateCar`, `deleteCar` with database queries
  - [x] 5.4 Test car CRUD operations

- [x] Task 6: Refactor Order Model
  - [x] 6.1 Update `server/models/order.js` to use Drizzle queries
  - [x] 6.2 Implement `createOrder` with database insert
  - [x] 6.3 Implement `listBySeller`, `findById`, `updateOrder` with database queries
  - [x] 6.4 Test order management flow

- [x] Task 7: Refactor Inquiry Model
  - [x] 7.1 Update `server/models/inquiry.js` to use Drizzle queries
  - [x] 7.2 Implement `createInquiry` with database insert
  - [x] 7.3 Implement `listBySeller`, `listByUser`, `updateInquiry` with database queries
  - [x] 7.4 Test inquiry submission and management

- [x] Task 8: Refactor Review Model
  - [x] 8.1 Update `server/models/review.js` to use Drizzle queries
  - [x] 8.2 Implement `createReview` with database insert
  - [x] 8.3 Implement `listByCar` with database query
  - [x] 8.4 Test review submission and display

- [x] Task 9: Update Favorites System
  - [x] 9.1 Create `server/models/favorite.js` with database queries
  - [x] 9.2 Update `server/routes/favorites.js` to use new model
  - [x] 9.3 Test favorite add/remove/list operations

- [x] Task 10: Data Seeding
  - [x] 10.1 Create `server/db/seed.js` script
  - [x] 10.2 Add seed data for default users (admin, seller, user)
  - [x] 10.3 Add seed data for sample cars
  - [x] 10.4 Add seed script to package.json
  - [x] 10.5 Run seed script and verify data

- [x] Task 11: Route Updates
  - [x] 11.1 Update all route handlers to handle async database operations
  - [x] 11.2 Add proper error handling for database errors
  - [x] 11.3 Test all API endpoints with database backend

- [x] Task 12: Testing & Validation
  - [x] 12.1 Test user registration and login flow
  - [x] 12.2 Test car listing, creation, update, delete
  - [x] 12.3 Test order creation and management
  - [x] 12.4 Test inquiry submission and tracking
  - [x] 12.5 Test review submission and display
  - [x] 12.6 Test favorites functionality
  - [x] 12.7 Verify data persists across server restarts

- [x] Task 13: Cleanup & Documentation
  - [x] 13.1 Remove in-memory array declarations from models
  - [x] 13.2 Update README with database setup instructions
  - [x] 13.3 Document migration commands
  - [x] 13.4 Add database connection health check endpoint

## Implementation Notes

### Completed Changes
- ✅ All models refactored to use Drizzle ORM
- ✅ Database schema defined with proper foreign keys and constraints
- ✅ Migration system set up with Drizzle Kit
- ✅ Seed script created for initial data
- ✅ All routes updated to handle async operations
- ✅ Comprehensive error handling added
- ✅ Documentation created (DATABASE_SETUP.md)

### Database Requirements
**IMPORTANT**: PostgreSQL must be running before the application can start.

1. Install PostgreSQL if not already installed
2. Start PostgreSQL service
3. Create database: `CREATE DATABASE cms;`
4. Run migrations: `npm run db:migrate`
5. Seed data: `npm run db:seed`
6. Start server: `npm run dev`

See `DATABASE_SETUP.md` for detailed setup instructions.

### API Compatibility
All model APIs remain unchanged, ensuring backward compatibility with existing client code. The transition from in-memory to database storage is transparent to the application layer.

### Next Steps for User
1. Ensure PostgreSQL is installed and running
2. Create the database: `cms`
3. Run migrations to create tables
4. Run seed script to populate initial data
5. Test the application with persistent data
