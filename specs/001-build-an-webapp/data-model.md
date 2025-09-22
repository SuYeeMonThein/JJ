# Data Model: User Authentication & Product Management

## Entities

### User
Represents a registered user account in the client-side application.

**Fields**:
- `id`: Unique identifier (UUID v4)
- `email`: User's email address (primary key for login)
- `passwordHash`: PBKDF2 hashed password with salt
- `salt`: Random salt for password hashing
- `createdAt`: Account creation timestamp
- `lastLoginAt`: Last successful login timestamp

**Validation Rules**:
- Email must be valid format and unique within browser storage
- Password minimum 8 characters, must contain uppercase, lowercase, number
- Salt must be cryptographically random (32 bytes)

**Storage**: localStorage (user credentials and session)

### Product
Represents a product item managed by authenticated users.

**Fields**:
- `id`: Unique identifier (UUID v4)
- `userId`: Reference to owning user (foreign key)
- `name`: Product name (required, 1-100 characters)
- `description`: Product description (optional, max 500 characters)
- `price`: Numeric price (required, positive number with 2 decimal places)
- `createdAt`: Product creation timestamp
- `updatedAt`: Last modification timestamp

**Validation Rules**:
- Name is required and must be 1-100 characters
- Price must be positive number with max 2 decimal places
- Description limited to 500 characters
- userId must match authenticated user (data isolation)

**Storage**: IndexedDB (structured data with indexing)

## Relationships

- **User → Products**: One-to-many relationship
- Each user can have multiple products
- Products are isolated by userId (security constraint)
- Deleting user account should cascade delete all user's products

## State Transitions

### User Authentication States
1. **Anonymous** → Sign up → **Registered + Logged In**
2. **Anonymous** → Log in → **Logged In**
3. **Logged In** → Log out → **Anonymous**
4. **Logged In** → Session expires → **Anonymous**

### Product Lifecycle States
1. **Non-existent** → Create → **Active**
2. **Active** → Edit → **Active** (updated)
3. **Active** → Delete → **Non-existent**

## Data Storage Schema

### localStorage Schema
```javascript
// Session data
sessionData: {
  userId: string,
  email: string,
  loginToken: string,
  expiresAt: timestamp
}

// User credentials (hashed)
users: {
  [email]: {
    id: string,
    email: string,
    passwordHash: string,
    salt: string,
    createdAt: timestamp,
    lastLoginAt: timestamp
  }
}
```

### IndexedDB Schema
```javascript
// Products store
products: {
  keyPath: 'id',
  indexes: ['userId', 'createdAt'],
  schema: {
    id: string (UUID),
    userId: string,
    name: string,
    description: string,
    price: number,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
```