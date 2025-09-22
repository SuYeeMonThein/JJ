# Quickstart: User Authentication & Product Management

## Prerequisites
- Modern web browser (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)
- Local web server (for testing, e.g., `python -m http.server` or VS Code Live Server)
- JavaScript enabled

## Getting Started

### 1. Setup Development Environment
```bash
# Clone/navigate to project directory
cd webapp-auth-products

# Start local server (choose one)
python -m http.server 8000
# OR
npx serve src
# OR use VS Code Live Server extension
```

### 2. Open Application
Navigate to `http://localhost:8000` in your browser

## User Flow Testing Scenarios

### Scenario 1: New User Registration
**Goal**: Verify user can create account and access product management

1. **Open application** → Should see login/signup options
2. **Click "Sign Up"** → Navigate to registration form
3. **Enter valid credentials**:
   - Email: `test@example.com`
   - Password: `SecurePass123`
   - Confirm password: `SecurePass123`
4. **Submit form** → Should create account and auto-login
5. **Verify dashboard access** → Should see empty product list with "Add Product" button

**Expected Results**:
- ✅ User account created in localStorage
- ✅ Automatic login after signup
- ✅ Redirect to product dashboard
- ✅ Session token stored with expiration

### Scenario 2: User Login/Logout
**Goal**: Verify existing user authentication

1. **Logout current session** → Should return to login page
2. **Enter login credentials**:
   - Email: `test@example.com`
   - Password: `SecurePass123`
3. **Submit login form** → Should authenticate and access dashboard
4. **Click logout** → Should clear session and return to login

**Expected Results**:
- ✅ Successful authentication with correct credentials
- ✅ Dashboard access after login
- ✅ Complete session cleanup on logout
- ✅ Protected pages inaccessible after logout

### Scenario 3: Product CRUD Operations
**Goal**: Verify complete product management workflow

**Create Product**:
1. **From dashboard** → Click "Add Product" 
2. **Fill product form**:
   - Name: `Test Product`
   - Description: `This is a test product`
   - Price: `29.99`
3. **Submit form** → Should create product and return to list

**Read Products**:
4. **View product list** → Should display created product with all details

**Update Product**:
5. **Click "Edit" on test product** → Should open edit form with current data
6. **Modify fields**:
   - Name: `Updated Test Product`
   - Price: `34.99`
7. **Submit changes** → Should update product and refresh list

**Delete Product**:
8. **Click "Delete" on product** → Should show confirmation dialog
9. **Confirm deletion** → Should remove product from list

**Expected Results**:
- ✅ Product creation with validation
- ✅ Product list displays all user products
- ✅ Edit form pre-populated with current data
- ✅ Updates persist and display correctly
- ✅ Deletion removes product permanently
- ✅ All operations restricted to current user's products

### Scenario 4: Form Validation Testing
**Goal**: Verify input validation and error handling

**Registration Validation**:
1. **Try signup with invalid email** → Should show email format error
2. **Try weak password** → Should show password requirements
3. **Try mismatched passwords** → Should show confirmation error
4. **Try duplicate email** → Should show email already exists error

**Product Validation**:
5. **Try empty product name** → Should show required field error
6. **Try negative price** → Should show positive number requirement
7. **Try price with >2 decimals** → Should format to 2 decimal places
8. **Try description >500 chars** → Should show length limit error

**Expected Results**:
- ✅ Clear, helpful validation messages
- ✅ Form prevents submission with invalid data
- ✅ Real-time validation feedback
- ✅ Accessible error announcements

### Scenario 5: Security & Session Testing
**Goal**: Verify security measures and session management

1. **Try accessing product pages without login** → Should redirect to login
2. **Close browser tab and reopen** → Should maintain session if not expired
3. **Wait for session expiration** → Should auto-logout and redirect
4. **Try XSS in product fields** → Should sanitize input
5. **Check password storage** → Should only store hashed versions

**Expected Results**:
- ✅ Authentication required for protected pages
- ✅ Sessions persist across browser sessions
- ✅ Automatic cleanup of expired sessions
- ✅ Input sanitization prevents XSS
- ✅ Passwords never stored in plain text

## Performance Validation

### Page Load Performance
- **Initial page load**: <2 seconds
- **Navigation between pages**: <200ms
- **Product list rendering**: <500ms for 100 products
- **Search/filter operations**: <100ms

### Storage Performance
- **User registration**: <100ms
- **Login authentication**: <50ms
- **Product CRUD operations**: <100ms each
- **Data persistence**: Immediate (synchronous)

## Browser Compatibility Testing

Test the complete user flow in:
- ✅ Chrome 88+ (Windows/Mac/Linux)
- ✅ Firefox 85+ (Windows/Mac/Linux)  
- ✅ Safari 14+ (Mac)
- ✅ Edge 88+ (Windows)

## Troubleshooting

### Common Issues
1. **"IndexedDB not supported"** → Update browser or use localStorage fallback
2. **Session lost on refresh** → Check localStorage permissions
3. **Products not saving** → Verify IndexedDB permissions
4. **Login fails with correct password** → Clear browser data and retry
5. **Slow performance** → Check for large amounts of stored data

### Reset Instructions
To completely reset the application:
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Clear localStorage and IndexedDB for the domain
4. Refresh the page

This will remove all user accounts and products.