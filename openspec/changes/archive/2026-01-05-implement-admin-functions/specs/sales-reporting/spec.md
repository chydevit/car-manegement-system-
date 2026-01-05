## ADDED Requirements

### Requirement: Transaction Visibility
Administrators MUST be able to view a complete log of all completed car sales and payments.

#### Scenario: View Sales History
- **WHEN** the "Sales" page loads for an administrator
- **THEN** a chronologically ordered list of all car transactions is displayed.

### Requirement: Revenue Reporting
The system MUST generate aggregate revenue reports for selected time periods.

#### Scenario: Generate Monthly Report
- **WHEN** an administrator selects "Last 30 Days" and clicks "Generate"
- **THEN** the total revenue and volume of sales for that period are calculated and displayed.

### Requirement: Seller Performance Monitoring
Administrators MUST be able to view metrics for individual sellers, including listings created and sales completed.

#### Scenario: Inspect Seller Performance
- **WHEN** metrics are requested for a specific seller
- **THEN** the system displays total listings, approval rate, and total sales value for that seller.
