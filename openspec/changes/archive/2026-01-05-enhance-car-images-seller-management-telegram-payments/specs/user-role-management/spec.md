# user-role-management Spec Delta

## Purpose
This spec delta extends the user role management capability to enable administrators to create seller accounts directly through the admin dashboard, with comprehensive audit logging for security and compliance. This streamlines seller onboarding and improves administrative control.

## ADDED Requirements

### Requirement: Admin Seller Account Creation
Administrators MUST be able to create new seller accounts directly through the admin dashboard with complete user details and automatic credential generation.

#### Scenario: Create Seller Account with Auto-Generated Password
- **GIVEN** an authenticated administrator accesses the seller creation form
- **WHEN** they submit valid details (name, email) without providing a password
- **THEN** a new user with role "seller" is created in the database
- **AND** a secure random password is automatically generated
- **AND** the password is hashed before storage
- **AND** the temporary password is returned to the admin (displayed once)
- **AND** the seller account is immediately active

#### Scenario: Create Seller Account with Custom Password
- **GIVEN** an authenticated administrator accesses the seller creation form
- **WHEN** they submit valid details including a custom password
- **THEN** the password is validated for strength requirements
- **AND** if valid, a new seller account is created with the provided password
- **AND** the password is hashed before storage
- **AND** the account is immediately active

#### Scenario: Prevent Duplicate Seller Email
- **GIVEN** a seller account exists with email "seller@example.com"
- **WHEN** an administrator attempts to create another seller with the same email
- **THEN** the creation is rejected with a validation error
- **AND** an error message indicates the email is already in use

#### Scenario: Admin-Only Access to Seller Creation
- **GIVEN** a user with role "seller" or "user" is authenticated
- **WHEN** they attempt to access the seller creation endpoint
- **THEN** the request is rejected with a 403 Forbidden status
- **AND** an error message indicates insufficient permissions

### Requirement: Admin Action Audit Logging
All administrative actions MUST be logged in an audit trail for security and compliance purposes.

#### Scenario: Log Seller Account Creation
- **GIVEN** an administrator creates a new seller account
- **WHEN** the account is successfully created
- **THEN** an audit log entry is created in the `admin_actions` table
- **AND** the log includes the admin's ID, action type ("create_seller"), target user ID, and timestamp
- **AND** additional details (email, name) are stored in the `details` JSONB field

#### Scenario: Query Admin Action History
- **GIVEN** multiple admin actions have been logged
- **WHEN** an administrator requests the audit log
- **THEN** all logged actions are returned in reverse chronological order
- **AND** each entry includes admin name, action type, target, and timestamp
- **AND** sensitive information (passwords) is excluded from the log

## MODIFIED Requirements

### Requirement: Seller Account Creation
The system MUST allow administrators to create new seller accounts **through the admin dashboard interface** by providing name, email, and optional password **with automatic credential generation support**.

#### Scenario: Admin Creates Seller via Dashboard
- **GIVEN** an authenticated administrator is on the admin dashboard
- **WHEN** they navigate to the "Create Seller" section and submit valid details
- **THEN** a new user with the "seller" role is created
- **AND** the seller appears in the user list immediately
- **AND** the admin receives the temporary credentials to share with the seller
- **AND** an audit log entry is created

## REMOVED Requirements

None - all existing requirements remain valid and are enhanced by the new functionality.
