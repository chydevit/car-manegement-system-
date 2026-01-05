# Tasks: Enhance Car Images, Seller Management, and Telegram Payment Notifications

## Task 1: Database Schema Updates

### Task 1.1: Create Car Images Table Migration
- [x] Create Drizzle schema file `server/db/schema/car_images.js`
- [x] Define `car_images` table with columns: id, car_id, image_url, is_primary, display_order, created_at, updated_at
- [x] Add foreign key constraint to `cars` table with CASCADE delete
- [x] Add indexes on `car_id` and `(car_id, is_primary)`
- [x] Export schema from `server/db/schema/index.js`

**Acceptance**: Schema file exists, compiles without errors, and includes proper relationships

### Task 1.2: Create Admin Actions Table Migration
- [x] Create Drizzle schema file `server/db/schema/admin_actions.js`
- [x] Define `admin_actions` table with columns: id, admin_id, action_type, target_id, details (JSONB), created_at
- [x] Add foreign key constraint to `users` table for admin_id
- [x] Add index on `admin_id` and `created_at`
- [x] Export schema from `server/db/schema/index.js`

**Acceptance**: Schema file exists, compiles without errors, and includes proper relationships

### Task 1.3: Generate and Apply Database Migrations
- [x] Run `npm run db:generate` to create migration files
- [x] Review generated SQL migrations for correctness
- [x] Run `npm run db:migrate` to apply migrations to database
- [x] Verify tables exist in PostgreSQL using `\dt` command

**Acceptance**: Both new tables exist in database with correct structure and constraints

### Task 1.4: Migrate Existing Car Images
- [x] Create migration script to copy data from `cars.image` to `car_images` table
- [x] Set migrated images as primary (`is_primary = true`)
- [x] Set `display_order = 0` for all migrated images
- [x] Run migration script and verify data integrity

**Acceptance**: All existing car images are migrated to new table, cars.image field remains for backward compatibility

---

## Task 2: Car Images Backend Implementation

### Task 2.1: Create Car Images Model
- [x] Create `server/models/carImage.js`
- [x] Implement `createCarImage(carId, imageUrl, isPrimary, displayOrder)` function
- [x] Implement `getCarImages(carId)` function with ordering by `display_order`
- [x] Implement `updateCarImage(imageId, patch)` function
- [x] Implement `deleteCarImage(imageId)` function
- [x] Implement `setPrimaryImage(carId, imageId)` function (sets one primary, unsets others)

**Acceptance**: All model functions work correctly with database, handle errors gracefully

### Task 2.2: Create Image Upload Middleware
- [x] Install `multer` package for file uploads: `npm install multer --prefix server`
- [x] Install `sharp` package for image processing: `npm install sharp --prefix server`
- [x] Create `server/middleware/imageUpload.js`
- [x] Configure multer to accept image files (JPEG, PNG, WebP)
- [x] Implement file size validation (max 5MB)
- [x] Implement image compression using sharp (target 80% quality)
- [x] Convert images to base64 data URLs for database storage

**Acceptance**: Middleware validates, compresses, and converts images correctly

### Task 2.3: Create Car Images API Routes
- [x] Create `server/routes/carImages.js`
- [x] Implement `POST /api/cars/:carId/images` - upload new image(s)
  - Validate user is seller or admin
  - Validate car exists and user owns it (or is admin)
  - Check maximum image limit (10)
  - Process and store images
  - Return created image records
- [x] Implement `GET /api/cars/:carId/images` - get all images for a car
- [x] Implement `PUT /api/cars/:carId/images/:imageId` - update image metadata
  - Support updating `is_primary` and `display_order`
  - Validate ownership
- [x] Implement `DELETE /api/cars/:carId/images/:imageId` - delete image
  - Validate ownership
  - If deleting primary image, set first remaining as primary
- [x] Register routes in `server/index.js`

**Acceptance**: All endpoints work correctly, enforce authorization, handle edge cases

### Task 2.4: Update Car Model to Include Images
- [x] Modify `server/models/car.js` `findById()` to include associated images
- [x] Modify `server/models/car.js` `listCars()` to include primary image for each car
- [x] Add helper function `getCarWithImages(carId)` that returns car with all images

**Acceptance**: Car queries include image data, primary images are clearly identified

---

## Task 3: Admin Seller Account Creation

### Task 3.1: Create Admin Actions Model
- [x] Create `server/models/adminAction.js`
- [x] Implement `logAdminAction(adminId, actionType, targetId, details)` function
- [x] Implement `getAdminActions(filters)` function for querying audit log

**Acceptance**: Admin actions can be logged and queried from database

