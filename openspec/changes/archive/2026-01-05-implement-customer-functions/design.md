# Design: Customer Functions

## Architectural Overview
The customer functions focus on three pillars: Discovery, Management, and Feedback. We will leverage existing models where possible and introduce a new Feedback layer.

## Data Model Changes

### User Model (Extension)
Extend the in-memory user objects to include optional profile fields:
- `phone`: String
- `address`: String
- `avatar`: URL (mocked)

### Review Model (New)
```javascript
{
  id: Number,
  carId: Number,
  userId: Number,
  userName: String,
  rating: Number, // 1-5
  comment: String,
  createdAt: Date
}
```

## API Routes

### User Self-Service (`/api/me`)
- `GET /api/me`: Get current user's profile and history.
- `PATCH /api/me`: Update personal profile fields.

### Discovery (`/api/cars`)
- Enhance `GET /api/cars` to support query parameters (optional, or handle filtering in frontend for this small dataset).

### Reviews (`/api/reviews`)
- `GET /api/reviews/car/:carId`: List reviews for a specific car.
- `POST /api/reviews`: Submit a new review (requires purchase completion or car interaction).

## Frontend Components

### FilterBar (New)
A responsive sidebar or dropdown system in `UserBrowse` for:
- Price Range (Min/Max)
- Brand Selection
- Fuel Type

### ProfileEditor (New)
A sub-component for the `Dashboard` to allow users to update their contact info.

### ReviewList & ReviewForm (New)
Integrated into `CarDetails` to allow social proof visibility.

## Trade-offs
- **Filtering**: To keep the backend minimal, we will implement client-side filtering initially, as the "Active Inventory" is expected to be under 100 items in this stage.
- **Review Permissions**: To keep it simple, we will allow any registered user to review any car, rather than strictly verifying "Order Completed" status first, which can be added later as a refinement.
