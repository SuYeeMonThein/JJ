/**
 * Main application controller for Product Manager
 * Handles navigation, authentication state, and app initialization
 */

class App {
  constructor() {
    this.currentUser = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Initialize services
      await this.initializeServices();
      
      // Check authentication state
      await this.checkAuthState();
      
      // Initialize UI
      this.initializeUI();
      
      this.initialized = true;
    } catch (error) {
      console.error('App initialization error:', error);
      showToast('Failed to initialize application', 'error');
    }
  }

  async initializeServices() {
    // Services are already initialized via their singletons
    // Just verify they're available
    if (typeof StorageService === 'undefined') {
      throw new Error('StorageService not available');
    }
    if (typeof AuthService === 'undefined') {
      throw new Error('AuthService not available');
    }
    if (typeof ProductService === 'undefined') {
      throw new Error('ProductService not available');
    }
  }

  async checkAuthState() {
    try {
      if (AuthService.isAuthenticated()) {
        this.currentUser = AuthService.getCurrentUser();
        this.updateUIForAuthenticatedUser();
      } else {
        this.updateUIForGuestUser();
      }
    } catch (error) {
      console.error('Auth state check error:', error);
      this.updateUIForGuestUser();
    }
  }

  initializeUI() {
    // Initialize global event listeners
    this.initializeNavigation();
    this.initializeLogout();
    
    // Initialize page-specific functionality
    const currentPage = this.getCurrentPage();
    this.initializePage(currentPage);
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('login.html')) return 'login';
    if (path.includes('signup.html')) return 'signup';
    if (path.includes('dashboard.html')) return 'dashboard';
    if (path.includes('product-form.html')) return 'product-form';
    return 'home';
  }

  initializePage(page) {
    switch (page) {
      case 'home':
        this.initializeHomePage();
        break;
      case 'dashboard':
        this.initializeDashboard();
        break;
      case 'login':
      case 'signup':
        // These pages handle their own initialization
        break;
      case 'product-form':
        this.initializeProductForm();
        break;
    }
  }

  initializeNavigation() {
    // Handle navigation clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href*=".html"]')) {
        // Let default navigation work, but could add custom logic here
      }
    });
  }

  initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await this.logout();
      });
    }
  }

  async logout() {
    try {
      showLoading(true, 'Signing out...');
      
      const result = await AuthService.logout();
      
      if (result.success) {
        showToast('Logged out successfully', 'success');
        // Redirect to home page
        setTimeout(() => {
          window.location.href = '/src/index.html';
        }, 1000);
      } else {
        showToast('Logout failed', 'error');
      }
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Logout failed', 'error');
    } finally {
      showLoading(false);
    }
  }

  updateUIForAuthenticatedUser() {
    // Show user info, hide auth buttons
    const userInfo = document.getElementById('userInfo');
    const authButtons = document.getElementById('authButtons');
    const userEmail = document.getElementById('userEmail');
    
    if (userInfo) userInfo.style.display = 'flex';
    if (authButtons) authButtons.style.display = 'none';
    if (userEmail && this.currentUser) {
      userEmail.textContent = this.currentUser.email;
    }

    // Show dashboard section on home page
    const welcomeSection = document.getElementById('welcomeSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if (welcomeSection) welcomeSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
  }

  updateUIForGuestUser() {
    // Hide user info, show auth buttons
    const userInfo = document.getElementById('userInfo');
    const authButtons = document.getElementById('authButtons');
    
    if (userInfo) userInfo.style.display = 'none';
    if (authButtons) authButtons.style.display = 'flex';

    // Show welcome section on home page
    const welcomeSection = document.getElementById('welcomeSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if (welcomeSection) welcomeSection.style.display = 'block';
    if (dashboardSection) dashboardSection.style.display = 'none';
  }

  initializeHomePage() {
    // Load user's products if authenticated
    if (this.currentUser) {
      this.loadUserProducts();
    }
  }

  async loadUserProducts() {
    try {
      const products = await ProductService.getProducts();
      this.displayProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  displayProducts(products) {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;

    if (!products || products.length === 0) {
      productsList.innerHTML = `
        <div class="empty-state">
          <h3>No products yet</h3>
          <p>Start by adding your first product.</p>
          <a href="pages/product-form.html" class="btn btn-primary">Add Product</a>
        </div>
      `;
      return;
    }

    productsList.innerHTML = products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description || ''}</p>
          <div class="product-price">${formatCurrency(product.price)}</div>
        </div>
        <div class="product-actions">
          <button class="btn btn-sm btn-outline" onclick="app.editProduct('${product.id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="app.deleteProduct('${product.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }

  async editProduct(productId) {
    window.location.href = `pages/product-form.html?id=${productId}`;
  }

  async deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      showLoading(true, 'Deleting product...');
      
      const result = await ProductService.deleteProduct(productId);
      
      if (result.success) {
        showToast('Product deleted successfully', 'success');
        await this.loadUserProducts(); // Refresh the list
      } else {
        showToast(result.error || 'Failed to delete product', 'error');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      showToast('Failed to delete product', 'error');
    } finally {
      showLoading(false);
    }
  }

  initializeDashboard() {
    // Dashboard-specific initialization
    this.loadUserProducts();
  }

  initializeProductForm() {
    // Product form initialization would go here
    // This would be implemented when we work on the product form page
  }
}

// Initialize app when DOM is loaded
let app;

document.addEventListener('DOMContentLoaded', async () => {
  app = new App();
  await app.init();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}