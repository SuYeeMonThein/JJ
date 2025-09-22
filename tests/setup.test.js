/**
 * Jest Configuration Test
 * Verifies that Jest setup is working correctly
 */

describe('Jest Setup Verification', () => {
  test('should have access to jsdom environment', () => {
    expect(window).toBeDefined()
    expect(document).toBeDefined()
    expect(window.location).toBeDefined()
  })

  test('should have mocked browser APIs', () => {
    expect(window.crypto).toBeDefined()
    expect(window.crypto.getRandomValues).toBeDefined()
    expect(window.crypto.subtle).toBeDefined()
    expect(global.indexedDB).toBeDefined()
    expect(window.localStorage).toBeDefined()
    expect(window.sessionStorage).toBeDefined()
  })

  test('should have global test utilities', () => {
    expect(global.createMockUser).toBeDefined()
    expect(global.createMockProduct).toBeDefined()
    expect(global.createMockFormData).toBeDefined()
    expect(global.waitForAsync).toBeDefined()
  })

  test('global test utilities should work correctly', () => {
    const mockUser = global.createMockUser()
    expect(mockUser).toHaveProperty('id')
    expect(mockUser).toHaveProperty('email', 'test@example.com')

    const mockProduct = global.createMockProduct({ name: 'Custom Product' })
    expect(mockProduct).toHaveProperty('name', 'Custom Product')
    expect(mockProduct).toHaveProperty('price', 29.99)
  })

  test('should have custom matchers available', () => {
    const mockFn = jest.fn()
    const user = global.createMockUser()
    
    mockFn(user)
    expect(mockFn).toHaveBeenCalledWithUser(user)
  })
})