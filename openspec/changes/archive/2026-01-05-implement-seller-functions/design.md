# Design: Seller Functions

## Architecture Overview
Expanding the seller side of the application to move beyond basic listing creation into a full CRM (Customer Relationship Management) and Sales pipeline.

### Data Model Changes
- **Inquiry Model (New)**:
  - `id`, `carId`, `userId`, `sellerId`, `message`, `status` (open, responded, closed), `type` (general, test_drive), `requestedDate` (for test drives)
- **Sales Order Model (New)**:
  - `id`, `carId`, `buyerId`, `sellerId`, `finalPrice`, `status` (draft, pending_payment, completed, cancelled), `documents` (array of metadata), `createdAt`
- **Car Model**:
  - Extend statuses to include `reserved` and `sold`.

### API Routes
- **Inquiries**:
  - `GET /api/seller/inquiries`: List leads for the logged-in seller.
  - `PATCH /api/seller/inquiries/:id`: Update status or respond.
- **Sales**:
  - `POST /api/seller/orders`: Initiate a sales order.
  - `GET /api/seller/orders`: List seller's transaction history.
  - `POST /api/seller/orders/:id/documents`: Upload doc metadata.
- **Inventory**:
  - `PATCH /api/cars/:id/status`: Allow sellers to mark as reserved/sold (if approved).

### Frontend Components
- `LeadDashboard`: New view within `SellerDashboard` for managing inquiries.
- `SalesOrderForm`: Modal/View to process a car sale.
- `DocumentUploader`: Simple simulated upload component.
- `SellerStats`: Charts showing personal monthly performance.

## Trade-offs
- **Document Management**: We will mock document uploads by storing metadata/URLs rather than implementing a full binary storage service (S3/Cloudinary) for this phase.
- **Real-time Messaging**: For the initial version, communication will be asynchronous via the Inquiry status updates rather than a WebSocket-based chat.
