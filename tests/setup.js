/**
 * Jest Test Setup
 * Global test configuration and utilities
 */

// Add TextEncoder/TextDecoder polyfills for Node.js
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

// Mock Web Crypto API with proper PBKDF2 support
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr) => {
      // Generate secure random values for testing
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
    subtle: {
      importKey: jest.fn(async (format, keyData, algorithm, extractable, keyUsages) => {
        // Mock key material for PBKDF2
        return {
          type: 'secret',
          extractable: false,
          algorithm: { name: 'PBKDF2' },
          usages: keyUsages
        }
      }),
      deriveBits: jest.fn(async (algorithm, baseKey, length) => {
        // Mock PBKDF2 derivation - create deterministic hash based on password and salt
        const password = baseKey._password || 'test-password'
        const salt = Array.from(algorithm.salt)
        const iterations = algorithm.iterations
        
        // Create a deterministic hash based on password and salt
        let hash = 0
        const input = password + salt.join('') + iterations
        for (let i = 0; i < input.length; i++) {
          const char = input.charCodeAt(i)
          hash = ((hash << 5) - hash) + char
          hash = hash & hash // Convert to 32-bit integer
        }
        
        // Ensure consistent output for same inputs
        const buffer = new ArrayBuffer(length / 8)
        const view = new Uint8Array(buffer)
        
        // Use the hash as a seed for consistent generation
        let seed = Math.abs(hash)
        for (let i = 0; i < view.length; i++) {
          // Linear congruential generator for deterministic sequence
          seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
          view[i] = seed % 256
        }
        
        return buffer
      }),
      digest: jest.fn(async (algorithm, data) => {
        // Mock digest for any additional crypto needs
        const buffer = new ArrayBuffer(32)
        const view = new Uint8Array(buffer)
        for (let i = 0; i < view.length; i++) {
          view[i] = Math.floor(Math.random() * 256)
        }
        return buffer
      })
    }
  }
})

// Make crypto available on window as well
Object.defineProperty(window, 'crypto', {
  value: global.crypto
})

// Mock IndexedDB
const FDBFactory = require('fake-indexeddb/lib/FDBFactory')
const FDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')

global.indexedDB = new FDBFactory()
global.IDBKeyRange = FDBKeyRange

// Mock localStorage with actual storage behavior
const localStorageData = {};
const localStorageMock = {
  getItem: jest.fn((key) => localStorageData[key] || null),
  setItem: jest.fn((key, value) => { localStorageData[key] = value; }),
  removeItem: jest.fn((key) => { delete localStorageData[key]; }),
  clear: jest.fn(() => { 
    Object.keys(localStorageData).forEach(key => delete localStorageData[key]); 
  }),
  key: jest.fn(),
  get length() { return Object.keys(localStorageData).length; }
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Make localStorage available globally for Node.js tests  
global.localStorage = localStorageMock

// Mock sessionStorage with actual storage behavior
const sessionStorageData = {};
const sessionStorageMock = {
  getItem: jest.fn((key) => sessionStorageData[key] || null),
  setItem: jest.fn((key, value) => { sessionStorageData[key] = value; }),
  removeItem: jest.fn((key) => { delete sessionStorageData[key]; }),
  clear: jest.fn(() => { 
    Object.keys(sessionStorageData).forEach(key => delete sessionStorageData[key]); 
  }),
  key: jest.fn(),
  get length() { return Object.keys(sessionStorageData).length; }
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
})

// Make sessionStorage available globally for Node.js tests
global.sessionStorage = sessionStorageMock

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn()
  },
  writable: true
})

// Mock fetch for API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob())
  })
)

// Mock URL constructor
global.URL = jest.fn((url) => ({
  href: url,
  origin: 'http://localhost',
  protocol: 'http:',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: url.replace('http://localhost', ''),
  search: '',
  hash: ''
}))

