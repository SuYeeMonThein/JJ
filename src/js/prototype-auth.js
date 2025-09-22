/**
 * Prototype AuthService - Fake authentication for UI prototyping
 * Always succeeds, no real validation, perfect for demos and prototypes
 */
class PrototypeAuthService {
  constructor() {
    this.currentUser = null;
    this.isInitialized = false;
  }

  init() {
    if (!this.isInitialized) {
      // Check if we have a "fake" logged in user in sessionStorage
      const fakeUser = sessionStorage.getItem('prototypeAuth_user');
      if (fakeUser) {
        this.currentUser = JSON.parse(fakeUser);
      }
      this.isInitialized = true;
    }
  }

  // Basic form validation
  validateSignup(email, password, confirmPassword) {
    const errors = [];

    // Email validation
    if (!email || email.trim() === '') {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation
    if (!password || password.trim() === '') {
      errors.push('Password is required');
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    // Confirm password validation
    if (confirmPassword !== undefined) {
      if (!confirmPassword || confirmPassword.trim() === '') {
        errors.push('Please confirm your password');
      } else if (password !== confirmPassword) {
        errors.push('Passwords do not match');
      }
    }

    return errors;
  }

  validateLogin(email, password) {
    const errors = [];

    if (!email || email.trim() === '') {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!password || password.trim() === '') {
      errors.push('Password is required');
    }

    return errors;
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Fake signup - with basic validation
  async signup(email, password, confirmPassword = null, username = null) {
    // Validate inputs
    const validationErrors = this.validateSignup(email, password, confirmPassword);
    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors
      };
    }

    // Simulate API delay
    await this.delay(500);

    // Create fake user
    const user = {
      id: 'user_' + Date.now(),
      email: email,
      username: username || email.split('@')[0],
      createdAt: new Date().toISOString()
    };

    this.currentUser = user;
    sessionStorage.setItem('prototypeAuth_user', JSON.stringify(user));

    return {
      success: true,
      user: user,
      message: 'Account created successfully!'
    };
  }

  // Fake login - with basic validation
  async login(email, password, rememberMe = false) {
    // Validate inputs
    const validationErrors = this.validateLogin(email, password);
    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors
      };
    }

    // Simulate API delay
    await this.delay(500);

    // Create fake user for login
    const user = {
      id: 'user_demo_123',
      email: email,
      username: email.split('@')[0],
      lastLogin: new Date().toISOString()
    };

    this.currentUser = user;
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('prototypeAuth_user', JSON.stringify(user));

    return {
      success: true,
      user: user,
      message: 'Login successful!'
    };
  }

  // Fake logout
  async logout() {
    await this.delay(200);
    
    this.currentUser = null;
    sessionStorage.removeItem('prototypeAuth_user');
    localStorage.removeItem('prototypeAuth_user');

    return {
      success: true,
      message: 'Logged out successfully!'
    };
  }

  // Check if user is authenticated
  isAuthenticated() {
    this.init();
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    this.init();
    return this.currentUser;
  }

  // Utility function to simulate async delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Auto-login as demo user (for quick prototyping)
  autoLoginDemo() {
    const demoUser = {
      id: 'demo_user',
      email: 'demo@prototype.com',
      username: 'Demo User',
      createdAt: new Date().toISOString()
    };

    this.currentUser = demoUser;
    sessionStorage.setItem('prototypeAuth_user', JSON.stringify(demoUser));
    return demoUser;
  }

  // Clear all fake data
  clearAllData() {
    this.currentUser = null;
    sessionStorage.removeItem('prototypeAuth_user');
    localStorage.removeItem('prototypeAuth_user');
  }
}

// Create singleton instance
const prototypeAuthService = new PrototypeAuthService();

// Export for CommonJS (Jest/Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = prototypeAuthService;
}

// Export for ES6 modules
if (typeof exports !== 'undefined') {
  exports.default = prototypeAuthService;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.PrototypeAuthService = prototypeAuthService;
}