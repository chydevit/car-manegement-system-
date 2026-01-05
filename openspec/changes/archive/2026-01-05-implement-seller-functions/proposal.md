# Change: Implement Seller Functions

## Why
After core admin functions are in place, the system needs to empower sellers with the tools necessary to manage their personal inventory, engage with potential customers, and finalize sales transactions within the platform.

## What Changes
- **Car Management**: Enhanced listing updates and inventory status control (sold/reserved).
- **Customer Engagement**: Lead management system, messaging interface, and test drive orchestration.
- **Sales Processing**: Transaction workflow including sales order creation and document management.
- **Self-Service Reporting**: Personalized dashboards for sellers to track their individual performance.

## Impact
- Affected specs: `car-inventory-management`, `customer-engagement`, `sales-orders`, `sales-reporting`
- Affected code: `server/models/`, `server/routes/`, `client/src/pages/SellerDashboard.jsx`, `client/src/components/CarForm.jsx`
