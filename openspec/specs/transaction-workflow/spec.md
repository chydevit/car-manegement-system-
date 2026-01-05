# transaction-workflow Specification

## Purpose
TBD - created by archiving change implement-customer-functions. Update Purpose after archive.
## Requirements
### Requirement: Unified Activity History
Customers MUST be able to view all their interactions (inquiries, test drives, orders) in a single consolidated view.

#### Scenario: View My Activity
- **WHEN** a customer opens their private dashboard
- **THEN** they see an integrated timeline of their recent car inquiries and completed purchases.

### Requirement: Order Tracking
The system MUST provide customers with the current status of their car orders **and send automated notifications to relevant parties when status changes**.

#### Scenario: Check Order Payment with Notification
- **GIVEN** a customer views their transaction history
- **WHEN** they see an order with status "completed"
- **THEN** they can confirm that a Telegram notification was sent when the payment was confirmed
- **AND** the order details match the notification content

### Requirement: Payment Notification via Telegram
The system MUST send real-time notifications to a configured Telegram channel when payment-related events occur, enabling immediate awareness of transactions.

#### Scenario: Send Notification on Payment Confirmation
- **GIVEN** a user confirms payment for a car purchase
- **WHEN** the payment status is updated to "paid"
- **THEN** a formatted notification is sent to the configured Telegram chat
- **AND** the notification includes car title, buyer name, seller name, amount, and order ID
- **AND** the notification is sent within 5 seconds of payment confirmation
- **AND** the payment confirmation response is not delayed by the notification

#### Scenario: Notification Contains Complete Transaction Details
- **GIVEN** a payment is confirmed for order #123
- **WHEN** the Telegram notification is sent
- **THEN** the message includes:
  - Car title and details
  - Buyer name and email
  - Seller name
  - Final purchase amount
  - Order ID
  - Order status
  - Timestamp of transaction
- **AND** the message is formatted for readability with emojis and structure

#### Scenario: Handle Telegram API Failure Gracefully
- **GIVEN** the Telegram API is unavailable or returns an error
- **WHEN** a payment notification is attempted
- **THEN** the system retries up to 3 times with exponential backoff
- **AND** if all retries fail, the error is logged
- **AND** the payment confirmation still succeeds
- **AND** the user receives a successful response

#### Scenario: Skip Notification When Disabled
- **GIVEN** the `TELEGRAM_ENABLED` environment variable is set to "false"
- **WHEN** a payment is confirmed
- **THEN** no Telegram notification is sent
- **AND** the payment confirmation proceeds normally
- **AND** a debug log indicates notifications are disabled

### Requirement: Telegram Configuration Management
The system MUST support secure configuration of Telegram bot credentials via environment variables.

#### Scenario: Load Telegram Configuration from Environment
- **GIVEN** the server starts up
- **WHEN** the Telegram service initializes
- **THEN** it reads `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from environment variables
- **AND** if either is missing, notifications are automatically disabled
- **AND** a warning is logged indicating missing configuration

#### Scenario: Validate Telegram Configuration
- **GIVEN** Telegram credentials are provided in environment variables
- **WHEN** the first notification is attempted
- **THEN** the system validates the bot token format
- **AND** if invalid, logs an error and disables notifications
- **AND** if valid, proceeds with sending the notification

### Requirement: Notification Delivery Tracking
The system MUST track notification delivery status for monitoring and debugging purposes.

#### Scenario: Log Successful Notification Delivery
- **GIVEN** a Telegram notification is successfully sent
- **WHEN** the Telegram API returns a success response
- **THEN** a log entry is created with:
  - Order ID
  - Telegram message ID
  - Timestamp
  - Delivery status: "success"

#### Scenario: Log Failed Notification Delivery
- **GIVEN** a Telegram notification fails after all retries
- **WHEN** the final retry fails
- **THEN** a log entry is created with:
  - Order ID
  - Error message
  - Retry count
  - Timestamp
  - Delivery status: "failed"

