# Proposal: Integrate Database Backend

## Problem
The application currently uses in-memory data stores for all entities (users, cars, orders, inquiries, reviews). This approach has several critical limitations:
- **Data Loss**: All data is lost when the server restarts
- **Scalability**: Cannot handle production workloads or multiple server instances
- **Reliability**: No data persistence or backup capabilities
- **Concurrency**: No transaction support or data integrity guarantees

The system needs a production-ready database backend to ensure data persistence, reliability, and scalability.

## Why
Migrating to a PostgreSQL database with Drizzle ORM will:
- **Enable Production Deployment**: Persistent data storage allows the application to be deployed in real-world scenarios
- **Improve Data Integrity**: ACID transactions and foreign key constraints ensure data consistency
- **Support Growth**: PostgreSQL can handle thousands of concurrent users and millions of records
- **Enhance Developer Experience**: Drizzle ORM provides type-safe database queries and migrations
- **Enable Advanced Features**: Full-text search, complex queries, and analytics become possible

## Proposed Solution
Integrate Drizzle ORM with PostgreSQL to replace all in-memory data stores. The migration will:

1. **Database Setup**: Configure Drizzle ORM with the existing PostgreSQL connection (`DATABASE_URL=postgresql://postgresql:517170@localhost:5432/cms`)
2. **Schema Definition**: Create Drizzle schema files matching the current data models (users, cars, orders, inquiries, reviews)
3. **Migration System**: Set up Drizzle migrations to manage schema changes
4. **Model Refactoring**: Replace in-memory arrays with Drizzle queries while maintaining the same API interface
5. **Seed Data**: Create seed scripts to populate initial data (admin/seller/user accounts, sample cars)
6. **Testing**: Verify all existing functionality works with the database backend

## Impact

### Affected Specs
- `user-role-management`: Update to reflect database-backed authentication and authorization
- `car-inventory-management`: Update to reflect persistent car listings
- `sales-orders`: Update to reflect database transactions for order processing
- `customer-engagement`: Update to reflect persistent inquiry tracking
- `social-engagement`: Update to reflect persistent review storage
- `data-persistence`: (New) Define requirements for database operations, migrations, and backups

### Affected Code
- `server/package.json`: Add Drizzle ORM dependencies (`drizzle-orm`, `drizzle-kit`, `postgres`)
- `server/db/`: New directory for database configuration and schema
- `server/models/*.js`: Refactor all model files to use Drizzle queries
- `server/routes/*.js`: Update to handle async database operations
- `.env`: Already contains `DATABASE_URL` configuration

### Migration Strategy
- **Backward Compatible**: Model APIs remain unchanged to avoid breaking route handlers
- **Incremental**: Models can be migrated one at a time
- **Reversible**: Keep in-memory fallback option during development
- **Data Seeding**: Provide scripts to recreate current mock data in the database
