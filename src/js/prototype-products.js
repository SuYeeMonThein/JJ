/**
 * Prototype ProductService - Fake product management for UI prototyping
 * Always succeeds, uses fake data, perfect for demos and prototypes
 */
class PrototypeProductService {
  constructor() {
    this.products = [];
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      // Load fake products from localStorage or create sample data
      const savedProducts = localStorage.getItem('prototypeProducts');
      if (savedProducts) {
        this.products = JSON.parse(savedProducts);
      } else {
        // Create some sample products for demo
        this.products = [
          {
            id: 'product_1',
            name: 'Sample iPhone 15',
            description: 'Latest iPhone with amazing features',
            price: 999.99,
            category: 'Electronics',
            userId: 'demo_user',
            createdAt: new Date().toISOString()
          },
          {
            id: 'product_2', 
            name: 'Sample MacBook Pro',
            description: 'Powerful laptop for professionals',
            price: 1999.99,
            category: 'Computers',
            userId: 'demo_user',
            createdAt: new Date().toISOString()
          }
        ];
        this.saveProducts();
      }
      this.initialized = true;
    }
  }

  // Fake create product - always succeeds
  async createProduct(productData) {
    await this.init();
    await this.delay(300);

    const product = {
      id: 'product_' + Date.now(),
      name: productData.name || 'Sample Product',
      description: productData.description || 'Sample description',
      price: productData.price || 19.99,
      category: productData.category || 'General',
      userId: 'demo_user', // Always use demo user for prototype
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.push(product);
    this.saveProducts();

    return {
      success: true,
      product: product
    };
  }

  // Fake get products - returns all fake products
  async getProducts() {
    await this.init();
    await this.delay(200);
    return this.products;
  }

  // Fake get single product
  async getProduct(productId) {
    await this.init();
    await this.delay(150);
    return this.products.find(p => p.id === productId) || null;
  }

  // Fake update product
  async updateProduct(productId, updates) {
    await this.init();
    await this.delay(250);

    const productIndex = this.products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveProducts();

    return {
      success: true,
      product: this.products[productIndex]
    };
  }

  // Fake delete product
  async deleteProduct(productId) {
    await this.init();
    await this.delay(200);

    const productIndex = this.products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    this.products.splice(productIndex, 1);
    this.saveProducts();

    return {
      success: true
    };
  }

  // Fake search products
  async searchProducts(query) {
    await this.init();
    await this.delay(150);

    if (!query) return this.products;

    return this.products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Save products to localStorage
  saveProducts() {
    localStorage.setItem('prototypeProducts', JSON.stringify(this.products));
  }

  // Utility function to simulate async delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Add sample products for demo
  addSampleProducts() {
    const sampleProducts = [
      {
        id: 'sample_1',
        name: 'Wireless Headphones',
        description: 'High-quality noise-canceling headphones',
        price: 199.99,
        category: 'Audio',
        userId: 'demo_user',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample_2',
        name: 'Smart Watch',
        description: 'Fitness tracking smartwatch with GPS',
        price: 299.99,
        category: 'Wearables',
        userId: 'demo_user',
        createdAt: new Date().toISOString()
      }
    ];

    this.products.push(...sampleProducts);
    this.saveProducts();
    return sampleProducts;
  }

  // Clear all fake data
  clearAllData() {
    this.products = [];
    localStorage.removeItem('prototypeProducts');
  }
}

// Create singleton instance
const prototypeProductService = new PrototypeProductService();

// Export for CommonJS (Jest/Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = prototypeProductService;
}

// Export for ES6 modules
if (typeof exports !== 'undefined') {
  exports.default = prototypeProductService;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.PrototypeProductService = prototypeProductService;
}