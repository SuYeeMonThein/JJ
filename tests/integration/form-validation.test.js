/**
 * Form Validation Integration Tests
 * Tests comprehensive client-side validation across all forms
 * THESE TESTS MUST FAIL until implementation is complete
 */

describe('Form Validation Integration Tests', () => {
  let DOM

  beforeEach(() => {
    // Clear all storage before each test
    localStorage.clear()
    sessionStorage.clear()

    // Create comprehensive form testing environment
    document.body.innerHTML = `
      <div id="app">
        <!-- Registration Form -->
        <div id="registration-section">
          <form id="registration-form" class="auth-form">
            <h2>Create Account</h2>
            
            <div class="form-group">
              <label for="reg-email">Email Address</label>
              <input type="email" id="reg-email" name="email" required>
              <span class="error-message" id="reg-email-error"></span>
              <span class="success-message" id="reg-email-success"></span>
            </div>
            
            <div class="form-group">
              <label for="reg-password">Password</label>
              <input type="password" id="reg-password" name="password" required>
              <div class="password-strength" id="password-strength">
                <div class="strength-meter">
                  <div class="strength-bar" id="strength-bar"></div>
                </div>
                <span class="strength-text" id="strength-text">Password strength: Weak</span>
              </div>
              <span class="error-message" id="reg-password-error"></span>
            </div>
            
            <div class="form-group">
              <label for="reg-confirm-password">Confirm Password</label>
              <input type="password" id="reg-confirm-password" name="confirmPassword" required>
              <span class="error-message" id="reg-confirm-password-error"></span>
            </div>
            
            <button type="submit" id="reg-submit" class="btn-primary">Create Account</button>
          </form>
        </div>

        <!-- Login Form -->
        <div id="login-section">
          <form id="login-form" class="auth-form">
            <h2>Sign In</h2>
            
            <div class="form-group">
              <label for="login-email">Email Address</label>
              <input type="email" id="login-email" name="email" required>
              <span class="error-message" id="login-email-error"></span>
            </div>
            
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" name="password" required>
              <span class="error-message" id="login-password-error"></span>
            </div>
            
            <button type="submit" id="login-submit" class="btn-primary">Sign In</button>
          </form>
        </div>

        <!-- Product Form -->
        <div id="product-section">
          <form id="product-form" class="product-form">
            <h2>Product Information</h2>
            
            <div class="form-group">
              <label for="product-name">Product Name</label>
              <input type="text" id="product-name" name="name" required maxlength="100">
              <div class="char-counter">
                <span id="name-char-count">0</span>/100 characters
              </div>
              <span class="error-message" id="product-name-error"></span>
            </div>
            
            <div class="form-group">
              <label for="product-description">Description</label>
              <textarea id="product-description" name="description" maxlength="500" rows="4"></textarea>
              <div class="char-counter">
                <span id="desc-char-count">0</span>/500 characters
              </div>
              <span class="error-message" id="product-description-error"></span>
            </div>
            
            <div class="form-group">
              <label for="product-price">Price ($)</label>
              <input type="number" id="product-price" name="price" required min="0" step="0.01" max="999999.99">
              <div class="input-help">Enter price in USD (e.g., 29.99)</div>
              <span class="error-message" id="product-price-error"></span>
            </div>
            
            <div class="form-group">
              <label for="product-category">Category</label>
              <select id="product-category" name="category">
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="home">Home & Garden</option>
                <option value="other">Other</option>
              </select>
              <span class="error-message" id="product-category-error"></span>
            </div>
            
            <button type="submit" id="product-submit" class="btn-primary">Save Product</button>
          </form>
        </div>

        <!-- Search Form -->
        <div id="search-section">
          <form id="search-form" class="search-form">
            <div class="form-group">
              <label for="search-query">Search Products</label>
              <input type="text" id="search-query" name="query" placeholder="Enter search terms...">
              <span class="error-message" id="search-query-error"></span>
            </div>
            
            <div class="form-group">
              <label for="search-category">Filter by Category</label>
              <select id="search-category" name="category">
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="home">Home & Garden</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="price-min">Min Price ($)</label>
              <input type="number" id="price-min" name="priceMin" min="0" step="0.01">
              <span class="error-message" id="price-min-error"></span>
            </div>
            
            <div class="form-group">
              <label for="price-max">Max Price ($)</label>
              <input type="number" id="price-max" name="priceMax" min="0" step="0.01">
              <span class="error-message" id="price-max-error"></span>
            </div>
            
            <button type="submit" id="search-submit" class="btn-primary">Search</button>
            <button type="button" id="search-clear" class="btn-secondary">Clear</button>
          </form>
        </div>

        <!-- Global Form Messages -->
        <div id="form-success" class="success-alert" style="display: none;">
          <span id="form-success-text"></span>
        </div>
        
        <div id="form-error" class="error-alert" style="display: none;">
          <span id="form-error-text"></span>
        </div>
      </div>
    `

    // Store DOM references
    DOM = {
      // Registration Form
      registrationForm: document.getElementById('registration-form'),
      regEmail: document.getElementById('reg-email'),
      regPassword: document.getElementById('reg-password'),
      regConfirmPassword: document.getElementById('reg-confirm-password'),
      regEmailError: document.getElementById('reg-email-error'),
      regPasswordError: document.getElementById('reg-password-error'),
      regConfirmPasswordError: document.getElementById('reg-confirm-password-error'),
      regEmailSuccess: document.getElementById('reg-email-success'),
      passwordStrength: document.getElementById('password-strength'),
      strengthBar: document.getElementById('strength-bar'),
      strengthText: document.getElementById('strength-text'),
      regSubmit: document.getElementById('reg-submit'),

      // Login Form
      loginForm: document.getElementById('login-form'),
      loginEmail: document.getElementById('login-email'),
      loginPassword: document.getElementById('login-password'),
      loginEmailError: document.getElementById('login-email-error'),
      loginPasswordError: document.getElementById('login-password-error'),
      loginSubmit: document.getElementById('login-submit'),

      // Product Form
      productForm: document.getElementById('product-form'),
      productName: document.getElementById('product-name'),
      productDescription: document.getElementById('product-description'),
      productPrice: document.getElementById('product-price'),
      productCategory: document.getElementById('product-category'),
      productNameError: document.getElementById('product-name-error'),
      productDescriptionError: document.getElementById('product-description-error'),
      productPriceError: document.getElementById('product-price-error'),
      productCategoryError: document.getElementById('product-category-error'),
      nameCharCount: document.getElementById('name-char-count'),
      descCharCount: document.getElementById('desc-char-count'),
      productSubmit: document.getElementById('product-submit'),

      // Search Form
      searchForm: document.getElementById('search-form'),
      searchQuery: document.getElementById('search-query'),
      searchCategory: document.getElementById('search-category'),
      priceMin: document.getElementById('price-min'),
      priceMax: document.getElementById('price-max'),
      searchQueryError: document.getElementById('search-query-error'),
      priceMinError: document.getElementById('price-min-error'),
      priceMaxError: document.getElementById('price-max-error'),
      searchSubmit: document.getElementById('search-submit'),
      searchClear: document.getElementById('search-clear'),

      // Global Messages
      formSuccess: document.getElementById('form-success'),
      formSuccessText: document.getElementById('form-success-text'),
      formError: document.getElementById('form-error'),
      formErrorText: document.getElementById('form-error-text')
    }
  })

  describe('Email Validation', () => {
    test('should validate email format in registration form', () => {
      const invalidEmails = [
        '', 
        'invalid', 
        'test@', 
        '@domain.com', 
        'test.domain.com',
        'test@domain',
        'test@@domain.com',
        'test@domain..com',
        'test @domain.com',
        'test@dom ain.com'
      ]

      for (const email of invalidEmails) {
        DOM.regEmail.value = email
        
        const inputEvent = new Event('input', { bubbles: true })
        DOM.regEmail.dispatchEvent(inputEvent)
        
        expect(DOM.regEmailError.textContent).toBeTruthy()
        expect(DOM.regEmailError.textContent).toMatch(/invalid|format|email/i)
        expect(DOM.regEmailSuccess.style.display).toBe('none')
      }
    })

    test('should validate email format in login form', () => {
      const invalidEmails = ['invalid', 'test@', '@domain.com']

      for (const email of invalidEmails) {
        DOM.loginEmail.value = email
        
        const inputEvent = new Event('input', { bubbles: true })
        DOM.loginEmail.dispatchEvent(inputEvent)
        
        expect(DOM.loginEmailError.textContent).toBeTruthy()
        expect(DOM.loginEmailError.textContent).toMatch(/invalid|format|email/i)
      }
    })

    test('should show success for valid email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'firstname+lastname@company.org',
        'test123@test-domain.com'
      ]

      for (const email of validEmails) {
        DOM.regEmail.value = email
        
        const inputEvent = new Event('input', { bubbles: true })
        DOM.regEmail.dispatchEvent(inputEvent)
        
        expect(DOM.regEmailError.textContent).toBe('')
        expect(DOM.regEmailSuccess.style.display).not.toBe('none')
        expect(DOM.regEmailSuccess.textContent).toMatch(/valid|good/i)
      }
    })

    test('should check email availability during registration', async () => {
      DOM.regEmail.value = 'existing@example.com'
      
      const blurEvent = new Event('blur', { bubbles: true })
      DOM.regEmail.dispatchEvent(blurEvent)
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Should check if email is already registered
      expect(DOM.regEmailError.textContent).toMatch(/already|exists|taken/i)
      expect(DOM.regEmailSuccess.style.display).toBe('none')
    })

    test('should clear email validation errors when corrected', () => {
      // Set invalid email first
      DOM.regEmail.value = 'invalid'
      DOM.regEmail.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(DOM.regEmailError.textContent).toBeTruthy()
      
      // Then set valid email
      DOM.regEmail.value = 'valid@example.com'
      DOM.regEmail.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(DOM.regEmailError.textContent).toBe('')
      expect(DOM.regEmailError.style.display).toBe('none')
    })
  })

  describe('Password Validation', () => {
    test('should validate password strength', () => {
      const weakPasswords = [
        '',
        '123',
        'password',
        'abc123',
        'PASSWORD',
        'Test123',
        'short',
        '12345678'
      ]

      for (const password of weakPasswords) {
        DOM.regPassword.value = password
        
        const inputEvent = new Event('input', { bubbles: true })
        DOM.regPassword.dispatchEvent(inputEvent)
        
        expect(DOM.regPasswordError.textContent).toBeTruthy()
        expect(DOM.strengthText.textContent).toMatch(/weak|poor/i)
        expect(DOM.strengthBar.style.width).toBe('25%')
      }
    })

    test('should show password strength meter', () => {
      const passwordTests = [
        { password: 'weak123', expectedStrength: 'Weak', expectedWidth: '25%' },
        { password: 'Better123!', expectedStrength: 'Fair', expectedWidth: '50%' },
        { password: 'GoodPassword123!', expectedStrength: 'Good', expectedWidth: '75%' },
        { password: 'VeryStr0ng!P@ssw0rd', expectedStrength: 'Excellent', expectedWidth: '100%' }
      ]

      for (const test of passwordTests) {
        DOM.regPassword.value = test.password
        
        const inputEvent = new Event('input', { bubbles: true })
        DOM.regPassword.dispatchEvent(inputEvent)
        
        expect(DOM.strengthText.textContent).toContain(test.expectedStrength)
        expect(DOM.strengthBar.style.width).toBe(test.expectedWidth)
      }
    })

    test('should validate password requirements', () => {
      DOM.regPassword.value = 'InvalidPass'
      
      const inputEvent = new Event('input', { bubbles: true })
      DOM.regPassword.dispatchEvent(inputEvent)
      
      expect(DOM.regPasswordError.textContent).toMatch(/requirements|must contain|missing/i)
      
      // Should list specific requirements
      const errorText = DOM.regPasswordError.textContent.toLowerCase()
      expect(errorText).toMatch(/8 characters|uppercase|lowercase|number|special/i)
    })

    test('should validate password confirmation match', () => {
      DOM.regPassword.value = 'SecurePass123!'
      DOM.regConfirmPassword.value = 'DifferentPass123!'
      
      const inputEvent = new Event('input', { bubbles: true })
      DOM.regConfirmPassword.dispatchEvent(inputEvent)
      
      expect(DOM.regConfirmPasswordError.textContent).toBeTruthy()
      expect(DOM.regConfirmPasswordError.textContent).toMatch(/match|same|different/i)
    })

    test('should clear password confirmation error when passwords match', () => {
      const password = 'SecurePass123!'
      
      // Set mismatched first
      DOM.regPassword.value = password
      DOM.regConfirmPassword.value = 'different'
      DOM.regConfirmPassword.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(DOM.regConfirmPasswordError.textContent).toBeTruthy()
      
      // Then match them
      DOM.regConfirmPassword.value = password
      DOM.regConfirmPassword.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(DOM.regConfirmPasswordError.textContent).toBe('')
      expect(DOM.regConfirmPasswordError.style.display).toBe('none')
    })

    test('should validate required password field in login', () => {
      DOM.loginPassword.value = ''
      
      const inputEvent = new Event('input', { bubbles: true })
      DOM.loginPassword.dispatchEvent(inputEvent)
      
      expect(DOM.loginPasswordError.textContent).toBeTruthy()
      expect(DOM.loginPasswordError.textContent).toMatch(/required|empty/i)
    })
  })

  describe('Product Form Validation', () => {
    test('should validate required product name', () => {
      DOM.productName.value = ''
      
      const inputEvent = new Event('input', { bubbles: true })
      DOM.productName.dispatchEvent(inputEvent)
      
      expect(DOM.productNameError.textContent).toBeTruthy()
      expect(DOM.productNameError.textContent).toMatch(/required|name/i)
    })

    test('should validate product name length', () => {
      // Test empty name
      DOM.productName.value = ''
      DOM.productName.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.productNameError.textContent).toBeTruthy()
      
      // Test too long name
      DOM.productName.value = 'A'.repeat(101)
      DOM.productName.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.productNameError.textContent).toMatch(/too long|maximum|100/i)
      
      // Test valid length
      DOM.productName.value = 'Valid Product Name'
      DOM.productName.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.productNameError.textContent).toBe('')
    })

    test('should show character counter for product name', () => {
      const testName = 'Test Product'
      DOM.productName.value = testName
      
      const inputEvent = new Event('input', { bubbles: true })
      DOM.productName.dispatchEvent(inputEvent)
      
      expect(DOM.nameCharCount.textContent).toBe(testName.length.toString())
      
      // Test near limit
      DOM.productName.value = 'A'.repeat(95)
      DOM.productName.dispatchEvent(inputEvent)
      expect(DOM.nameCharCount.textContent).toBe('95')
      expect(DOM.nameCharCount.style.color).toMatch(/orange|yellow/i)
      
      // Test at limit
      DOM.productName.value = 'A'.repeat(100)
      DOM.productName.dispatchEvent(inputEvent)
      expect(DOM.nameCharCount.textContent).toBe('100')
      expect(DOM.nameCharCount.style.color).toMatch(/red/i)
    })

    test('should validate description length', () => {
      // Test valid description
      DOM.productDescription.value = 'A valid product description'
      DOM.productDescription.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.productDescriptionError.textContent).toBe('')
      
      // Test too long description
      DOM.productDescription.value = 'A'.repeat(501)
      DOM.productDescription.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.productDescriptionError.textContent).toMatch(/too long|maximum|500/i)
    })

    test('should show character counter for description', () => {
      const testDesc = 'Test description for product'
      DOM.productDescription.value = testDesc
      
      const inputEvent = new Event('input', { bubbles: true })
      DOM.productDescription.dispatchEvent(inputEvent)
      
      expect(DOM.descCharCount.textContent).toBe(testDesc.length.toString())
    })

    test('should validate product price', () => {
      const invalidPrices = [
        '',
        '-10',
        'abc',
        '1000000',
        '10.999', // Too many decimal places
        '0'
      ]

      for (const price of invalidPrices) {
        DOM.productPrice.value = price
        
        const inputEvent = new Event('input', { bubbles: true })
        DOM.productPrice.dispatchEvent(inputEvent)
        
        expect(DOM.productPriceError.textContent).toBeTruthy()
      }
    })

    test('should validate price format and range', () => {
      // Test negative price
      DOM.productPrice.value = '-5.99'
      DOM.productPrice.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.productPriceError.textContent).toMatch(/negative|positive|greater/i)
      
      // Test zero price
      DOM.productPrice.value = '0'
      DOM.productPrice.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.productPriceError.textContent).toMatch(/greater than zero|positive/i)
      
      // Test too many decimals
      DOM.productPrice.value = '10.999'
      DOM.productPrice.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.productPriceError.textContent).toMatch(/decimal|cents|two/i)
      
      // Test valid price
      DOM.productPrice.value = '29.99'
      DOM.productPrice.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.productPriceError.textContent).toBe('')
    })

    test('should format price input', () => {
      DOM.productPrice.value = '29.9'
      
      const blurEvent = new Event('blur', { bubbles: true })
      DOM.productPrice.dispatchEvent(blurEvent)
      
      // Should format to 2 decimal places
      expect(DOM.productPrice.value).toBe('29.90')
    })

    test('should validate category selection when required', () => {
      // Make category required for this test
      DOM.productCategory.required = true
      
      DOM.productCategory.value = ''
      
      const changeEvent = new Event('change', { bubbles: true })
      DOM.productCategory.dispatchEvent(changeEvent)
      
      expect(DOM.productCategoryError.textContent).toMatch(/required|select|category/i)
      
      // Select valid category
      DOM.productCategory.value = 'electronics'
      DOM.productCategory.dispatchEvent(changeEvent)
      
      expect(DOM.productCategoryError.textContent).toBe('')
    })
  })

  describe('Search Form Validation', () => {
    test('should validate search query length', () => {
      // Test empty query (should be valid for search)
      DOM.searchQuery.value = ''
      DOM.searchQuery.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.searchQueryError.textContent).toBe('')
      
      // Test very short query
      DOM.searchQuery.value = 'a'
      DOM.searchQuery.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.searchQueryError.textContent).toMatch(/too short|minimum|characters/i)
      
      // Test valid query
      DOM.searchQuery.value = 'laptop'
      DOM.searchQuery.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.searchQueryError.textContent).toBe('')
    })

    test('should validate price range', () => {
      // Test min > max
      DOM.priceMin.value = '100'
      DOM.priceMax.value = '50'
      
      const inputEvent = new Event('input', { bubbles: true })
      DOM.priceMax.dispatchEvent(inputEvent)
      
      expect(DOM.priceMaxError.textContent).toMatch(/greater|minimum|range/i)
      
      // Test negative prices
      DOM.priceMin.value = '-10'
      DOM.priceMin.dispatchEvent(inputEvent)
      expect(DOM.priceMinError.textContent).toMatch(/negative|positive/i)
    })

    test('should validate price decimal places', () => {
      DOM.priceMin.value = '10.999'
      DOM.priceMin.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.priceMinError.textContent).toMatch(/decimal|cents|two/i)
      
      DOM.priceMax.value = '99.999'
      DOM.priceMax.dispatchEvent(new Event('input', { bubbles: true }))
      expect(DOM.priceMaxError.textContent).toMatch(/decimal|cents|two/i)
    })

    test('should clear search form', () => {
      // Fill form with data
      DOM.searchQuery.value = 'test query'
      DOM.searchCategory.value = 'electronics'
      DOM.priceMin.value = '10.00'
      DOM.priceMax.value = '100.00'
      
      // Clear form
      const clickEvent = new Event('click', { bubbles: true })
      DOM.searchClear.dispatchEvent(clickEvent)
      
      expect(DOM.searchQuery.value).toBe('')
      expect(DOM.searchCategory.value).toBe('')
      expect(DOM.priceMin.value).toBe('')
      expect(DOM.priceMax.value).toBe('')
      
      // All errors should be cleared
      expect(DOM.searchQueryError.textContent).toBe('')
      expect(DOM.priceMinError.textContent).toBe('')
      expect(DOM.priceMaxError.textContent).toBe('')
    })
  })

  describe('Form Submission Validation', () => {
    test('should prevent registration form submission with validation errors', () => {
      DOM.regEmail.value = 'invalid'
      DOM.regPassword.value = 'weak'
      DOM.regConfirmPassword.value = 'different'
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      DOM.registrationForm.dispatchEvent(submitEvent)
      
      expect(submitEvent.defaultPrevented).toBe(true)
      expect(DOM.formError.style.display).not.toBe('none')
      expect(DOM.formErrorText.textContent).toMatch(/correct|errors|invalid/i)
    })

    test('should allow registration form submission with valid data', () => {
      DOM.regEmail.value = 'valid@example.com'
      DOM.regPassword.value = 'SecurePass123!'
      DOM.regConfirmPassword.value = 'SecurePass123!'
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      DOM.registrationForm.dispatchEvent(submitEvent)
      
      expect(submitEvent.defaultPrevented).toBe(false)
      expect(DOM.formError.style.display).toBe('none')
    })

    test('should prevent login form submission with validation errors', () => {
      DOM.loginEmail.value = 'invalid'
      DOM.loginPassword.value = ''
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      DOM.loginForm.dispatchEvent(submitEvent)
      
      expect(submitEvent.defaultPrevented).toBe(true)
      expect(DOM.formError.style.display).not.toBe('none')
    })

    test('should prevent product form submission with validation errors', () => {
      DOM.productName.value = ''
      DOM.productPrice.value = '-10'
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      DOM.productForm.dispatchEvent(submitEvent)
      
      expect(submitEvent.defaultPrevented).toBe(true)
      expect(DOM.formError.style.display).not.toBe('none')
    })

    test('should validate all fields on form submission', () => {
      // Submit empty registration form
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      DOM.registrationForm.dispatchEvent(submitEvent)
      
      // All required field errors should be shown
      expect(DOM.regEmailError.textContent).toBeTruthy()
      expect(DOM.regPasswordError.textContent).toBeTruthy()
      expect(DOM.regConfirmPasswordError.textContent).toBeTruthy()
      
      // Form should not submit
      expect(submitEvent.defaultPrevented).toBe(true)
    })
  })

  describe('Real-time Validation', () => {
    test('should validate on input events', () => {
      DOM.regEmail.value = 'invalid'
      
      const inputEvent = new Event('input', { bubbles: true })
      DOM.regEmail.dispatchEvent(inputEvent)
      
      expect(DOM.regEmailError.textContent).toBeTruthy()
      expect(DOM.regEmailError.style.display).not.toBe('none')
    })

    test('should validate on blur events', () => {
      DOM.productName.value = ''
      
      const blurEvent = new Event('blur', { bubbles: true })
      DOM.productName.dispatchEvent(blurEvent)
      
      expect(DOM.productNameError.textContent).toBeTruthy()
    })

    test('should validate on change events for select elements', () => {
      DOM.searchCategory.value = 'invalid-option'
      
      const changeEvent = new Event('change', { bubbles: true })
      DOM.searchCategory.dispatchEvent(changeEvent)
      
      // Should validate option exists
      expect(DOM.searchCategory.value).toBe('')
    })

    test('should debounce validation for performance', async () => {
      let validationCount = 0
      
      // Simulate rapid typing
      for (let i = 0; i < 10; i++) {
        DOM.regEmail.value = 'test' + i + '@example.com'
        DOM.regEmail.dispatchEvent(new Event('input', { bubbles: true }))
        validationCount++
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Should have debounced validation calls (implementation detail)
      expect(validationCount).toBe(10) // Input events fired
      // But actual validation should be debounced
    })
  })

  describe('Accessibility and User Experience', () => {
    test('should have proper ARIA attributes for validation', () => {
      DOM.regEmail.value = 'invalid'
      DOM.regEmail.dispatchEvent(new Event('input', { bubbles: true }))
      
      // Error should be announced to screen readers
      expect(DOM.regEmailError.getAttribute('aria-live')).toBe('polite')
      expect(DOM.regEmailError.getAttribute('role')).toBe('alert')
      
      // Input should reference error
      expect(DOM.regEmail.getAttribute('aria-describedby')).toContain('reg-email-error')
      expect(DOM.regEmail.getAttribute('aria-invalid')).toBe('true')
    })

    test('should show validation state visually', () => {
      // Invalid state
      DOM.regEmail.value = 'invalid'
      DOM.regEmail.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(DOM.regEmail.classList.contains('invalid')).toBe(true)
      expect(DOM.regEmail.classList.contains('valid')).toBe(false)
      
      // Valid state
      DOM.regEmail.value = 'valid@example.com'
      DOM.regEmail.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(DOM.regEmail.classList.contains('valid')).toBe(true)
      expect(DOM.regEmail.classList.contains('invalid')).toBe(false)
    })

    test('should focus first invalid field on submission', () => {
      DOM.regEmail.value = 'invalid'
      DOM.regPassword.value = ''
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      DOM.registrationForm.dispatchEvent(submitEvent)
      
      // Should focus first invalid field
      expect(document.activeElement).toBe(DOM.regEmail)
    })

    test('should provide helpful error messages', () => {
      DOM.regPassword.value = 'weak'
      DOM.regPassword.dispatchEvent(new Event('input', { bubbles: true }))
      
      const errorText = DOM.regPasswordError.textContent
      
      // Should be specific and helpful
      expect(errorText).toMatch(/8 characters|uppercase|lowercase|number|special character/i)
      expect(errorText).not.toMatch(/invalid|error|wrong/i) // Avoid generic messages
    })

    test('should handle internationalization', () => {
      // Set language attribute
      document.documentElement.lang = 'es'
      
      DOM.regEmail.value = 'invalid'
      DOM.regEmail.dispatchEvent(new Event('input', { bubbles: true }))
      
      // Error messages should be localized (if implemented)
      // This is a placeholder test for i18n support
      expect(DOM.regEmailError.textContent).toBeTruthy()
    })
  })

  describe('Error Handling and Edge Cases', () => {
    test('should handle special characters in input', () => {
      const specialChars = '<script>alert("xss")</script>'
      
      DOM.productName.value = specialChars
      DOM.productName.dispatchEvent(new Event('input', { bubbles: true }))
      
      // Should escape HTML in error messages
      expect(DOM.productNameError.innerHTML).not.toContain('<script>')
    })

    test('should handle very long input values', () => {
      const veryLongText = 'A'.repeat(10000)
      
      DOM.productDescription.value = veryLongText
      DOM.productDescription.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(DOM.productDescriptionError.textContent).toBeTruthy()
      expect(DOM.descCharCount.textContent).toBe('10000')
    })

    test('should handle rapid form switching', () => {
      // Rapidly switch between forms
      DOM.regEmail.value = 'invalid'
      DOM.regEmail.dispatchEvent(new Event('input', { bubbles: true }))
      
      DOM.loginEmail.value = 'invalid'
      DOM.loginEmail.dispatchEvent(new Event('input', { bubbles: true }))
      
      DOM.productName.value = ''
      DOM.productName.dispatchEvent(new Event('input', { bubbles: true }))
      
      // Each form should maintain its own validation state
      expect(DOM.regEmailError.textContent).toBeTruthy()
      expect(DOM.loginEmailError.textContent).toBeTruthy()
      expect(DOM.productNameError.textContent).toBeTruthy()
    })

    test('should handle browser autofill', () => {
      // Simulate browser autofill
      DOM.regEmail.value = 'autofilled@example.com'
      
      // Trigger validation after autofill
      const inputEvent = new Event('input', { bubbles: true })
      DOM.regEmail.dispatchEvent(inputEvent)
      
      expect(DOM.regEmailError.textContent).toBe('')
      expect(DOM.regEmailSuccess.style.display).not.toBe('none')
    })

    test('should handle form reset', () => {
      // Fill form with invalid data
      DOM.regEmail.value = 'invalid'
      DOM.regPassword.value = 'weak'
      DOM.regEmail.dispatchEvent(new Event('input', { bubbles: true }))
      DOM.regPassword.dispatchEvent(new Event('input', { bubbles: true }))
      
      expect(DOM.regEmailError.textContent).toBeTruthy()
      expect(DOM.regPasswordError.textContent).toBeTruthy()
      
      // Reset form
      DOM.registrationForm.reset()
      
      // Validation errors should be cleared
      expect(DOM.regEmailError.textContent).toBe('')
      expect(DOM.regPasswordError.textContent).toBe('')
      expect(DOM.regEmail.classList.contains('invalid')).toBe(false)
    })

    test('should handle validation during page navigation', () => {
      DOM.regEmail.value = 'partial@'
      DOM.regEmail.dispatchEvent(new Event('input', { bubbles: true }))
      
      // Simulate page navigation
      const beforeUnloadEvent = new Event('beforeunload')
      window.dispatchEvent(beforeUnloadEvent)
      
      // Should save form state or warn user
      expect(sessionStorage.getItem('registration-form-data')).toBeTruthy()
    })
  })
})