export class CartService {
  constructor() {
    this.cartKey = 'cart';
    this.pickupTimeKey = 'pickupTime'; 
    this.init();
  }
  
  init() {
    if (!localStorage.getItem(this.cartKey)) {
      localStorage.setItem(this.cartKey, JSON.stringify([]));
    }
  }
  
  getCart() {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }
  
  saveCart(cart) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.notifyCartUpdated();
  }
  
  addItem(item) {
    const cart = this.getCart();

    const existingItemIndex = cart.findIndex(i => i.id === item.id && i.size === item.size);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + (item.quantity || 1);
    } else {
      if (!item.quantity) {
        item.quantity = 1;
      }
      cart.push(item);
    }

    this.saveCart(cart);
    return cart;
  }

  
  updateItemQuantity(itemId, quantity) {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(i => i.id === itemId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      
      this.saveCart(cart);
    }
    
    return cart;
  }
  
  removeItem(itemId) {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    this.saveCart(updatedCart);
    return updatedCart;
  }
  
  clearCart() {
    this.saveCart([]);
    this.clearPickupTime();
    return [];
  }
  
  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }
  
  getTotalPrice() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  }
  
  notifyCartUpdated() {
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }

  setPickupTime(time) {
    localStorage.setItem(this.pickupTimeKey, time);
  }

  getPickupTime() {
    return localStorage.getItem(this.pickupTimeKey);
  }

  clearPickupTime() {
    localStorage.removeItem(this.pickupTimeKey);
  }
}

export const cartService = new CartService();