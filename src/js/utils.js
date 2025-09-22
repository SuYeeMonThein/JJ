/**
 * Utility functions for the Product Manager application
 */

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, duration);
}

// Loading overlay functions
function showLoading(show = true, message = 'Loading...') {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;

  if (show) {
    overlay.querySelector('p').textContent = message;
    overlay.style.display = 'flex';
  } else {
    overlay.style.display = 'none';
  }
}

// Form validation helpers
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return re.test(password);
}

// Clear form errors
function clearFormErrors(form) {
  if (!form) return;
  
  form.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
  });
  
  form.querySelectorAll('.form-input').forEach(el => {
    el.classList.remove('error');
  });
}

// Show form errors
function showFormErrors(errors, form) {
  if (!form || !errors) return;
  
  clearFormErrors(form);
  
  if (Array.isArray(errors)) {
    // General errors
    const errorContainer = form.querySelector('.error-messages');
    if (errorContainer) {
      errorContainer.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
      errorContainer.style.display = 'block';
    }
  } else if (typeof errors === 'object') {
    // Field-specific errors
    Object.keys(errors).forEach(field => {
      const input = form.querySelector(`[name="${field}"]`);
      const errorEl = form.querySelector(`#${field}Error`);
      
      if (input) input.classList.add('error');
      if (errorEl) errorEl.textContent = errors[field];
    });
  }
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Format date
function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString));
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showToast,
    showLoading,
    validateEmail,
    validatePassword,
    clearFormErrors,
    showFormErrors,
    formatCurrency,
    formatDate,
    debounce
  };
}