# Design: Enhance Car Images, Seller Management, and Telegram Payment Notifications

## Architecture Overview

This change introduces three distinct but complementary features that enhance the Vibe Wheels platform. Each feature is designed to integrate seamlessly with the existing PostgreSQL database and Express.js backend.

## Component Design

### 1. Multi-Image Car Listings

#### Database Schema Changes

Create a new `car_images` table to support multiple images per car:

```sql
CREATE TABLE car_images (
  id SERIAL PRIMARY KEY,
  car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_car_images_car_id ON car_images(car_id);
CREATE INDEX idx_car_images_primary ON car_images(car_id, is_primary);
```

#### API Endpoints

- `POST /api/cars/:carId/images` - Upload new image(s) for a car
- `GET /api/cars/:carId/images` - Retrieve all images for a car
- `PUT /api/cars/:carId/images/:imageId` - Update image metadata (primary, order)
- `DELETE /api/cars/:carId/images/:imageId` - Delete a specific image

#### File Storage Strategy

**Phase 1 (Current Implementation)**: Store images as base64-encoded data URLs in the database
- Pros: Simple, no external dependencies
- Cons: Database bloat, performance impact
- Limit: 5MB per image, 10 images per car

**Phase 2 (Future Enhancement)**: Migrate to cloud storage (S3, Cloudinary)
- Store only URLs in database
- Offload storage and delivery to CDN

#### Image Validation

- **Formats**: JPEG, PNG, WebP
- **Size**: Maximum 5MB per image
- **Dimensions**: Minimum 400x300px, Maximum 4000x3000px
- **Quantity**: Minimum 1, Maximum 10 images per car

### 2. Admin Seller Account Management

#### API Endpoints

- `POST /api/admin/sellers` - Create a new seller account
  - Request body: `{ name, email, password?, phone?, address? }`
  - Auto-generates secure password if not provided
  - Returns: Created user object (password excluded) and temporary password

#### Business Logic

1. **Validation**:
   - Email uniqueness check
   - Password strength requirements (if provided)
   - Role enforcement (must be 'seller')

2. **Account Creation Flow**:
   ```
   Admin submits form → Validate input → Hash password → 
   Insert user record → Log audit event → Return credentials
   ```

3. **Security Considerations**:
   - Only users with 'admin' role can access this endpoint
   - Passwords are hashed using bcrypt before storage
   - Temporary passwords should be changed on first login (future enhancement)

#### Audit Logging

Create an `admin_actions` table to track administrative activities:

```sql
CREATE TABLE admin_actions (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES users(id),
  action_type VARCHAR(50) NOT NULL,
  target_id INTEGER,
  details JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 3. Telegram Payment Notifications

#### Integration Architecture

```
Payment Confirmation → Queue Notification → Telegram Bot API → Telegram Channel/Chat
                              ↓
                    Retry Logic (on failure)
```

#### Configuration

Environment variables required:
- `TELEGRAM_BOT_TOKEN` - Bot authentication token from @BotFather
- `TELEGRAM_CHAT_ID` - Target chat/channel ID for notifications
- `TELEGRAM_ENABLED` - Feature flag (true/false)

#### Notification Format

```
🚗 New Car Purchase!

Car: [Car Title]
Buyer: [Buyer Name] ([Buyer Email])
Seller: [Seller Name]
Amount: $[Final Price]
Order ID: #[Order ID]
Status: [Order Status]
Time: [Timestamp]

---
View Order: [Link to order details]
```

#### API Integration

Use the Telegram Bot API's `sendMessage` endpoint:
- Endpoint: `https://api.telegram.org/bot{token}/sendMessage`
- Method: POST
- Payload: `{ chat_id, text, parse_mode: "HTML" }`

#### Error Handling

1. **Network Failures**: Retry up to 3 times with exponential backoff (1s, 2s, 4s)
2. **API Errors**: Log error details but don't block transaction
3. **Configuration Missing**: Skip notification silently, log warning

#### Notification Service Module

Create a reusable `telegramService.js`:

```javascript
class TelegramService {
  constructor(botToken, chatId) { ... }
  
  async sendPaymentNotification(orderDetails) { ... }
  
  async sendMessage(text, options = {}) { ... }
  
  isEnabled() { ... }
}
```

## Data Flow

### Car Image Upload Flow

```
Client → Upload Image(s) → Server validates → 
Compress/Resize → Store in DB → Return image IDs → 
Client updates UI
```

### Seller Account Creation Flow

```
Admin Dashboard → Submit Form → Server validates → 
Hash password → Create user record → Log audit → 
Return credentials → Admin shares with seller
```

### Payment Notification Flow

```
User confirms payment → Update order status → 
Trigger notification → Format message → 
Send to Telegram → Log result → Return response
```

## Security Considerations

1. **Image Upload**:
   - Validate file types using magic numbers, not just extensions
   - Sanitize filenames to prevent path traversal
   - Implement rate limiting to prevent abuse

2. **Seller Account Creation**:
   - Require admin authentication
   - Log all account creation activities
   - Validate email format and uniqueness

3. **Telegram Integration**:
   - Store bot token in environment variables only
   - Never expose token in client-side code or logs
   - Validate webhook signatures (if using webhooks in future)

## Performance Considerations

1. **Image Storage**:
   - Compress images before storage (target: 80% quality)
   - Lazy load images on frontend
   - Consider pagination for cars with many images

2. **Telegram Notifications**:
   - Send notifications asynchronously (don't block payment confirmation)
   - Implement queue system for high-volume scenarios
   - Cache Telegram API responses to avoid duplicate sends

## Migration Strategy

### Database Migrations

1. Create `car_images` table
2. Migrate existing `cars.image` data to `car_images` table (set as primary)
3. Create `admin_actions` table
4. Add indexes for performance

### Backward Compatibility

- Keep `cars.image` field temporarily for backward compatibility
- Deprecate in favor of `car_images` relationship
- Remove `cars.image` field in future release after migration

## Testing Strategy

1. **Unit Tests**:
   - Image validation logic
   - Telegram message formatting
   - Password generation

2. **Integration Tests**:
   - Car image upload and retrieval
   - Seller account creation
   - Telegram notification sending (with mocked API)

3. **Manual Testing**:
   - Image upload with various formats and sizes
   - Admin dashboard seller creation flow
   - Telegram notification delivery to actual channel
