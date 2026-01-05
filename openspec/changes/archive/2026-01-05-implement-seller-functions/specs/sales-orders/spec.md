## ADDED Requirements

### Requirement: Sales Order Creation
Sellers MUST be able to generate a formal sales order to document the terms of a car sale.

#### Scenario: Create Draft Order
- **WHEN** a seller selects a car and enters a final agreed price
- **THEN** a sales order record is created in "draft" status.

### Requirement: Document Association
The system MUST allow sellers to track digital document metadata (e.g., registration, bill of sale) associated with an order.

#### Scenario: Attach Document Metadata
- **WHEN** a seller adds a "Registration" document record to an order
- **THEN** the metadata is visible to the seller when viewing the order details.

### Requirement: Payment Status Tracking
Sellers MUST be able to track the payment progress of a sales order.

#### Scenario: Mark Order as Paid
- **WHEN** a seller updates an order status to "completed"
- **THEN** the associated car is automatically marked as "sold" in the inventory.
