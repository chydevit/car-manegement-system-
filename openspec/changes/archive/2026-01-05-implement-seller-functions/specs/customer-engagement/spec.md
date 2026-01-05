## ADDED Requirements

### Requirement: Digital Inquiries
Prospective buyers MUST be able to send digital inquiries about specific car listings to the respective seller.

#### Scenario: User Submits Inquiry
- **WHEN** a public user submits a message via the car detail page
- **THEN** the message is routed to the seller's lead dashboard.

### Requirement: Lead Management
Sellers MUST be able to view, prioritize, and respond to customer inquiries.

#### Scenario: Seller Responds to Lead
- **WHEN** a seller updates an inquiry with a response and sets status to "closed"
- **THEN** the inquiry is marked as resolved and removed from the active alerts.

### Requirement: Test Drive Scheduling
The system MUST support requests for test drives with specific date preferences.

#### Scenario: Request Test Drive
- **WHEN** a user selects a date and "Test Drive" type for an inquiry
- **THEN** the seller sees the specific time request in their engagement panel.
