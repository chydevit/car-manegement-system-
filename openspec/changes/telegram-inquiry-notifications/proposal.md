# Proposal: Telegram Inquiry Notifications

## What Changes
Integrate Telegram notifications into the inquiry submission flow. When a user submits an inquiry (e.g., test drive request, question) for a car, the system will send a real-time notification to the configured Telegram channel using the existing `TelegramService`.

## Why
Real-time notifications allow administrators to respond quickly to potential leads, improving customer satisfaction and increasing the likelihood of successful sales. Currently, inquiries are only stored in the database.

## Background
The `TelegramService` was recently introduced for payment notifications. We will extend this service to handle inquiry notifications as well.

## Risks
- **Notification Spam**: High volume of inquiries could spam the channel. We will rely on the existing rate limits and potential future configurations to manage this.
- **Privacy**: We must ensure sensitive user PII is handled carefully, although currently notifications go to an internal admin channel.

## Out of Scope
- Sending notifications to individual sellers' personal Telegram accounts (requires storing Telegram IDs).
- Two-way chat via Telegram.

## Success Criteria
- [ ] New inquiries triggering a `POST /api/inquiries` request result in a Telegram message.
- [ ] The message includes: Inquiry Type, User Name, Car Title, and Message snippet.
- [ ] Logic gracefully handles Telegram API failures.
