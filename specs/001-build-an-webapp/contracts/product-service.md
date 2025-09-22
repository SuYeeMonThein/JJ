# Product Service Contract

## ProductService Interface

### createProduct(productData: CreateProductRequest): Promise<ProductResult>
**Purpose**: Create a new product for authenticated user
**Input**: CreateProductRequest object
```javascript
{
  name: string,        // Required, 1-100 chars
  description?: string, // Optional, max 500 chars  
  price: number        // Required, positive with 2 decimals
}
```

**Output**: ProductResult object
```javascript
{
  success: boolean,
  product?: {
    id: string,
    userId: string,
    name: string,
    description: string,
    price: number,
    createdAt: timestamp,
    updatedAt: timestamp
  },
  error?: string
}
```

### getProducts(): Promise<Product[]>
**Purpose**: Retrieve all products for authenticated user
**Input**: None (uses current user session)
**Output**: Array of Product objects

**Security**: Only returns products owned by current user

### getProduct(id: string): Promise<Product | null>
**Purpose**: Retrieve specific product by ID
**Input**: Product ID string
**Output**: Product object or null if not found/unauthorized

**Security**: Only returns product if owned by current user

### updateProduct(id: string, updates: UpdateProductRequest): Promise<ProductResult>
**Purpose**: Update existing product
**Input**: 
- id: Product ID string
- updates: Partial product data to update

**Output**: ProductResult object (same as createProduct)

**Security**: Only allows updates to products owned by current user

### deleteProduct(id: string): Promise<DeleteResult>
**Purpose**: Delete product by ID
**Input**: Product ID string
**Output**: DeleteResult object
```javascript
{
  success: boolean,
  error?: string
}
```

**Security**: Only allows deletion of products owned by current user

### searchProducts(query: string): Promise<Product[]>
**Purpose**: Search user's products by name/description
**Input**: Search query string
**Output**: Array of matching Product objects

**Security**: Only searches within current user's products