/**
 * Product Service Contract Tests
 * Tests the ProductService interface without implementation
 * THESE TESTS MUST FAIL until ProductService is implemented
 */

describe('ProductService Contract Tests', () => {
  let ProductService
  let AuthService

  beforeEach(async () => {
    // Clear all storage before each test
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear IndexedDB
    if (global.indexedDB) {
      const databases = await indexedDB.databases()
      await Promise.all(
        databases.map(db => {
          return new Promise((resolve, reject) => {
            const deleteReq = indexedDB.deleteDatabase(db.name)
            deleteReq.onsuccess = () => resolve()
            deleteReq.onerror = () => reject(deleteReq.error)
          })
        })
      )
    }

    // Try to import services (will fail until implemented)
    try {
      ProductService = require('../../src/js/products.js')
      AuthService = require('../../src/js/auth.js')
    } catch (error) {
      // Expected to fail - services not implemented yet
      ProductService = null
      AuthService = null
    }
  })

  describe('Service Initialization', () => {
    test('should be defined and exported', () => {
      expect(ProductService).toBeDefined()
      expect(typeof ProductService).toBe('object')
    })

    test('should have all required methods', () => {
      expect(ProductService.createProduct).toBeDefined()
      expect(typeof ProductService.createProduct).toBe('function')
      
      expect(ProductService.getProducts).toBeDefined()
      expect(typeof ProductService.getProducts).toBe('function')
      
      expect(ProductService.getProduct).toBeDefined()
      expect(typeof ProductService.getProduct).toBe('function')
      
      expect(ProductService.updateProduct).toBeDefined()
      expect(typeof ProductService.updateProduct).toBe('function')
      
      expect(ProductService.deleteProduct).toBeDefined()
      expect(typeof ProductService.deleteProduct).toBe('function')
      
      expect(ProductService.searchProducts).toBeDefined()
      expect(typeof ProductService.searchProducts).toBe('function')
    })
  })

  describe('Product Creation', () => {
    const mockUser = global.createMockUser()
    
    beforeEach(async () => {
      // Mock authenticated user
      if (AuthService) {
        await AuthService.signup(mockUser.email, 'SecurePass123!')
      }
    })

    test('should create product with valid data', async () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product description',
        price: 29.99
      }

      const result = await ProductService.createProduct(productData)
      
      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('product')
      expect(result.product).toHaveProperty('id')
      expect(result.product).toHaveProperty('userId', mockUser.id)
      expect(result.product).toHaveProperty('name', productData.name)
      expect(result.product).toHaveProperty('description', productData.description)
      expect(result.product).toHaveProperty('price', productData.price)
      expect(result.product).toHaveProperty('createdAt')
      expect(result.product).toHaveProperty('updatedAt')
      expect(result).not.toHaveProperty('error')
    })

    test('should create product with minimal required data', async () => {
      const productData = {
        name: 'Minimal Product',
        price: 10.50
      }

      const result = await ProductService.createProduct(productData)
      
      expect(result).toHaveProperty('success', true)
      expect(result.product).toHaveProperty('name', productData.name)
      expect(result.product).toHaveProperty('price', productData.price)
      expect(result.product).toHaveProperty('description', '')
    })

    test('should generate unique product IDs', async () => {
      const productData1 = { name: 'Product 1', price: 10.00 }
      const productData2 = { name: 'Product 2', price: 20.00 }

      const result1 = await ProductService.createProduct(productData1)
      const result2 = await ProductService.createProduct(productData2)
      
      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result1.product.id).not.toBe(result2.product.id)
    })

    test('should reject product creation without authentication', async () => {
      if (AuthService) {
        await AuthService.logout()
      }

      const productData = {
        name: 'Unauthorized Product',
        price: 15.99
      }

      const result = await ProductService.createProduct(productData)
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')
      expect(result.error).toMatch(/not authenticated|unauthorized/i)
      expect(result).not.toHaveProperty('product')
    })

    test('should validate required fields', async () => {
      const invalidProducts = [
        { description: 'No name or price' },
        { name: '', price: 10.00 },
        { name: 'No price' },
        { name: 'Negative price', price: -5.00 },
        { name: 'Zero price', price: 0 },
        { name: 'Invalid price', price: 'not-a-number' }
      ]

      for (const productData of invalidProducts) {
        const result = await ProductService.createProduct(productData)
        
        expect(result).toHaveProperty('success', false)
        expect(result).toHaveProperty('error')
        expect(result).not.toHaveProperty('product')
      }
    })

    test('should validate field lengths and formats', async () => {
      const invalidProducts = [
        { 
          name: 'A'.repeat(101), // Too long name
          price: 10.00 
        },
        { 
          name: 'Valid Name',
          description: 'A'.repeat(501), // Too long description
          price: 10.00 
        },
        {
          name: 'Invalid Precision',
          price: 10.999 // Too many decimal places
        }
      ]

      for (const productData of invalidProducts) {
        const result = await ProductService.createProduct(productData)
        
        expect(result).toHaveProperty('success', false)
        expect(result).toHaveProperty('error')
        expect(result).not.toHaveProperty('product')
      }
    })

    test('should handle storage errors during creation', async () => {
      const productData = {
        name: 'Test Product',
        price: 29.99
      }

      // Simulate storage failure
      const originalIndexedDB = global.indexedDB
      global.indexedDB = null

      const result = await ProductService.createProduct(productData)
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')

      global.indexedDB = originalIndexedDB
    })
  })

  describe('Product Retrieval', () => {
    const mockUser = global.createMockUser()
    const otherUser = global.createMockUser()
    otherUser.id = 'other-user-id'
    otherUser.email = 'other@example.com'
    
    let userProducts = []
    let otherUserProducts = []

    beforeEach(async () => {
      if (AuthService && ProductService) {
        // Set up authenticated user
        await AuthService.signup(mockUser.email, 'SecurePass123!')
        
        // Create test products
        const product1 = await ProductService.createProduct({
          name: 'User Product 1',
          description: 'First product',
          price: 10.00
        })
        
        const product2 = await ProductService.createProduct({
          name: 'User Product 2',
          description: 'Second product',
          price: 20.00
        })
        
        userProducts = [product1.product, product2.product]

        // Simulate other user's products (would need special setup)
        otherUserProducts = [
          global.createMockProduct({ 
            id: 'other-product-1',
            name: 'Other User Product',
            userId: otherUser.id 
          })
        ]
      }
    })

    describe('getProducts', () => {
      test('should return all products for authenticated user', async () => {
        const products = await ProductService.getProducts()
        
        expect(Array.isArray(products)).toBe(true)
        expect(products).toHaveLength(2)
        
        products.forEach(product => {
          expect(product).toHaveProperty('userId', mockUser.id)
        })
      })

      test('should return empty array when user has no products', async () => {
        // Create new user with no products
        await AuthService.logout()
        await AuthService.signup('newuser@example.com', 'SecurePass123!')
        
        const products = await ProductService.getProducts()
        
        expect(Array.isArray(products)).toBe(true)
        expect(products).toHaveLength(0)
      })

      test('should not return products from other users', async () => {
        const products = await ProductService.getProducts()
        
        products.forEach(product => {
          expect(product.userId).toBe(mockUser.id)
          expect(product.userId).not.toBe(otherUser.id)
        })
      })

      test('should reject request without authentication', async () => {
        await AuthService.logout()
        
        await expect(ProductService.getProducts()).rejects.toThrow(/not authenticated|unauthorized/i)
      })

      test('should handle storage errors', async () => {
        const originalIndexedDB = global.indexedDB
        global.indexedDB = null

        await expect(ProductService.getProducts()).rejects.toThrow()

        global.indexedDB = originalIndexedDB
      })
    })

    describe('getProduct', () => {
      test('should return specific product by ID', async () => {
        const productId = userProducts[0].id
        
        const product = await ProductService.getProduct(productId)
        
        expect(product).not.toBeNull()
        expect(product).toHaveProperty('id', productId)
        expect(product).toHaveProperty('userId', mockUser.id)
      })

      test('should return null for non-existent product', async () => {
        const product = await ProductService.getProduct('nonexistent-id')
        
        expect(product).toBeNull()
      })

      test('should return null for product owned by different user', async () => {
        const otherProductId = otherUserProducts[0].id
        
        const product = await ProductService.getProduct(otherProductId)
        
        expect(product).toBeNull()
      })

      test('should reject request without authentication', async () => {
        const productId = userProducts[0].id
        await AuthService.logout()
        
        await expect(ProductService.getProduct(productId)).rejects.toThrow(/not authenticated|unauthorized/i)
      })

      test('should handle invalid product ID formats', async () => {
        const invalidIds = ['', null, undefined, 123, {}]

        for (const id of invalidIds) {
          const product = await ProductService.getProduct(id)
          expect(product).toBeNull()
        }
      })
    })
  })

  describe('Product Updates', () => {
    const mockUser = global.createMockUser()
    let testProduct

    beforeEach(async () => {
      if (AuthService && ProductService) {
        await AuthService.signup(mockUser.email, 'SecurePass123!')
        
        const createResult = await ProductService.createProduct({
          name: 'Original Product',
          description: 'Original description',
          price: 25.00
        })
        
        testProduct = createResult.product
      }
    })

    test('should update product with valid data', async () => {
      const updates = {
        name: 'Updated Product',
        description: 'Updated description',
        price: 35.00
      }

      const result = await ProductService.updateProduct(testProduct.id, updates)
      
      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('product')
      expect(result.product).toHaveProperty('id', testProduct.id)
      expect(result.product).toHaveProperty('name', updates.name)
      expect(result.product).toHaveProperty('description', updates.description)
      expect(result.product).toHaveProperty('price', updates.price)
      expect(result.product).toHaveProperty('updatedAt')
      expect(new Date(result.product.updatedAt)).toBeInstanceOf(Date)
      expect(result).not.toHaveProperty('error')
    })

    test('should allow partial updates', async () => {
      const updates = { name: 'Partially Updated' }

      const result = await ProductService.updateProduct(testProduct.id, updates)
      
      expect(result.success).toBe(true)
      expect(result.product.name).toBe(updates.name)
      expect(result.product.description).toBe(testProduct.description) // Unchanged
      expect(result.product.price).toBe(testProduct.price) // Unchanged
    })

    test('should validate updated fields', async () => {
      const invalidUpdates = [
        { name: '' },
        { name: 'A'.repeat(101) },
        { description: 'A'.repeat(501) },
        { price: -10.00 },
        { price: 0 },
        { price: 'invalid' }
      ]

      for (const updates of invalidUpdates) {
        const result = await ProductService.updateProduct(testProduct.id, updates)
        
        expect(result).toHaveProperty('success', false)
        expect(result).toHaveProperty('error')
        expect(result).not.toHaveProperty('product')
      }
    })

    test('should reject update for non-existent product', async () => {
      const updates = { name: 'Updated Name' }

      const result = await ProductService.updateProduct('nonexistent-id', updates)
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')
      expect(result.error).toMatch(/not found|does not exist/i)
      expect(result).not.toHaveProperty('product')
    })

    test('should reject update for product owned by different user', async () => {
      const otherUserProduct = global.createMockProduct({ userId: 'other-user-id' })
      const updates = { name: 'Hacked Name' }

      const result = await ProductService.updateProduct(otherUserProduct.id, updates)
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')
      expect(result.error).toMatch(/not found|unauthorized/i)
      expect(result).not.toHaveProperty('product')
    })

    test('should reject update without authentication', async () => {
      await AuthService.logout()
      const updates = { name: 'Unauthorized Update' }

      const result = await ProductService.updateProduct(testProduct.id, updates)
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')
      expect(result.error).toMatch(/not authenticated|unauthorized/i)
      expect(result).not.toHaveProperty('product')
    })

    test('should handle empty updates object', async () => {
      const result = await ProductService.updateProduct(testProduct.id, {})
      
      expect(result).toHaveProperty('success', true)
      expect(result.product).toEqual(expect.objectContaining({
        name: testProduct.name,
        description: testProduct.description,
        price: testProduct.price
      }))
    })
  })

  describe('Product Deletion', () => {
    const mockUser = global.createMockUser()
    let testProduct

    beforeEach(async () => {
      if (AuthService && ProductService) {
        await AuthService.signup(mockUser.email, 'SecurePass123!')
        
        const createResult = await ProductService.createProduct({
          name: 'Product to Delete',
          price: 15.00
        })
        
        testProduct = createResult.product
      }
    })

    test('should delete existing product', async () => {
      const result = await ProductService.deleteProduct(testProduct.id)
      
      expect(result).toHaveProperty('success', true)
      expect(result).not.toHaveProperty('error')
      
      // Verify product is actually deleted
      const deletedProduct = await ProductService.getProduct(testProduct.id)
      expect(deletedProduct).toBeNull()
    })

    test('should reject delete for non-existent product', async () => {
      const result = await ProductService.deleteProduct('nonexistent-id')
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')
      expect(result.error).toMatch(/not found|does not exist/i)
    })

    test('should reject delete for product owned by different user', async () => {
      const otherUserProduct = global.createMockProduct({ userId: 'other-user-id' })

      const result = await ProductService.deleteProduct(otherUserProduct.id)
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')
      expect(result.error).toMatch(/not found|unauthorized/i)
    })

    test('should reject delete without authentication', async () => {
      await AuthService.logout()

      const result = await ProductService.deleteProduct(testProduct.id)
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')
      expect(result.error).toMatch(/not authenticated|unauthorized/i)
    })

    test('should handle invalid product ID formats', async () => {
      const invalidIds = ['', null, undefined, 123, {}]

      for (const id of invalidIds) {
        const result = await ProductService.deleteProduct(id)
        
        expect(result).toHaveProperty('success', false)
        expect(result).toHaveProperty('error')
      }
    })

    test('should handle storage errors during deletion', async () => {
      const originalIndexedDB = global.indexedDB
      global.indexedDB = null

      const result = await ProductService.deleteProduct(testProduct.id)
      
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')

      global.indexedDB = originalIndexedDB
    })
  })

  describe('Product Search', () => {
    const mockUser = global.createMockUser()
    let searchableProducts = []

    beforeEach(async () => {
      if (AuthService && ProductService) {
        await AuthService.signup(mockUser.email, 'SecurePass123!')
        
        // Create products with different names and descriptions for search testing
        const productData = [
          { name: 'iPhone 13', description: 'Apple smartphone with advanced camera', price: 699.00 },
          { name: 'Samsung Galaxy', description: 'Android smartphone with great display', price: 599.00 },
          { name: 'MacBook Pro', description: 'Apple laptop for professionals', price: 1299.00 },
          { name: 'Dell Laptop', description: 'Windows laptop for business use', price: 899.00 },
          { name: 'Wireless Headphones', description: 'Bluetooth headphones with noise cancellation', price: 199.00 }
        ]

        for (const data of productData) {
          const result = await ProductService.createProduct(data)
          searchableProducts.push(result.product)
        }
      }
    })

    test('should search products by name', async () => {
      const results = await ProductService.searchProducts('iPhone')
      
      expect(Array.isArray(results)).toBe(true)
      expect(results).toHaveLength(1)
      expect(results[0]).toHaveProperty('name', 'iPhone 13')
    })

    test('should search products by description', async () => {
      const results = await ProductService.searchProducts('smartphone')
      
      expect(Array.isArray(results)).toBe(true)
      expect(results).toHaveLength(2)
      
      const names = results.map(p => p.name)
      expect(names).toContain('iPhone 13')
      expect(names).toContain('Samsung Galaxy')
    })

    test('should perform case-insensitive search', async () => {
      const results = await ProductService.searchProducts('APPLE')
      
      expect(Array.isArray(results)).toBe(true)
      expect(results).toHaveLength(2)
      
      const names = results.map(p => p.name)
      expect(names).toContain('iPhone 13')
      expect(names).toContain('MacBook Pro')
    })

    test('should return partial matches', async () => {
      const results = await ProductService.searchProducts('lap')
      
      expect(Array.isArray(results)).toBe(true)
      expect(results).toHaveLength(2)
      
      const names = results.map(p => p.name)
      expect(names).toContain('MacBook Pro')
      expect(names).toContain('Dell Laptop')
    })

    test('should return empty array for no matches', async () => {
      const results = await ProductService.searchProducts('nonexistent')
      
      expect(Array.isArray(results)).toBe(true)
      expect(results).toHaveLength(0)
    })

    test('should handle empty search query', async () => {
      const results = await ProductService.searchProducts('')
      
      expect(Array.isArray(results)).toBe(true)
      expect(results).toHaveLength(searchableProducts.length)
    })

    test('should only search within user\'s products', async () => {
      // All results should belong to the current user
      const results = await ProductService.searchProducts('laptop')
      
      results.forEach(product => {
        expect(product).toHaveProperty('userId', mockUser.id)
      })
    })

    test('should reject search without authentication', async () => {
      await AuthService.logout()
      
      await expect(ProductService.searchProducts('test')).rejects.toThrow(/not authenticated|unauthorized/i)
    })

    test('should handle special characters in search query', async () => {
      const specialQueries = ['@#$%', '   ', '\n\t', '123!@#']

      for (const query of specialQueries) {
        const results = await ProductService.searchProducts(query)
        expect(Array.isArray(results)).toBe(true)
      }
    })
  })

  describe('Error Handling and Edge Cases', () => {
    test('should handle null/undefined method parameters', async () => {
      const nullInputTests = [
        () => ProductService.createProduct(null),
        () => ProductService.getProduct(null),
        () => ProductService.updateProduct(null, {}),
        () => ProductService.updateProduct('valid-id', null),
        () => ProductService.deleteProduct(null),
        () => ProductService.searchProducts(null)
      ]

      for (const testFn of nullInputTests) {
        const result = await testFn()
        
        if (result && typeof result === 'object') {
          if ('success' in result) {
            expect(result.success).toBe(false)
          } else {
            expect(result).toBeNull()
          }
        }
      }
    })

    test('should handle concurrent operations gracefully', async () => {
      if (AuthService) {
        await AuthService.signup('test@example.com', 'SecurePass123!')
      }

      const productData = { name: 'Concurrent Product', price: 10.00 }
      
      // Create multiple products simultaneously
      const promises = Array(5).fill().map(() => 
        ProductService.createProduct(productData)
      )
      
      const results = await Promise.all(promises)
      
      results.forEach(result => {
        expect(result).toHaveProperty('success', true)
        expect(result.product).toHaveProperty('id')
      })
      
      // All products should have unique IDs
      const ids = results.map(r => r.product.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    test('should maintain data consistency during operations', async () => {
      if (AuthService) {
        await AuthService.signup('test@example.com', 'SecurePass123!')
      }

      // Create product
      const createResult = await ProductService.createProduct({
        name: 'Consistency Test',
        price: 50.00
      })
      
      expect(createResult.success).toBe(true)
      const productId = createResult.product.id
      
      // Verify creation
      const retrievedProduct = await ProductService.getProduct(productId)
      expect(retrievedProduct).not.toBeNull()
      expect(retrievedProduct.name).toBe('Consistency Test')
      
      // Update product
      const updateResult = await ProductService.updateProduct(productId, {
        name: 'Updated Test',
        price: 75.00
      })
      
      expect(updateResult.success).toBe(true)
      
      // Verify update
      const updatedProduct = await ProductService.getProduct(productId)
      expect(updatedProduct.name).toBe('Updated Test')
      expect(updatedProduct.price).toBe(75.00)
      
      // Delete product
      const deleteResult = await ProductService.deleteProduct(productId)
      expect(deleteResult.success).toBe(true)
      
      // Verify deletion
      const deletedProduct = await ProductService.getProduct(productId)
      expect(deletedProduct).toBeNull()
    })
  })
})