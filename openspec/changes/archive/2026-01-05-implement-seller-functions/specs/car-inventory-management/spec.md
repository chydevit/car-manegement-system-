## MODIFIED Requirements

### Requirement: Inventory Categorization
The system MUST support car categorization by Brand, Model, and Fuel Type.

#### Scenario: Set Categories
- **WHEN** an administrator or seller selects specific brand and fuel type values
- **THEN** the car data is updated and can be filtered by these categories.

## ADDED Requirements

### Requirement: Availability States
Sellers MUST be able to change the availability state of their approved cars to reflect current buyer interest or finalized sales.

#### Scenario: Mark Car as Reserved
- **WHEN** a seller clicks "Reserve" on an available listing
- **THEN** the car status changes to "reserved" and it is visually hidden from new public browsers.

#### Scenario: Finalize Sale
- **WHEN** a seller marks a car as "sold"
- **THEN** the car status becomes "sold" and it remains in the seller's history but is removed from active marketplace stock.
