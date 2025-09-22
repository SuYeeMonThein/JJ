/**
 * Product CRUD Integration Tests
 * Tests complete product management lifecycle with UI interactions
 * THESE TESTS MUST FAIL until implementation is complete
 */

describe('Product CRUD Integration Tests', () => {
  let ProductService
  let AuthService
  let DOM
  
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

    // Create DOM for product management interface
    document.body.innerHTML = `
      <div id="app">
        <nav class="main-nav">
          <div class="nav-brand">Product Manager</div>
          <div class="nav-user">
            <span id="user-email">test@example.com</span>
            <button id="logout-btn" class="btn-secondary">Logout</button>
          </div>
        </nav>
        
        <main class="dashboard">
          <header class="dashboard-header">
            <h1>My Products</h1>
            <button id="add-product-btn" class="btn-primary">Add New Product</button>
          </header>
          
          <div class="search-section">
            <div class="search-bar">
              <input type="text" id="search-input" placeholder="Search products..." />
              <button id="search-btn" class="btn-secondary">Search</button>
              <button id="clear-search-btn" class="btn-text">Clear</button>
            </div>
          </div>
          
          <div id="product-list" class="product-grid">
            <div id="no-products" class="empty-state" style="display: none;">
              <h3>No products found</h3>
              <p>Get started by adding your first product.</p>
              <button class="btn-primary">Add Product</button>
            </div>
          </div>
          
          <div id="loading" class="loading-indicator" style="display: none;">
            <div class="spinner"></div>
            <p>Loading products...</p>
          </div>
        </main>
        
        <!-- Product Form Modal -->
        <div id="product-modal" class="modal" style="display: none;">
          <div class="modal-content">
            <div class="modal-header">
              <h2 id="modal-title">Add New Product</h2>
              <button id="close-modal-btn" class="btn-close">&times;</button>
            </div>
            
            <form id="product-form" class="product-form">
              <div class="form-group">
                <label for="product-name">Product Name</label>
                <input type="text" id="product-name" name="name" required maxlength="100">
                <span class="error-message" id="name-error"></span>
              </div>
              
              <div class="form-group">
                <label for="product-description">Description</label>
                <textarea id="product-description" name="description" maxlength="500" rows="4"></textarea>
                <span class="error-message" id="description-error"></span>
              </div>
              
              <div class="form-group">
                <label for="product-price">Price ($)</label>
                <input type="number" id="product-price" name="price" required min="0" step="0.01">
                <span class="error-message" id="price-error"></span>
              </div>
              
              <div class="form-actions">
                <button type="button" id="cancel-btn" class="btn-secondary">Cancel</button>
                <button type="submit" id="save-btn" class="btn-primary">
                  <span class="btn-text">Save Product</span>
                  <span class="loading-spinner" style="display: none;">Saving...</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Delete Confirmation Modal -->
        <div id="delete-modal" class="modal" style="display: none;">
          <div class="modal-content">
            <div class="modal-header">
              <h2>Confirm Delete</h2>
              <button id="close-delete-modal-btn" class="btn-close">&times;</button>
            </div>
            
            <div class="modal-body">
              <p>Are you sure you want to delete "<span id="delete-product-name"></span>"?</p>
              <p class="warning">This action cannot be undone.</p>
            </div>
            
            <div class="modal-footer">
              <button id="cancel-delete-btn" class="btn-secondary">Cancel</button>
              <button id="confirm-delete-btn" class="btn-danger">
                <span class="btn-text">Delete Product</span>
                <span class="loading-spinner" style="display: none;">Deleting...</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Success/Error Messages -->
        <div id="success-message" class="success-alert" style="display: none;">
          <span id="success-text"></span>
        </div>
        
        <div id="error-message" class="error-alert" style="display: none;">
          <span id="error-text"></span>
        </div>
      </div>
    `

    // Store DOM references
    DOM = {
      addProductBtn: document.getElementById('add-product-btn'),
      searchInput: document.getElementById('search-input'),
      searchBtn: document.getElementById('search-btn'),
      clearSearchBtn: document.getElementById('clear-search-btn'),
      productList: document.getElementById('product-list'),
      noProducts: document.getElementById('no-products'),
      loading: document.getElementById('loading'),
      
      // Product Modal
      productModal: document.getElementById('product-modal'),
      modalTitle: document.getElementById('modal-title'),
      closeModalBtn: document.getElementById('close-modal-btn'),
      productForm: document.getElementById('product-form'),
      productName: document.getElementById('product-name'),
      productDescription: document.getElementById('product-description'),
      productPrice: document.getElementById('product-price'),
      nameError: document.getElementById('name-error'),
      descriptionError: document.getElementById('description-error'),
      priceError: document.getElementById('price-error'),
      cancelBtn: document.getElementById('cancel-btn'),
      saveBtn: document.getElementById('save-btn'),
      saveBtnText: document.querySelector('#save-btn .btn-text'),
      saveSpinner: document.querySelector('#save-btn .loading-spinner'),
      
      // Delete Modal
      deleteModal: document.getElementById('delete-modal'),
      closeDeleteModalBtn: document.getElementById('close-delete-modal-btn'),
      deleteProductName: document.getElementById('delete-product-name'),
      cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
      confirmDeleteBtn: document.getElementById('confirm-delete-btn'),
      deleteBtnText: document.querySelector('#confirm-delete-btn .btn-text'),
      deleteSpinner: document.querySelector('#confirm-delete-btn .loading-spinner'),
      
      // Messages
      successMessage: document.getElementById('success-message'),
      successText: document.getElementById('success-text'),
      errorMessage: document.getElementById('error-message'),
      errorText: document.getElementById('error-text')
    }

    // Set up authenticated state
    if (AuthService) {
      localStorage.setItem('sessionToken', 'test-token')
      sessionStorage.setItem('isAuthenticated', 'true')
    }
  })

  describe('Product List Display', () => {
    test('should render product management interface', () => {
      expect(DOM.addProductBtn).toBeTruthy()
      expect(DOM.searchInput).toBeTruthy()
      expect(DOM.productList).toBeTruthy()
      expect(DOM.productModal).toBeTruthy()
      expect(DOM.deleteModal).toBeTruthy()
    })

    test('should show loading state while fetching products', async () => {
      // Simulate page load
      const loadEvent = new Event('load')
      window.dispatchEvent(loadEvent)
      
      expect(DOM.loading.style.display).not.toBe('none')
      expect(DOM.productList.children.length).toBe(1) // Only no-products div
    })

    test('should display empty state when no products exist', async () => {
      // Simulate empty product list response
      const loadEvent = new Event('load')
      window.dispatchEvent(loadEvent)
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(DOM.noProducts.style.display).not.toBe('none')
      expect(DOM.loading.style.display).toBe('none')
    })

    test('should display product list when products exist', async () => {
      // This would be populated by ProductService.getProducts()
      const mockProducts = [
        { id: '1', name: 'Product 1', description: 'Description 1', price: 10.00 },
        { id: '2', name: 'Product 2', description: 'Description 2', price: 20.00 }
      ]
      
      // Simulate products loaded
      mockProducts.forEach(product => {
        const productCard = document.createElement('div')
        productCard.className = 'product-card'
        productCard.dataset.productId = product.id
        productCard.innerHTML = `
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="price">$${product.price}</div>
          <div class="actions">
            <button class="btn-edit" data-product-id="${product.id}">Edit</button>
            <button class="btn-delete" data-product-id="${product.id}">Delete</button>
          </div>
        `
        DOM.productList.appendChild(productCard)
      })
      
      expect(DOM.productList.children.length).toBe(3) // 2 products + no-products div
      expect(DOM.noProducts.style.display).toBe('none')
      
      const productCards = DOM.productList.querySelectorAll('.product-card')
      expect(productCards).toHaveLength(2)
      expect(productCards[0].querySelector('h3').textContent).toBe('Product 1')
      expect(productCards[1].querySelector('h3').textContent).toBe('Product 2')
    })

    test('should integrate with ProductService to fetch products', async () => {
      expect(ProductService).toBeTruthy()
      expect(typeof ProductService.getProducts).toBe('function')
      
      const loadEvent = new Event('load')
      window.dispatchEvent(loadEvent)
      
      // ProductService.getProducts should be called
      expect(ProductService.getProducts).toHaveBeenCalled()
    })

    test('should handle errors when fetching products', async () => {
      // Simulate service error
      const errorEvent = new CustomEvent('productFetchError', {
        detail: { error: 'Failed to fetch products' }
      })
      document.dispatchEvent(errorEvent)
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(DOM.errorMessage.style.display).not.toBe('none')
      expect(DOM.errorText.textContent).toMatch(/failed|error/i)
      expect(DOM.loading.style.display).toBe('none')
    })
  })

  describe('Product Search', () => {
    beforeEach(() => {
      // Add some mock products to search
      const mockProducts = [
        { id: '1', name: 'iPhone 13', description: 'Apple smartphone', price: 699.00 },
        { id: '2', name: 'Samsung Galaxy', description: 'Android phone', price: 599.00 },
        { id: '3', name: 'MacBook Pro', description: 'Apple laptop', price: 1299.00 }
      ]
      
      mockProducts.forEach(product => {
        const productCard = document.createElement('div')
        productCard.className = 'product-card'
        productCard.dataset.productId = product.id
        productCard.innerHTML = `
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="price">$${product.price}</div>
        `
        DOM.productList.appendChild(productCard)
      })
    })

    test('should filter products by search query', async () => {
      DOM.searchInput.value = 'iPhone'
      
      const clickEvent = new Event('click', { bubbles: true })
      DOM.searchBtn.dispatchEvent(clickEvent)
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Should show only matching products
      const visibleCards = DOM.productList.querySelectorAll('.product-card:not([style*="display: none"])')
      expect(visibleCards).toHaveLength(1)
      expect(visibleCards[0].querySelector('h3').textContent).toBe('iPhone 13')
    })

    test('should search on Enter key press', async () => {
      DOM.searchInput.value = 'Apple'
      
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
      DOM.searchInput.dispatchEvent(enterEvent)
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Should show Apple products
      const visibleCards = DOM.productList.querySelectorAll('.product-card:not([style*="display: none"])')
      expect(visibleCards.length).toBeGreaterThan(0)
    })

    test('should integrate with ProductService search', async () => {
      expect(ProductService).toBeTruthy()
      expect(typeof ProductService.searchProducts).toBe('function')
      
      DOM.searchInput.value = 'search query'
      
      const clickEvent = new Event('click', { bubbles: true })
      DOM.searchBtn.dispatchEvent(clickEvent)
      
      // ProductService.searchProducts should be called
      expect(ProductService.searchProducts).toHaveBeenCalledWith('search query')
    })

    test('should clear search results', async () => {
      // First perform a search
      DOM.searchInput.value = 'iPhone'
      DOM.searchBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Then clear search
      const clickEvent = new Event('click', { bubbles: true })
      DOM.clearSearchBtn.dispatchEvent(clickEvent)
      
      expect(DOM.searchInput.value).toBe('')
      
      // All products should be visible again
      const visibleCards = DOM.productList.querySelectorAll('.product-card:not([style*="display: none"])')
      expect(visibleCards).toHaveLength(3)
    })

    test('should show no results message for empty search', async () => {
      DOM.searchInput.value = 'nonexistent'
      
      const clickEvent = new Event('click', { bubbles: true })
      DOM.searchBtn.dispatchEvent(clickEvent)
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const visibleCards = DOM.productList.querySelectorAll('.product-card:not([style*="display: none"])')
      expect(visibleCards).toHaveLength(0)
      expect(DOM.noProducts.style.display).not.toBe('none')
    })
  })

  describe('Add Product Flow', () => {
    test('should open add product modal', () => {
      const clickEvent = new Event('click', { bubbles: true })
      DOM.addProductBtn.dispatchEvent(clickEvent)
      
      expect(DOM.productModal.style.display).not.toBe('none')
      expect(DOM.modalTitle.textContent).toBe('Add New Product')
      expect(DOM.productForm.reset).toBeDefined()
    })

    test('should validate required fields', async () => {
      // Open modal
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      // Try to submit empty form
      const submitEvent = new Event('submit', { bubbles: true })
      DOM.productForm.dispatchEvent(submitEvent)
      
      expect(DOM.nameError.textContent).toBeTruthy()
      expect(DOM.priceError.textContent).toBeTruthy()
    })

    test('should validate field lengths and formats', async () => {
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      // Test long name
      DOM.productName.value = 'A'.repeat(101)
      DOM.productName.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(DOM.nameError.textContent).toBeTruthy()
      expect(DOM.nameError.textContent).toMatch(/too long|maximum/i)
      
      // Test long description
      DOM.productDescription.value = 'A'.repeat(501)
      DOM.productDescription.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(DOM.descriptionError.textContent).toBeTruthy()
      
      // Test invalid price
      DOM.productPrice.value = '-10'
      DOM.productPrice.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(DOM.priceError.textContent).toBeTruthy()
    })

    test('should create product with valid data', async () => {
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      // Fill form with valid data
      DOM.productName.value = 'New Product'
      DOM.productDescription.value = 'A great new product'
      DOM.productPrice.value = '29.99'
      
      const submitEvent = new Event('submit', { bubbles: true })
      DOM.productForm.dispatchEvent(submitEvent)
      
      // Should show loading state
      expect(DOM.saveBtn.disabled).toBe(true)
      expect(DOM.saveSpinner.style.display).not.toBe('none')
      expect(DOM.saveBtnText.style.display).toBe('none')
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Should close modal and show success
      expect(DOM.productModal.style.display).toBe('none')
      expect(DOM.successMessage.style.display).not.toBe('none')
      expect(DOM.successText.textContent).toMatch(/created|added/i)
    })

    test('should integrate with ProductService create', async () => {
      expect(ProductService).toBeTruthy()
      expect(typeof ProductService.createProduct).toBe('function')
      
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      DOM.productName.value = 'Service Product'
      DOM.productDescription.value = 'Test product'
      DOM.productPrice.value = '19.99'
      
      const submitEvent = new Event('submit', { bubbles: true })
      DOM.productForm.dispatchEvent(submitEvent)
      
      // ProductService.createProduct should be called
      expect(ProductService.createProduct).toHaveBeenCalledWith({
        name: 'Service Product',
        description: 'Test product',
        price: 19.99
      })
    })

    test('should handle creation errors', async () => {
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      // Simulate creation error
      const errorEvent = new CustomEvent('productCreateError', {
        detail: { error: 'Failed to create product' }
      })
      document.dispatchEvent(errorEvent)
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(DOM.errorMessage.style.display).not.toBe('none')
      expect(DOM.errorText.textContent).toMatch(/failed|error/i)
      expect(DOM.saveBtn.disabled).toBe(false)
    })

    test('should close modal on cancel', () => {
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      const clickEvent = new Event('click', { bubbles: true })
      DOM.cancelBtn.dispatchEvent(clickEvent)
      
      expect(DOM.productModal.style.display).toBe('none')
    })

    test('should close modal on close button', () => {
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      const clickEvent = new Event('click', { bubbles: true })
      DOM.closeModalBtn.dispatchEvent(clickEvent)
      
      expect(DOM.productModal.style.display).toBe('none')
    })
  })

  describe('Edit Product Flow', () => {
    beforeEach(() => {
      // Add a product card for editing
      const productCard = document.createElement('div')
      productCard.className = 'product-card'
      productCard.dataset.productId = 'edit-test-1'
      productCard.innerHTML = `
        <h3>Editable Product</h3>
        <p>Original description</p>
        <div class="price">$15.99</div>
        <div class="actions">
          <button class="btn-edit" data-product-id="edit-test-1">Edit</button>
          <button class="btn-delete" data-product-id="edit-test-1">Delete</button>
        </div>
      `
      DOM.productList.appendChild(productCard)
    })

    test('should open edit modal with product data', async () => {
      const editBtn = DOM.productList.querySelector('.btn-edit')
      
      const clickEvent = new Event('click', { bubbles: true })
      editBtn.dispatchEvent(clickEvent)
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(DOM.productModal.style.display).not.toBe('none')
      expect(DOM.modalTitle.textContent).toBe('Edit Product')
      
      // Form should be populated with existing data
      expect(DOM.productName.value).toBe('Editable Product')
      expect(DOM.productDescription.value).toBe('Original description')
      expect(DOM.productPrice.value).toBe('15.99')
    })

    test('should integrate with ProductService getProduct', async () => {
      expect(ProductService).toBeTruthy()
      expect(typeof ProductService.getProduct).toBe('function')
      
      const editBtn = DOM.productList.querySelector('.btn-edit')
      const clickEvent = new Event('click', { bubbles: true })
      editBtn.dispatchEvent(clickEvent)
      
      // ProductService.getProduct should be called
      expect(ProductService.getProduct).toHaveBeenCalledWith('edit-test-1')
    })

    test('should update product with modified data', async () => {
      const editBtn = DOM.productList.querySelector('.btn-edit')
      editBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Modify form data
      DOM.productName.value = 'Updated Product'
      DOM.productDescription.value = 'Updated description'
      DOM.productPrice.value = '25.99'
      
      const submitEvent = new Event('submit', { bubbles: true })
      DOM.productForm.dispatchEvent(submitEvent)
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Should show success and close modal
      expect(DOM.productModal.style.display).toBe('none')
      expect(DOM.successMessage.style.display).not.toBe('none')
      expect(DOM.successText.textContent).toMatch(/updated|saved/i)
    })

    test('should integrate with ProductService updateProduct', async () => {
      expect(ProductService).toBeTruthy()
      expect(typeof ProductService.updateProduct).toBe('function')
      
      const editBtn = DOM.productList.querySelector('.btn-edit')
      editBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      DOM.productName.value = 'Service Update'
      DOM.productPrice.value = '99.99'
      
      const submitEvent = new Event('submit', { bubbles: true })
      DOM.productForm.dispatchEvent(submitEvent)
      
      // ProductService.updateProduct should be called
      expect(ProductService.updateProduct).toHaveBeenCalledWith('edit-test-1', {
        name: 'Service Update',
        description: 'Original description',
        price: 99.99
      })
    })

    test('should handle update errors', async () => {
      const editBtn = DOM.productList.querySelector('.btn-edit')
      editBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Simulate update error
      const errorEvent = new CustomEvent('productUpdateError', {
        detail: { error: 'Failed to update product' }
      })
      document.dispatchEvent(errorEvent)
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(DOM.errorMessage.style.display).not.toBe('none')
      expect(DOM.errorText.textContent).toMatch(/failed|error/i)
    })
  })

  describe('Delete Product Flow', () => {
    beforeEach(() => {
      // Add a product card for deletion
      const productCard = document.createElement('div')
      productCard.className = 'product-card'
      productCard.dataset.productId = 'delete-test-1'
      productCard.innerHTML = `
        <h3>Deletable Product</h3>
        <p>Will be deleted</p>
        <div class="price">$5.99</div>
        <div class="actions">
          <button class="btn-edit" data-product-id="delete-test-1">Edit</button>
          <button class="btn-delete" data-product-id="delete-test-1">Delete</button>
        </div>
      `
      DOM.productList.appendChild(productCard)
    })

    test('should open delete confirmation modal', () => {
      const deleteBtn = DOM.productList.querySelector('.btn-delete')
      
      const clickEvent = new Event('click', { bubbles: true })
      deleteBtn.dispatchEvent(clickEvent)
      
      expect(DOM.deleteModal.style.display).not.toBe('none')
      expect(DOM.deleteProductName.textContent).toBe('Deletable Product')
    })

    test('should cancel deletion', () => {
      const deleteBtn = DOM.productList.querySelector('.btn-delete')
      deleteBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      const cancelEvent = new Event('click', { bubbles: true })
      DOM.cancelDeleteBtn.dispatchEvent(cancelEvent)
      
      expect(DOM.deleteModal.style.display).toBe('none')
      
      // Product should still exist
      const productCard = DOM.productList.querySelector('[data-product-id="delete-test-1"]')
      expect(productCard).toBeTruthy()
    })

    test('should confirm and delete product', async () => {
      const deleteBtn = DOM.productList.querySelector('.btn-delete')
      deleteBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      const confirmEvent = new Event('click', { bubbles: true })
      DOM.confirmDeleteBtn.dispatchEvent(confirmEvent)
      
      // Should show loading state
      expect(DOM.confirmDeleteBtn.disabled).toBe(true)
      expect(DOM.deleteSpinner.style.display).not.toBe('none')
      expect(DOM.deleteBtnText.style.display).toBe('none')
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Should close modal and show success
      expect(DOM.deleteModal.style.display).toBe('none')
      expect(DOM.successMessage.style.display).not.toBe('none')
      expect(DOM.successText.textContent).toMatch(/deleted|removed/i)
      
      // Product should be removed from DOM
      const productCard = DOM.productList.querySelector('[data-product-id="delete-test-1"]')
      expect(productCard).toBeNull()
    })

    test('should integrate with ProductService deleteProduct', async () => {
      expect(ProductService).toBeTruthy()
      expect(typeof ProductService.deleteProduct).toBe('function')
      
      const deleteBtn = DOM.productList.querySelector('.btn-delete')
      deleteBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      const confirmEvent = new Event('click', { bubbles: true })
      DOM.confirmDeleteBtn.dispatchEvent(confirmEvent)
      
      // ProductService.deleteProduct should be called
      expect(ProductService.deleteProduct).toHaveBeenCalledWith('delete-test-1')
    })

    test('should handle deletion errors', async () => {
      const deleteBtn = DOM.productList.querySelector('.btn-delete')
      deleteBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      // Simulate deletion error
      const errorEvent = new CustomEvent('productDeleteError', {
        detail: { error: 'Failed to delete product' }
      })
      document.dispatchEvent(errorEvent)
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(DOM.errorMessage.style.display).not.toBe('none')
      expect(DOM.errorText.textContent).toMatch(/failed|error/i)
      expect(DOM.confirmDeleteBtn.disabled).toBe(false)
    })

    test('should close delete modal on close button', () => {
      const deleteBtn = DOM.productList.querySelector('.btn-delete')
      deleteBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      const clickEvent = new Event('click', { bubbles: true })
      DOM.closeDeleteModalBtn.dispatchEvent(clickEvent)
      
      expect(DOM.deleteModal.style.display).toBe('none')
    })
  })

  describe('User Experience and Interactions', () => {
    test('should handle keyboard navigation in modals', () => {
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      // Tab should move between form fields
      DOM.productName.focus()
      expect(document.activeElement).toBe(DOM.productName)
      
      // Escape should close modal
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escapeEvent)
      
      expect(DOM.productModal.style.display).toBe('none')
    })

    test('should handle modal backdrop clicks', () => {
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      // Click on modal backdrop should close modal  
      const clickEvent = new Event('click', { bubbles: true })
      DOM.productModal.dispatchEvent(clickEvent)
      
      expect(DOM.productModal.style.display).toBe('none')
    })

    test('should show success messages temporarily', async () => {
      // Simulate success message
      DOM.successMessage.style.display = 'block'
      DOM.successText.textContent = 'Product created successfully'
      
      // Should auto-hide after timeout
      setTimeout(() => {
        expect(DOM.successMessage.style.display).toBe('none')
      }, 3000)
    })

    test('should handle responsive layout', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true })
      window.dispatchEvent(new Event('resize'))
      
      // Product grid should adapt to mobile layout
      const productGrid = window.getComputedStyle(DOM.productList)
      expect(productGrid.display).toBeTruthy()
    })

    test('should show loading states during operations', async () => {
      // Test various loading states
      DOM.loading.style.display = 'block'
      expect(DOM.loading.style.display).not.toBe('none')
      
      // Form submission loading
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      DOM.productName.value = 'Loading Test'
      DOM.productPrice.value = '10.00'
      
      const submitEvent = new Event('submit', { bubbles: true })
      DOM.productForm.dispatchEvent(submitEvent)
      
      expect(DOM.saveSpinner.style.display).not.toBe('none')
      expect(DOM.saveBtn.disabled).toBe(true)
    })
  })

  describe('Error Handling and Edge Cases', () => {
    test('should handle authentication errors', async () => {
      // Simulate authentication failure
      const authErrorEvent = new CustomEvent('authError', {
        detail: { error: 'Session expired' }
      })
      document.dispatchEvent(authErrorEvent)
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Should redirect to login or show error
      expect(DOM.errorMessage.style.display).not.toBe('none')
      expect(DOM.errorText.textContent).toMatch(/session|expired|unauthorized/i)
    })

    test('should handle network failures', async () => {
      // Simulate offline
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true })
      
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      DOM.productName.value = 'Offline Product'
      DOM.productPrice.value = '10.00'
      
      const submitEvent = new Event('submit', { bubbles: true })
      DOM.productForm.dispatchEvent(submitEvent)
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(DOM.errorMessage.style.display).not.toBe('none')
      expect(DOM.errorText.textContent).toMatch(/network|offline|connection/i)
    })

    test('should handle storage quota exceeded', async () => {
      // Simulate storage quota error
      const storageErrorEvent = new CustomEvent('storageError', {
        detail: { error: 'QuotaExceededError' }
      })
      document.dispatchEvent(storageErrorEvent)
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(DOM.errorMessage.style.display).not.toBe('none')
      expect(DOM.errorText.textContent).toMatch(/storage|quota|space/i)
    })

    test('should handle concurrent operations', async () => {
      // Start multiple operations simultaneously
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      DOM.productName.value = 'Concurrent 1'
      DOM.productPrice.value = '10.00'
      
      const submitEvent1 = new Event('submit', { bubbles: true })
      const submitEvent2 = new Event('submit', { bubbles: true })
      
      DOM.productForm.dispatchEvent(submitEvent1)
      DOM.productForm.dispatchEvent(submitEvent2)
      
      // Should prevent duplicate submissions
      expect(DOM.saveBtn.disabled).toBe(true)
    })

    test('should handle invalid product IDs', async () => {
      // Try to edit non-existent product
      const invalidEditBtn = document.createElement('button')
      invalidEditBtn.className = 'btn-edit'
      invalidEditBtn.dataset.productId = 'nonexistent-id'
      DOM.productList.appendChild(invalidEditBtn)
      
      const clickEvent = new Event('click', { bubbles: true })
      invalidEditBtn.dispatchEvent(clickEvent)
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(DOM.errorMessage.style.display).not.toBe('none')
      expect(DOM.errorText.textContent).toMatch(/not found|invalid/i)
    })

    test('should recover from unexpected errors', async () => {
      // Simulate unexpected JavaScript error
      const originalError = window.onerror
      let errorCaught = false
      
      window.onerror = (message, source, lineno, colno, error) => {
        errorCaught = true
        return true
      }
      
      // Trigger operation that might cause error
      DOM.addProductBtn.dispatchEvent(new Event('click', { bubbles: true }))
      
      // Should handle error gracefully
      expect(DOM.productModal.style.display).not.toBe('none')
      
      window.onerror = originalError
    })
  })
})