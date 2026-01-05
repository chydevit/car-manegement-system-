# Change: Implement Admin Functions

## Why
The current system lacks robust administrative tools to manage users, inventory, and system settings. Administrators need a centralized way to oversee platform activity, manage seller accounts, and ensure the quality of car listings.

## What Changes
- Implement User & Role Management with activation control.
- Implement Car Approval Workflow and categorization.
- Implement Sales & Reporting dashboards.
- Implement Global System Control settings.

## Impact
- Affected specs: `user-role-management`, `car-inventory-management`, `sales-reporting`, `system-control`
- Affected code: `server/models/user.js`, `server/models/car.js`, `server/routes/`, `client/src/`
