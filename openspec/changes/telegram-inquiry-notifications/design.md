# Design: Telegram Inquiry Notifications

## Architecture

We will leverage the existing `TelegramService` to add a new notification type.

### Components

1.  **TelegramService (`server/services/telegramService.js`)**:
    *   New method: `sendInquiryNotification(inquiry, car, user)`
    *   New helper: `formatInquiryMessage(inquiry, car, user)`
    *   Reuses existing `sendMessage` and `axios` client.

2.  **Inquiry Route (`server/routes/inquiry.js`)**:
    *   Integration point in the `POST /` handler.
    *   Responsible for gathering necessary data (Car, User) to pass to the service.

## Data Flow

1.  Client sends `POST /api/inquiries`.
2.  Route handler verifies Car existence (already done).
3.  Route handler creates Inquiry record in DB.
4.  Route handler fetches User profile (needed for name/email) - *Note: `req.user` might only have ID/email depending on auth middleware, might need DB fetch.*
5.  Route handler calls `telegramService.sendInquiryNotification` asynchronously.
6.  Route handler returns JSON response to Client immediately.

## Message Template

```markdown
📨 *New Inquiry Received*

*Type:* {inquiry.type} (e.g., Test Drive, General Question)
*Car:* {car.title} ({car.brand} {car.model})
*From:* {user.name}
*Contact:* {user.email}

*Message:*
"{inquiry.message}"

_Submitted on {date}_
```

## Security & Performance
- **Non-blocking**: Telegram API calls must be awaited but caught, or fire-and-forget to prevent slowing down the user response.
- **Privacy**: Only essential info shared. Admin channel assumed secure.