// Global test utilities
global.createMockUser = () => ({
  id: 'user-123',
  email: 'test@example.com',
  passwordHash: 'hashed-password',
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString()
})

global.createMockProduct = (overrides = {}) => ({
  id: 'product-123',
  name: 'Test Product',
  description: 'A test product description',
  price: 29.99,
  category: 'Electronics',
  imageUrl: 'https://example.com/image.jpg',
  sku: 'TEST-123',
  stock: 10,
  isActive: true,
  userId: 'user-123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

global.createMockFormData = (data) => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  return formData
}

// Mock DOM methods commonly used in tests
global.createMockElement = (tagName, attributes = {}) => {
  const element = document.createElement(tagName)
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'textContent') {
      element.textContent = value
    } else if (key === 'innerHTML') {
      element.innerHTML = value
    } else {
      element.setAttribute(key, value)
    }
  })
  return element
}

// Mock service responses
global.createMockServiceResponse = (success = true, data = null, errors = []) => ({
  success,
  data,
  errors
})

// Clean up after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks()
  
  // Reset localStorage and sessionStorage
  localStorageMock.clear()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  
  sessionStorageMock.clear()
  sessionStorageMock.getItem.mockClear()
  sessionStorageMock.setItem.mockClear()
  sessionStorageMock.removeItem.mockClear()
  
  // Reset fetch mock
  fetch.mockClear()
  
  // Clear document body
  document.body.innerHTML = ''
  
  // Reset window location
  window.location.href = 'http://localhost/'
  window.location.pathname = '/'
  window.location.search = ''
  window.location.hash = ''
})

// Global test timeout for async operations
jest.setTimeout(10000)

// Suppress console warnings during tests unless needed
const originalWarn = console.warn
beforeAll(() => {
  console.warn = jest.fn()
})

afterAll(() => {
  console.warn = originalWarn
})

// Test helper functions
global.waitForAsync = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

global.simulateFormSubmit = (form, formData) => {
  const event = new Event('submit', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'target', { value: form })
  Object.defineProperty(event, 'preventDefault', { value: jest.fn() })
  
  // Mock FormData constructor to return our test data
  global.FormData = jest.fn(() => {
    const mockFormData = {
      get: jest.fn((key) => formData[key]),
      getAll: jest.fn((key) => [formData[key]]),
      has: jest.fn((key) => key in formData),
      entries: jest.fn(() => Object.entries(formData)),
      keys: jest.fn(() => Object.keys(formData)),
      values: jest.fn(() => Object.values(formData))
    }
    return mockFormData
  })
  
  return event
}

global.simulateClick = (element) => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  element.dispatchEvent(event)
  return event
}

global.simulateInput = (element, value) => {
  element.value = value
  const event = new Event('input', { bubbles: true })
  element.dispatchEvent(event)
  return event
}

global.simulateKeyDown = (element, key, options = {}) => {
  const event = new KeyboardEvent('keydown', { 
    key, 
    bubbles: true, 
    cancelable: true,
    ...options 
  })
  element.dispatchEvent(event)
  return event
}

// Custom matchers for better test assertions
expect.extend({
  toHaveBeenCalledWithUser(received, user) {
    const pass = received.mock.calls.some(call => 
      call.some(arg => arg && arg.email === user.email)
    )
    
    if (pass) {
      return {
        message: () => `Expected function not to have been called with user ${user.email}`,
        pass: true
      }
    } else {
      return {
        message: () => `Expected function to have been called with user ${user.email}`,
        pass: false
      }
    }
  },
  
  toHaveBeenCalledWithProduct(received, product) {
    const pass = received.mock.calls.some(call => 
      call.some(arg => arg && arg.name === product.name)
    )
    
    if (pass) {
      return {
        message: () => `Expected function not to have been called with product ${product.name}`,
        pass: true
      }
    } else {
      return {
        message: () => `Expected function to have been called with product ${product.name}`,
        pass: false
      }
    }
  }
})