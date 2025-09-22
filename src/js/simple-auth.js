/**
 * Simple AuthService - Basic in-memory authentication
 * Perfect for development and simple applications
 */
class SimpleAuthService {
  constructor() {
    this.users = new Map(); // In-memory user storage
    this.currentUser = null;
    this.isInitialized = false;
  }

  init() {
    if (!this.isInitialized) {
      // Load users from localStorage if available
      const savedUsers = localStorage.getItem('simpleAuth_users');
      if (savedUsers) {
        const usersArray = JSON.parse(savedUsers);
        this.users = new Map(usersArray);
      }
      
      // Check for existing session
      const savedSession = sessionStorage.getItem('simpleAuth_session');
      if (savedSession) {
        this.currentUser = JSON.parse(savedSession);
      }
      
      this.isInitialized = true;
    }
  }

  // Simple email validation
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Simple password validation
  isValidPassword(password) {
    return password && password.length >= 6;
  }

  // Register new user
  async signup(email, password, username = null) {
    this.init();
    
    if (!this.isValidEmail(email)) {
      return { success: false, error: 'Invalid email address' };
    }
    
    if (!this.isValidPassword(password)) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    
    if (this.users.has(email)) {
      return { success: false, error: 'User already exists' };
    }
    
    // Create user (simple hash for demo - don't use in production!)
    const user = {
      id: 'user_' + Date.now(),
      email: email,
      username: username || email.split('@')[0],
      password: btoa(password), // Simple base64 encoding (NOT secure for production)
      createdAt: new Date().toISOString()
    };
    
    this.users.set(email, user);
    this.saveUsers();
    
    // Auto-login after signup
    this.currentUser = { ...user };
    delete this.currentUser.password; // Don't keep password in session
    this.saveSession();
    
    return { 
      success: true, 
      user: this.currentUser,
      message: 'Account created successfully!'
    };
  }

  // Login user
  async login(email, password, rememberMe = false) {
    this.init();
    
    if (!this.isValidEmail(email)) {
      return { success: false, error: 'Invalid email address' };
    }
    
    const user = this.users.get(email);
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // Check password (simple comparison for demo)
    if (atob(user.password) !== password) {
      return { success: false, error: 'Invalid password' };
    }
    
    // Login successful
    this.currentUser = { ...user };
    delete this.currentUser.password; // Don't keep password in session
    this.saveSession(rememberMe);
    
    return { 
      success: true, 
      user: this.currentUser,
      message: 'Login successful!'
    };
  }

  // Logout user
  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('simpleAuth_session');
    localStorage.removeItem('simpleAuth_session');
    return { success: true, message: 'Logged out successfully!' };
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

  // Save users to localStorage
  saveUsers() {
    const usersArray = Array.from(this.users.entries());
    localStorage.setItem('simpleAuth_users', JSON.stringify(usersArray));
  }

  // Save session
  saveSession(persistent = false) {
    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem('simpleAuth_session', JSON.stringify(this.currentUser));
  }

  // Get all users (for debugging)
  getAllUsers() {
    this.init();
    return Array.from(this.users.values()).map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt
    }));
  }
}

// Create singleton instance
const simpleAuthService = new SimpleAuthService();

// Export for CommonJS (Jest/Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = simpleAuthService;
}

// Export for ES6 modules
if (typeof exports !== 'undefined') {
  exports.default = simpleAuthService;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.SimpleAuthService = simpleAuthService;
}