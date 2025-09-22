# Authentication Service Contract

## AuthService Interface

### signup(email: string, password: string): Promise<AuthResult>
**Purpose**: Register a new user account
**Input**: 
- email: Valid email address string
- password: Plain text password (min 8 chars)

**Output**: AuthResult object
```javascript
{
  success: boolean,
  user?: {
    id: string,
    email: string,
    createdAt: timestamp
  },
  error?: string,
  token?: string
}
```

**Validation**:
- Email format validation
- Password strength requirements
- Duplicate email check
- Automatic login after successful signup

### login(email: string, password: string): Promise<AuthResult>
**Purpose**: Authenticate existing user
**Input**:
- email: Registered email address
- password: Plain text password

**Output**: AuthResult object (same as signup)

**Validation**:
- Email exists in storage
- Password hash verification
- Session token generation

### logout(): Promise<void>
**Purpose**: End user session
**Input**: None (uses current session)
**Output**: Promise resolves when session cleared

**Effects**:
- Clear session from localStorage
- Clear user state from memory
- Redirect to login page

### getCurrentUser(): User | null
**Purpose**: Get currently authenticated user
**Input**: None
**Output**: User object or null if not authenticated

### isAuthenticated(): boolean
**Purpose**: Check if user is currently logged in
**Input**: None  
**Output**: Boolean authentication status

**Validation**:
- Check session token exists
- Verify token not expired
- Validate token format