import { cartService } from "../cart-service.js";

export default class CartPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.pickupTime = null;
    this.render();

  setTimeout(() => {
    const pickupSelect = this.shadowRoot.getElementById("pickup-time");
    if (!pickupSelect) return;

    const savedTime = cartService.getPickupTime();
    pickupSelect.innerHTML = ''; // clear

    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);

    // Round up to next 10 min
    const roundedMinutes = Math.ceil(now.getMinutes() / 10) * 10;
    if (roundedMinutes === 60) {
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
    } else {
      now.setMinutes(roundedMinutes);
    }

    const latest = new Date();
    latest.setHours(20, 0, 0, 0); // 8:00 PM

    const options = [];

    while (now <= latest) {
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const value = `${h}:${m}`;
      options.push(value);
      now.setMinutes(now.getMinutes() + 10);
    }

    options.forEach(time => {
      const option = document.createElement('option');
      option.value = time;
      option.textContent = time;
      pickupSelect.appendChild(option);
    });

    const selected = savedTime && options.includes(savedTime) ? savedTime : options[0];
    pickupSelect.value = selected;
    this.pickupTime = selected;
    cartService.setPickupTime(selected);
  }, 0);



    this.bindEvents();
    this.updateCartUI();
  }

  formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
  }

  calculateTotals() {
    const cart = cartService.getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const subtotalElement = this.shadowRoot.getElementById('subtotal');
    const taxElement = this.shadowRoot.getElementById('tax');
    const totalElement = this.shadowRoot.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = this.formatPrice(subtotal);
    if (taxElement) taxElement.textContent = this.formatPrice(tax);
    if (totalElement) totalElement.textContent = this.formatPrice(total);
  }

  isCartEmpty() {
    return cartService.getCart().length === 0;
  }

  renderCartItems() {
    const cartItemsContainer = this.shadowRoot.getElementById("cart-items");
    cartItemsContainer.innerHTML = '';

    const cart = cartService.getCart();

    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='/img/default-coffee.jpg'">
        </div>
        <div class="item-details">
          <div class="item-name">${item.name}</div>
          <div class="item-size">${item.size || 'Regular'}</div>
        </div>
        <div class="item-quantity">x${item.quantity}</div>
        <div class="item-price">${this.formatPrice(item.price * item.quantity)}</div>
        <button class="remove-btn" data-id="${item.id}">×</button>
      `;

      cartItemsContainer.appendChild(cartItem);
    });

    // Add event listeners to remove buttons
    this.shadowRoot.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const itemId = parseInt(event.target.getAttribute('data-id'));
        this.removeFromCart(itemId);
      });
    });
  }

  updateCartUI() {
    const cartItemsContainer = this.shadowRoot.getElementById("cart-items");
    const emptyCartContainer = this.shadowRoot.getElementById("empty-cart");
    const cartSummaryContainer = this.shadowRoot.getElementById("cart-summary");

    if (this.isCartEmpty()) {
      if (cartItemsContainer) cartItemsContainer.classList.add('hidden');
      if (cartSummaryContainer) cartSummaryContainer.classList.add('hidden');
      if (emptyCartContainer) emptyCartContainer.classList.remove('hidden');
    } else {
      if (cartItemsContainer) cartItemsContainer.classList.remove('hidden');
      if (cartSummaryContainer) cartSummaryContainer.classList.remove('hidden');
      if (emptyCartContainer) emptyCartContainer.classList.add('hidden');
      this.renderCartItems();
      this.calculateTotals();
    }
  }

  removeFromCart(itemId) {
    cartService.removeItem(itemId);
    this.updateCartUI();
  }

  clearCart() {
    cartService.clearCart();
    this.updateCartUI();
  }

  goToMenu() {
    window.router.navigate('/menu');
  }

  goToCheckout() {
    if (!this.pickupTime) {
      alert("Please select a pick-up time before proceeding.");
      return;
    }
    cartService.setPickupTime(this.pickupTime);
    window.router.navigate('/payment');
  }

  bindEvents() {
    const browseMenuBtn = this.shadowRoot.getElementById('browse-menu-btn');
    const clearCartBtn = this.shadowRoot.getElementById('clear-cart-btn');
    const checkoutBtn = this.shadowRoot.getElementById('checkout-btn');
    const backBtn = this.shadowRoot.getElementById('back-btn');
    const pickupTimeInput = this.shadowRoot.getElementById("pickup-time");

    if (browseMenuBtn) {
      browseMenuBtn.addEventListener('click', () => this.goToMenu());
    }

    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => this.clearCart());
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.goToCheckout());
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => this.goToMenu());
    }

    if (pickupTimeInput) {
      pickupTimeInput.addEventListener("change", (e) => {
        this.pickupTime = e.target.value;
        cartService.setPickupTime(this.pickupTime);
      });
    }

    // Listen for cart updates from other components
    window.addEventListener('cart-updated', () => {
      this.updateCartUI();
    });
  }

  styleSheet = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .hidden {
        display: none !important;
      }

      button {
        cursor: pointer;
        background-color: #d4a574;
        color: #4a3520;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 14px;
        transition: all 0.3s ease;
      }

      button:hover {
        background-color: #c69c6d;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      #back-btn {
        background-color: transparent;
        color: #6f4e37;
        padding: 5px 10px;
        margin-bottom: 10px;
        display: inline-block;
      }

      .primary-btn {
        background-color: #6f4e37;
        color: #fff;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: bold;
      }

      h2 {
        color: #6f4e37;
        margin: 30px 0 20px;
        font-size: 1.8rem;
      }

      .cart-items {
        background-color: #fff;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        margin-bottom: 30px;
      }

      .cart-item {
        display: flex;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e9e1d9;
      }

      .cart-item:last-child {
        border-bottom: none;
      }

      .item-image {
        width: 80px;
        height: 80px;
        border-radius: 10px;
        overflow: hidden;
        margin-right: 20px;
      }

      .item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .item-details {
        flex: 1;
      }

      .item-name {
        font-weight: bold;
        font-size: 1.1rem;
        color: #6f4e37;
        margin-bottom: 5px;
      }

      .item-size {
        font-size: 0.9rem;
        color: #8b5a2b;
        margin-bottom: 5px;
      }

      .item-options {
        font-size: 0.8rem;
        color: #8b5a2b;
      }

      .item-quantity {
        font-weight: bold;
        margin: 0 20px;
      }

      .item-price {
        font-weight: bold;
        font-size: 1.1rem;
        color: #6f4e37;
        margin-right: 15px;
      }

      .remove-btn {
        background-color: #ff6b6b;
        color: #fff;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        font-size: 18px;
      }

      /* Empty Cart */
      .empty-cart {
        text-align: center;
        padding: 40px 20px;
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        margin-bottom: 30px;
      }

      .empty-cart h3 {
        font-size: 1.5rem;
        color: #6f4e37;
        margin-bottom: 10px;
      }

      .empty-cart p {
        color: #8b5a2b;
        margin-bottom: 20px;
      }

      .empty-cart-animation {
        position: relative;
        width: 150px;
        height: 180px;
        margin: 0 auto 30px;
      }

      .coffee-cup {
        position: absolute;
        width: 100px;
        height: 120px;
        background-color: #fff;
        border: 3px solid #6f4e37;
        border-radius: 0 0 50px 50px;
        left: 25px;
      }

      .coffee-cup.empty::after {
        content: "";
        position: absolute;
        width: 40px;
        height: 40px;
        border: 3px solid #6f4e37;
        border-left: 0;
        border-top-right-radius: 40px;
        border-bottom-right-radius: 40px;
        right: -20px;
        top: 30px;
      }

      .coffee-drop {
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: #6f4e37;
        border-radius: 50% 50% 0 50%;
        transform: rotate(-45deg);
        top: 150px;
        left: 65px;
        animation: dropFall 2s ease-in-out infinite;
      }

      @keyframes dropFall {
        0% {
          transform: rotate(-45deg) translateY(-60px);
          opacity: 0;
        }
        50% {
          transform: rotate(-45deg) translateY(0);
          opacity: 1;
        }
        100% {
          transform: rotate(-45deg) translateY(-60px);
          opacity: 0;
        }
      }

      /* Cart Summary */
      .cart-summary {
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        padding: 30px;
      }

      .cart-summary h3 {
        color: #6f4e37;
        margin-bottom: 20px;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        font-weight: 600;
        color: #6f4e37;
      }

      .pickup-time-container {
        margin-top: 25px;
      }

      label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
        color: #6f4e37;
      }

      #pickup-time {
        width: 100%;
        padding: 10px;
        border-radius: 15px;
        border: 2px solid #d4a574;
        font-size: 16px;
        font-weight: 600;
        color: #6f4e37;
        background-color: #fff;
        appearance: none;
        outline: none;
      }

      #pickup-time:focus {
        border-color: #6f4e37;
        box-shadow: 0 0 0 2px rgba(111, 78, 55, 0.2);
      }

    </style>
  `;

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet}
      <button id="back-btn" title="Back to menu">&#8592; Back</button>
      <div class="container">
        <h2>Shopping Cart</h2>
        <div id="cart-items" class="cart-items"></div>

        <div id="empty-cart" class="empty-cart hidden">
          <div class="empty-cart-animation">
            <div class="coffee-cup empty"></div>
            <div class="coffee-drop"></div>
          </div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button id="browse-menu-btn" class="primary-btn">Browse Menu</button>
        </div>

        <div id="cart-summary" class="cart-summary">
          <div class="summary-item">
            <div>Subtotal:</div>
            <div id="subtotal">$0.00</div>
          </div>
          <div class="summary-item">
            <div>GST (10%):</div>
            <div id="tax">$0.00</div>
          </div>
          <div class="summary-item" style="font-size: 1.2rem; font-weight: 700;">
            <div>Total:</div>
            <div id="total">$0.00</div>
          </div>

          <div class="pickup-time-container">
            <label for="pickup-time">Pick-up time:</label>
            <select id="pickup-time">
              <!-- options will be injected dynamically -->
            </select>
          </div>

          <div style="margin-top: 30px; display: flex; gap: 15px;">
            <button id="clear-cart-btn">Clear Cart</button>
            <button id="checkout-btn" class="primary-btn">Checkout</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("cart-page", CartPage);
