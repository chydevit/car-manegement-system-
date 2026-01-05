# car-inventory-management Specification

## ADDED Requirements

### Requirement: Persistent Car Listings
Car listings MUST be stored in a PostgreSQL database with proper relationships to sellers.

#### Scenario: Create Car with Database
- **GIVEN** a seller creates a new car listing
- **WHEN** the listing is submitted
- **THEN** the car record is inserted into the database
- **AND** the sellerId foreign key references the users table
- **AND** the car is assigned a unique database-generated ID
- **AND** the listing persists across server restarts

#### Scenario: Query Cars by Status
- **GIVEN** multiple cars with different statuses
- **WHEN** filtering cars by status "available"
- **THEN** the database query uses an index on the status column
- **AND** only available cars are returned
- **AND** the query executes efficiently

### Requirement: Car Status Updates
Car status changes MUST be persisted to the database with proper validation.

#### Scenario: Update Car Status to Sold
- **GIVEN** a car with status "available"
- **WHEN** the seller marks it as "sold"
- **THEN** the database record is updated
- **AND** the updatedAt timestamp is automatically set
- **AND** the change is immediately visible to all users

## Related Capabilities
- `data-persistence`: Database operations and schema management
- `sales-orders`: Order creation when car is sold
