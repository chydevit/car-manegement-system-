## ADDED Requirements

### Requirement: Seller Account Creation
The system MUST allow administrators to create new seller accounts by providing name, email, and password.

#### Scenario: Admin Creates Seller
- **WHEN** an authenticated administrator submits valid details
- **THEN** a new user with the "seller" role is created and appears in the user list.

### Requirement: User Activation Control
The system MUST allow administrators to activate or deactivate any user account (except their own).

#### Scenario: Deactivate Seller
- **WHEN** an administrator clicks "Deactivate" on an active seller account
- **THEN** the seller's `isActive` status is set to false and they cannot log in.

### Requirement: Admin Management
The system MUST allow administrators to promote or demote other users to "admin" role.

#### Scenario: Promote User to Admin
- **WHEN** an administrator changes a regular user's role to "admin"
- **THEN** that user gains access to all administrative functions upon next login.
