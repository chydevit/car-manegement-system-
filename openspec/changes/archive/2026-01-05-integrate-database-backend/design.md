# Design: Database Backend Integration

## Architectural Overview
This change replaces in-memory data stores with a PostgreSQL database accessed through Drizzle ORM. The architecture follows a layered approach:

```
Routes (Express) → Models (Drizzle Queries) → Database (PostgreSQL)
```

## Technology Choices

### Drizzle ORM
**Why Drizzle?**
- **Type Safety**: Full TypeScript support with inferred types from schema
- **Performance**: Minimal overhead, generates efficient SQL
- **Developer Experience**: Simple API, excellent migration tooling
- **Flexibility**: Direct SQL access when needed

**Alternatives Considered:**
- Prisma: More opinionated, slower query execution
- TypeORM: Heavier, decorator-based approach
- Raw SQL: No type safety, manual migration management

### Schema Design

#### Users Table
```typescript
users {
  id: serial primary key
  name: varchar(255)
  email: varchar(255) unique
  passwordHash: varchar(255)
  role: enum('user', 'seller', 'admin')
  isActive: boolean default true
  lastLogin: timestamp
  phone: varchar(50)
  address: text
  avatar: text
  createdAt: timestamp default now()
  updatedAt: timestamp default now()
}
```

#### Cars Table
```typescript
cars {
  id: serial primary key
  title: varchar(255)
  price: decimal(10,2)
  description: text
  sellerId: integer references users(id)
  status: enum('pending', 'available', 'reserved', 'sold')
  brand: varchar(100)
  model: varchar(100)
  year: integer
  fuelType: varchar(50)
  image: text
  createdAt: timestamp default now()
  updatedAt: timestamp default now()
}
```

#### Orders Table
```typescript
orders {
  id: serial primary key
  carId: integer references cars(id)
  buyerId: integer references users(id)
  sellerId: integer references users(id)
  finalPrice: decimal(10,2)
  status: enum('draft', 'pending', 'completed', 'cancelled')
  documents: jsonb
  createdAt: timestamp default now()
  updatedAt: timestamp default now()
}
```

#### Inquiries Table
```typescript
inquiries {
  id: serial primary key
  carId: integer references cars(id)
  userId: integer references users(id)
  sellerId: integer references users(id)
  message: text
  status: enum('open', 'closed')
  type: enum('general', 'test_drive')
  requestedDate: date
  createdAt: timestamp default now()
  updatedAt: timestamp default now()
}
```

#### Reviews Table
```typescript
reviews {
  id: serial primary key
  carId: integer references cars(id)
  userId: integer references users(id)
  userName: varchar(255)
  rating: integer check (rating >= 1 and rating <= 5)
  comment: text
  createdAt: timestamp default now()
}
```

#### Favorites Table (New - for data integrity)
```typescript
favorites {
  id: serial primary key
  userId: integer references users(id)
  carId: integer references cars(id)
  createdAt: timestamp default now()
  unique(userId, carId)
}
```

## Migration Strategy

### Phase 1: Setup (Non-Breaking)
1. Install Drizzle dependencies
2. Create database connection module
3. Define schema files
4. Generate initial migration

### Phase 2: Model Refactoring (Sequential)
Migrate models one at a time to minimize risk:
1. User model (most critical)
2. Car model
3. Order model
4. Inquiry model
5. Review model

### Phase 3: Data Seeding
Create seed scripts for:
- Default admin/seller/user accounts
- Sample car listings
- Test data for development

### Phase 4: Cleanup
- Remove in-memory arrays
- Update documentation
- Add database health checks

## Trade-offs

### Chosen Approach: Full Migration
**Pros:**
- Clean architecture
- Full database features (transactions, constraints)
- Production-ready

**Cons:**
- Requires database setup
- More complex deployment

### Alternative: Hybrid Approach
Keep in-memory for development, database for production
**Rejected because:** Increases complexity, different behavior in dev/prod

## Error Handling
- Database connection failures: Graceful degradation with clear error messages
- Migration failures: Rollback support via Drizzle migrations
- Query errors: Proper error logging and user-friendly messages

## Performance Considerations
- **Indexes**: Add indexes on foreign keys and frequently queried columns
- **Connection Pooling**: Use pg pool for efficient connection management
- **Query Optimization**: Use Drizzle's query builder for efficient SQL generation
- **Caching**: Future consideration for frequently accessed data

## Security
- **SQL Injection**: Drizzle's parameterized queries prevent SQL injection
- **Password Hashing**: Continue using bcrypt for password storage
- **Connection Security**: Use SSL for database connections in production
- **Environment Variables**: Keep DATABASE_URL in .env, never commit to git
