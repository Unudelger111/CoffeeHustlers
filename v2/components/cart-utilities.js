// cart-utilities.js
export function updateCartCount(count) {
    // Update all cart count elements on the page
    document.querySelectorAll('#cart-count').forEach(element => {
      element.textContent = count;
    });
  }
  
  export function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }
  
  export function addItemToCart(item) {
    let cart = getCartItems();
    
    // Add the new item
    cart.push(item);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI immediately
    updateCartCount(cart.length);
    
    // Dispatch global event for components that might be listening
    window.dispatchEvent(new CustomEvent('cart-updated', { 
      detail: { cartSize: cart.length } 
    }));
    
    // Add visual feedback
    const button = document.querySelector(`.add-to-cart-btn[data-id="${item.id}"]`);
    if (button) {
      button.classList.add('added');
      button.textContent = 'Added!';
      
      setTimeout(() => {
        button.classList.remove('added');
        button.textContent = 'Add to Cart';
      }, 1000);
    }
  }
  
  // Initialize cart functionality
  export function initializeCart() {
    // Set initial cart count
    const cart = getCartItems();
    updateCartCount(cart.length);
    
    // Listen for cart updates across the site
    window.addEventListener('cart-updated', (event) => {
      updateCartCount(event.detail.cartSize);
    });
    
    // Listen for storage events (when cart changes in another tab)
    window.addEventListener('storage', (event) => {
      if (event.key === 'cart') {
        const cart = JSON.parse(event.newValue || '[]');
        updateCartCount(cart.length);
      }
    });
  }