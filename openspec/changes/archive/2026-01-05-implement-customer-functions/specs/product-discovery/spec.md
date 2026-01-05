## ADDED Requirements

### Requirement: Advanced Filtering
The system MUST allow users to filter the car inventory by specific criteria.

#### Scenario: Filter by Budget
- **WHEN** a user sets a maximum price filter
- **THEN** only cars with a price less than or equal to the limit are displayed.

#### Scenario: Filter by Brand
- **WHEN** a user selects "Porsche" from the brand filter
- **THEN** the view updates to show only Porsche vehicles.

### Requirement: Global Search
Users MUST be able to search for specific car models or keywords.

#### Scenario: Keywords Search
- **WHEN** a user types "Electric" into the search bar
- **THEN** matching results are displayed immediately.