### Task 3.2: Create Password Generation Utility
- [x] Create `server/utils/passwordGenerator.js`
- [x] Implement `generateSecurePassword(length = 12)` function
  - Use cryptographically secure random generator
  - Include uppercase, lowercase, numbers, and symbols
  - Return readable password (avoid ambiguous characters)

**Acceptance**: Generated passwords are strong, unique, and user-friendly

### Task 3.3: Create Admin Seller Creation API
- [x] Create `server/routes/admin.js` (if doesn't exist)
- [x] Implement `POST /api/admin/sellers` endpoint
  - Validate admin authentication and role
  - Validate request body (name, email, optional password, phone, address)
  - Check email uniqueness
  - Generate password if not provided
  - Hash password using bcrypt
  - Create user with role "seller" and isActive = true
  - Log admin action
  - Return created user (without password hash) and temporary password
- [x] Add input validation using Zod or similar
- [x] Register routes in `server/index.js`

**Acceptance**: Admins can create seller accounts, passwords are secure, audit log is updated

### Task 3.4: Create Admin Audit Log Endpoint
- [x] Implement `GET /api/admin/actions` endpoint
  - Validate admin authentication
  - Support pagination (limit, offset)
  - Support filtering by action type, date range
  - Join with users table to include admin and target user names
  - Return audit log entries

**Acceptance**: Admins can view audit log with complete details

---

## Task 4: Telegram Payment Notifications

### Task 4.1: Install Telegram Dependencies
- [x] Install `axios` for HTTP requests: `npm install axios --prefix server`
- [x] Add environment variables to `.env.example`:
  - `TELEGRAM_BOT_TOKEN=`
  - `TELEGRAM_CHAT_ID=`
  - `TELEGRAM_ENABLED=true`

**Acceptance**: Dependencies installed, environment template updated

### Task 4.2: Create Telegram Service
- [x] Create `server/services/telegramService.js`
- [x] Implement `TelegramService` class with:
  - Constructor accepting botToken and chatId
  - `isEnabled()` method checking configuration
  - `sendMessage(text, options)` method for generic messages
  - `sendPaymentNotification(orderDetails)` method with formatted message
  - `formatPaymentMessage(orderDetails)` helper for message formatting
  - Retry logic with exponential backoff (3 attempts)
  - Error handling and logging
- [x] Export singleton instance configured from environment variables

**Acceptance**: Service can send messages to Telegram, handles errors gracefully

### Task 4.3: Integrate Telegram Notifications into Payment Flow
- [x] Modify `server/routes/payments.js` `POST /confirm-payment` endpoint
- [x] Import Telegram service
- [x] After updating order status to "paid", trigger notification asynchronously
- [x] Fetch complete order details (car, buyer, seller info)
- [x] Call `telegramService.sendPaymentNotification(orderDetails)`
- [x] Use `Promise.catch()` to handle errors without blocking response
- [x] Log notification success/failure

**Acceptance**: Notifications are sent on payment confirmation, don't block user response

### Task 4.4: Add Notification Logging
- [x] Create `server/models/notificationLog.js` (optional enhancement)
- [x] Or use simple file logging for notification events
- [x] Log successful deliveries with message ID
- [x] Log failed deliveries with error details
- [x] Include order ID, timestamp, and status in logs

**Acceptance**: Notification delivery is tracked and can be audited

---

## Task 5: Frontend Updates

### Task 5.1: Create Image Upload Component
- [x] Create `client/src/components/ImageUpload.jsx`
- [x] Implement drag-and-drop file upload interface
- [x] Show image previews before upload
- [x] Display upload progress
- [x] Support multiple file selection
- [x] Validate file types and sizes on client side
- [x] Show error messages for invalid files

**Acceptance**: Component provides intuitive image upload experience

### Task 5.2: Update Car Form with Image Upload
- [x] Modify car creation/edit form to include ImageUpload component
- [x] Allow uploading multiple images (1-10)
- [x] Show existing images for edit mode
- [x] Allow reordering images via drag-and-drop
- [x] Allow setting primary image
- [x] Allow deleting images
- [x] Update form submission to handle image uploads

**Acceptance**: Sellers can manage car images through the form

### Task 5.3: Create Image Gallery Component
- [x] Create `client/src/components/ImageGallery.jsx`
- [x] Display primary image prominently
- [x] Show thumbnails of other images
- [x] Implement lightbox/modal for full-size viewing
- [x] Support keyboard navigation (arrow keys)
- [x] Make responsive for mobile devices

**Acceptance**: Users can view all car images in an attractive gallery

### Task 5.4: Update Car Listing Display
- [x] Modify car list view to show primary image
- [x] Modify car detail view to use ImageGallery component
- [x] Update car cards to display primary image
- [x] Ensure images load efficiently (lazy loading)

**Acceptance**: Car images are displayed throughout the application

### Task 5.5: Create Admin Seller Creation Form
- [x] Create `client/src/components/admin/CreateSellerForm.jsx`
- [x] Add form fields: name, email, password (optional), phone, address
- [x] Implement form validation
- [x] Show generated password in modal after successful creation
- [x] Provide "Copy to Clipboard" button for credentials
- [x] Add success/error notifications

**Acceptance**: Admins can create sellers through intuitive form

### Task 5.6: Add Seller Management to Admin Dashboard
- [x] Update admin dashboard to include "Create Seller" button
- [x] Integrate CreateSellerForm component
- [x] Refresh user list after seller creation
- [x] Show audit log section (optional enhancement)

**Acceptance**: Admin dashboard provides complete seller management

---

## Task 6: Testing and Validation

### Task 6.1: Test Car Image Functionality
- [x] Test uploading single image
- [x] Test uploading multiple images (up to 10)
- [x] Test file size validation (reject > 5MB)
- [x] Test file type validation (reject non-images)
- [x] Test setting primary image
- [x] Test deleting images
- [x] Test reordering images
- [x] Test image display in gallery
- [x] Test cascade delete when car is removed

**Acceptance**: All image features work correctly, edge cases handled

### Task 6.2: Test Admin Seller Creation
- [x] Test creating seller with auto-generated password
- [x] Test creating seller with custom password
- [x] Test duplicate email validation
- [x] Test authorization (non-admins cannot create sellers)
- [x] Test audit log creation
- [x] Test viewing audit log
- [x] Verify seller can log in with generated credentials

**Acceptance**: Seller creation works correctly, secure, and audited

### Task 6.3: Test Telegram Notifications
- [x] Set up test Telegram bot and channel
- [x] Configure environment variables
- [x] Test notification on payment confirmation
- [x] Verify message format and content
- [x] Test with Telegram API unavailable (mock failure)
- [x] Verify retry logic works
- [x] Verify payment succeeds even if notification fails
- [x] Test with notifications disabled

**Acceptance**: Notifications work reliably, don't break payment flow

### Task 6.4: Integration Testing
- [x] Test complete flow: create car with images → list car → buy car → receive notification
- [x] Test admin creates seller → seller logs in → seller creates car with images
- [x] Test edge cases: delete car with images, update car images, etc.
- [x] Test performance with multiple images per car

**Acceptance**: All features work together seamlessly

---

## Task 7: Documentation and Deployment

### Task 7.1: Update API Documentation
- [ ] Document new car image endpoints
- [ ] Document admin seller creation endpoint
- [ ] Document audit log endpoint
- [ ] Include request/response examples
- [ ] Update Postman collection or similar

**Acceptance**: API documentation is complete and accurate

### Task 7.2: Update User Documentation
- [ ] Create guide for sellers on uploading car images
- [ ] Create guide for admins on creating seller accounts
- [ ] Document Telegram notification setup for administrators
- [ ] Update README with new features

**Acceptance**: Users have clear instructions for new features

### Task 7.3: Update Environment Configuration Guide
- [ ] Document required Telegram environment variables
- [ ] Provide instructions for creating Telegram bot
- [ ] Provide instructions for getting chat ID
- [ ] Update `.env.example` with all new variables

**Acceptance**: Deployment guide includes Telegram setup

### Task 7.4: Database Migration Guide
- [ ] Document migration steps for existing deployments
- [ ] Provide rollback instructions if needed
- [ ] Test migration on staging environment
- [ ] Create backup and restore procedures

**Acceptance**: Safe migration path for production deployment

---

## Dependencies and Sequencing

- **Task 1** must complete before **Task 2, 3, 4** (database schema required)
- **Task 2.1** must complete before **Task 2.3** (model required for routes)
- **Task 2.2** must complete before **Task 2.3** (middleware required for upload routes)
- **Task 4.2** must complete before **Task 4.3** (service required for integration)
- **Task 2, 3, 4** can be done in parallel after Task 1
- **Task 5** depends on **Task 2, 3** (frontend needs backend APIs)
- **Task 6** depends on **Task 2, 3, 4, 5** (testing requires implementation)
- **Task 7** can be done in parallel with **Task 6**

## Estimated Effort

- **Task 1**: 2-3 hours
- **Task 2**: 6-8 hours
- **Task 3**: 4-5 hours
- **Task 4**: 3-4 hours
- **Task 5**: 8-10 hours
- **Task 6**: 4-6 hours
- **Task 7**: 2-3 hours

**Total**: 29-39 hours (approximately 4-5 working days)
