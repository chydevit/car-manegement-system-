# car-inventory-management Specification

## Purpose
TBD - created by archiving change implement-admin-functions. Update Purpose after archive.
## Requirements
### Requirement: Listing Approval Workflow
All new car listings created by sellers MUST start in a "pending" state and require administrator approval before becoming visible to the public.

#### Scenario: Approve Pending Listing
- **WHEN** an administrator clicks "Approve" on a car listing in "pending" status
- **THEN** the car status changes to "available" and it becomes visible in the public search.

### Requirement: Inventory Categorization
The system MUST support car categorization by Brand, Model, and Fuel Type.

#### Scenario: Set Categories
- **WHEN** an administrator or seller selects specific brand and fuel type values
- **THEN** the car data is updated and can be filtered by these categories.

### Requirement: Pricing Rules
Administrators MUST be able to set global pricing rules or promotions (e.g., dealer fees or seasonal discounts).

#### Scenario: Set Global Discount
- **WHEN** an administrator sets a "Winter Sale" discount of 5% in the Settings panel
- **THEN** all car prices displayed to public users reflect the discount.

### Requirement: Availability States
Sellers MUST be able to change the availability state of their approved cars to reflect current buyer interest or finalized sales.

#### Scenario: Mark Car as Reserved
- **WHEN** a seller clicks "Reserve" on an available listing
- **THEN** the car status changes to "reserved" and it is visually hidden from new public browsers.

#### Scenario: Finalize Sale
- **WHEN** a seller marks a car as "sold"
- **THEN** the car status becomes "sold" and it remains in the seller's history but is removed from active marketplace stock.

### Requirement: Persistent Car Listings
Car listings MUST be stored in a PostgreSQL database with proper relationships to sellers **and associated images**.

#### Scenario: Create Car with Images
- **GIVEN** a seller creates a new car listing with 4 images
- **WHEN** the listing is submitted
- **THEN** the car record is inserted into the `cars` table
- **AND** four image records are inserted into the `car_images` table
- **AND** all image records reference the car's ID
- **AND** the car and images persist across server restarts

#### Scenario: Query Car with Images
- **GIVEN** a car listing exists with 6 images
- **WHEN** the car details are requested
- **THEN** the car data includes all associated images
- **AND** images are ordered by `display_order`
- **AND** the primary image is clearly identified

### Requirement: Car Status Updates
Car status changes MUST be persisted to the database with proper validation.

#### Scenario: Update Car Status to Sold
- **GIVEN** a car with status "available"
- **WHEN** the seller marks it as "sold"
- **THEN** the database record is updated
- **AND** the updatedAt timestamp is automatically set
- **AND** the change is immediately visible to all users

### Requirement: Multi-Image Car Listings
Sellers MUST be able to upload and manage multiple images for each car listing to provide comprehensive visual information to potential buyers.

#### Scenario: Upload Multiple Images
- **GIVEN** a seller is creating or editing a car listing
- **WHEN** they upload 5 images for the vehicle
- **THEN** all images are stored in the database
- **AND** the first uploaded image is set as the primary image
- **AND** images are displayed in the order they were uploaded

#### Scenario: Set Primary Image
- **GIVEN** a car listing has 4 images
- **WHEN** the seller selects the third image as primary
- **THEN** the third image's `is_primary` flag is set to true
- **AND** all other images' `is_primary` flags are set to false
- **AND** the primary image is displayed first in the gallery

#### Scenario: Delete Car Image
- **GIVEN** a car listing has 6 images
- **WHEN** the seller deletes the second image
- **THEN** the image is removed from the database
- **AND** the remaining images maintain their display order
- **AND** if the deleted image was primary, the first remaining image becomes primary

#### Scenario: Image Upload Validation
- **GIVEN** a seller attempts to upload an image
- **WHEN** the image is larger than 5MB
- **THEN** the upload is rejected with an error message
- **AND** the seller is prompted to compress or resize the image

#### Scenario: Maximum Images Limit
- **GIVEN** a car listing already has 10 images
- **WHEN** the seller attempts to upload another image
- **THEN** the upload is rejected
- **AND** an error message indicates the maximum limit has been reached

### Requirement: Image Data Persistence
Car images MUST be stored in a dedicated database table with proper relationships and constraints.

#### Scenario: Store Car Images in Database
- **GIVEN** a seller uploads 3 images for a car
- **WHEN** the images are processed
- **THEN** three records are inserted into the `car_images` table
- **AND** each record references the car's ID via foreign key
- **AND** the `display_order` field is set sequentially (0, 1, 2)
- **AND** the first image has `is_primary` set to true

#### Scenario: Cascade Delete on Car Removal
- **GIVEN** a car listing has 5 associated images
- **WHEN** the car listing is deleted
- **THEN** all 5 image records are automatically deleted via CASCADE
- **AND** no orphaned image records remain in the database

