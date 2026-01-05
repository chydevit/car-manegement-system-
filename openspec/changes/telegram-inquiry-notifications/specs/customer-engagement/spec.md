# customer-engagement Specification

## Requirements

### Requirement: Real-time Notifications
The system MUST notify administrators/sellers via external channels (specifically Telegram) upon receipt of new inquiries.

#### Scenario: Admin Notification
- **WHEN** a new inquiry is created (Test Drive, Question, Offer)
- **THEN** a message containing the car details, user information, and inquiry message is sent to the configured Telegram channel.
