## ADDED Requirements

### Requirement: Listing Approval Workflow
All new car listings created by sellers MUST start in a "pending" state and require administrator approval before becoming visible to the public.

#### Scenario: Approve Pending Listing
- **WHEN** an administrator clicks "Approve" on a car listing in "pending" status
- **THEN** the car status changes to "available" and it becomes visible in the public search.

### Requirement: Inventory Categorization
The system MUST support car categorization by Brand, Model, and Fuel Type.

#### Scenario: Set Categories
- **WHEN** an administrator or seller selects specific brand and fuel type values
- **THEN** the car data is updated and can be filtered by these categories.

### Requirement: Pricing Rules
Administrators MUST be able to set global pricing rules or promotions (e.g., dealer fees or seasonal discounts).

#### Scenario: Set Global Discount
- **WHEN** an administrator sets a "Winter Sale" discount of 5% in the Settings panel
- **THEN** all car prices displayed to public users reflect the discount.
