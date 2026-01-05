# Design: Admin Functions

## Architecture Overview
The admin system will be integrated into the existing client-server architecture.

### Data Model Changes
- **User Model**:
  - `isActive`: boolean (to support activation/deactivation)
  - `lastLogin`: Date (for monitoring)
- **Car Model**:
  - `status`: enum ['pending', 'approved', 'rejected', 'sold']
  - `brand`, `model`, `year`, `fuelType`: string (for categorization)
  - `rejectionReason`: string (optional)
- **Settings Model (New)**:
  - Global configuration for pricing rules, maintenance mode, etc.

### API Routes
- `GET /api/admin/users`: List all users with filters.
- `POST /api/admin/users`: Create admin/seller.
- `PATCH /api/admin/users/:id`: Update user or toggle status.
- `GET /api/admin/cars`: List all cars across all sellers.
- `PATCH /api/admin/cars/:id/approval`: Approve/reject listing.
- `GET /api/admin/reports/sales`: Aggregate sales data.

### Frontend Components
- `AdminDashboard`: Summary cards and recent activity.
- `UserTable`: Management table with actions.
- `InventoryTable`: Global car list with approval actions.
- `ReportsView`: Data visualizations using a charting library.

## Trade-offs
- **In-Memory Store**: Since the current system uses in-memory storage, these changes will persist only during the server session. A database migration should be considered in a future OpenSpec.
- **Simplicity vs. Scalability**: We will prioritize functional completeness over horizontal scalability for the initial admin features.
