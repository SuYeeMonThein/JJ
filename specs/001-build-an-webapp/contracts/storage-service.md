# Storage Service Contract

## StorageService Interface

### User Data Operations

### saveUser(user: User): Promise<void>
**Purpose**: Persist user credentials to localStorage
**Input**: User object with hashed password
**Output**: Promise resolves when saved

### getUser(email: string): Promise<User | null>
**Purpose**: Retrieve user by email
**Input**: Email address string
**Output**: User object or null if not found

### userExists(email: string): Promise<boolean>
**Purpose**: Check if user account exists
**Input**: Email address string
**Output**: Boolean existence status

### Product Data Operations

### saveProduct(product: Product): Promise<void>
**Purpose**: Persist product to IndexedDB
**Input**: Complete Product object
**Output**: Promise resolves when saved

### getProducts(userId: string): Promise<Product[]>
**Purpose**: Retrieve all products for user
**Input**: User ID string
**Output**: Array of Product objects

### getProduct(id: string, userId: string): Promise<Product | null>
**Purpose**: Retrieve specific product with ownership check
**Input**: Product ID and User ID strings
**Output**: Product object or null if not found/unauthorized

### updateProduct(id: string, updates: Partial<Product>, userId: string): Promise<void>
**Purpose**: Update product with ownership validation
**Input**: Product ID, update data, User ID
**Output**: Promise resolves when updated

### deleteProduct(id: string, userId: string): Promise<void>
**Purpose**: Delete product with ownership validation
**Input**: Product ID and User ID strings
**Output**: Promise resolves when deleted

### Session Management

### saveSession(sessionData: SessionData): void
**Purpose**: Store session data in localStorage
**Input**: Session data object
**Output**: Synchronous operation

### getSession(): SessionData | null
**Purpose**: Retrieve current session data
**Input**: None
**Output**: Session data or null if no session

### clearSession(): void
**Purpose**: Remove session data
**Input**: None
**Output**: Synchronous operation

### Database Initialization

### initializeDatabase(): Promise<void>
**Purpose**: Set up IndexedDB schema and stores
**Input**: None
**Output**: Promise resolves when database ready

### clearAllData(): Promise<void>
**Purpose**: Clear all user data (for testing/reset)
**Input**: None
**Output**: Promise resolves when data cleared