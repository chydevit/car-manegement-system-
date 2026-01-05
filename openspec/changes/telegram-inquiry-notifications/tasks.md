# Tasks: Telegram Inquiry Notifications

## Task 1: Update Telegram Service
- [x] Modify `server/services/telegramService.js`
- [x] Add `sendInquiryNotification(inquiryDetails)` method to `TelegramService` class
- [x] Add `formatInquiryMessage(inquiryDetails)` helper method
- [x] Ensure consistent logging for inquiry notifications

**Acceptance**: Service exposes method to send inquiry alerts using the existing Telegram configuration

## Task 2: Integrate into Inquiry Route
- [x] Modify `server/routes/inquiry.js`
- [x] Import `telegramService` singleton
- [x] In `POST /` handler, after successful inquiry creation:
  - [x] Fetch additional details if needed (User name, Car title) - Note: Car is already fetched, User ID is in req.
  - [x] Call `telegramService.sendInquiryNotification(...)`
  - [x] Ensure this is non-blocking (fire and forget with error logging)

**Acceptance**: Submitting an inquiry results in a Telegram notification
