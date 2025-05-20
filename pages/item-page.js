import { cartService } from "../cart-service.js";

export default class ItemPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.item = null;
    this.quantity = 1;
    this.size = "Regular";
    this.price = 0;

    this.render();
    this.loadItemData();
  }

  connectedCallback() {
    this.setupEventListeners();
  }

  async loadItemData() {
    const cachedItem = sessionStorage.getItem("selectedItem");

    if (!cachedItem) {
      console.error("No item found in sessionStorage.");
      return;
    }

    const parsed = JSON.parse(cachedItem);
    const id = parsed?.id;

    if (!id) {
      console.error("Invalid item ID in sessionStorage.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/menu-items/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: "*/*",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch item");

      const item = await res.json();
      this.item = item;

      // ✅ Set default size and price from the first size
      const firstSize = item.sizes?.[0];
      if (firstSize) {
        this.size = firstSize.size;
        this.price = parseFloat(firstSize.base_price) || 0;
      } else {
        this.size = "Regular";
        this.price = parseFloat(item.price) || 3.99;
      }

      this.updateItemDisplay();
      this.updateTotalPrice();
    } catch (err) {
      console.error("Error loading item from API:", err);
    }
  }



  updateItemDisplay() {
    const nameElement = this.shadowRoot.getElementById('item-name');
    const descriptionElement = this.shadowRoot.getElementById('item-description');
    const priceElement = this.shadowRoot.getElementById('item-price');
    const imageElement = this.shadowRoot.getElementById('item-image');
    const quantityElement = this.shadowRoot.getElementById('quantity');
    const sizeContainer = this.shadowRoot.getElementById('size-buttons');

    if (nameElement) nameElement.textContent = this.item.name;
    if (descriptionElement) descriptionElement.textContent = this.item.description;
    if (priceElement) priceElement.textContent = `$${this.price.toFixed(2)}`;
    if (imageElement) {
      imageElement.src = this.item.image_url || '/img/default-coffee.jpg';
      imageElement.alt = this.item.name;
      imageElement.onerror = () => {
        imageElement.src = '/img/default-coffee.jpg';
      };
    }

    if (quantityElement) quantityElement.value = this.quantity;

    // 🆕 Generate dynamic size buttons
    if (sizeContainer && Array.isArray(this.item.sizes)) {
      sizeContainer.innerHTML = ''; // clear existing
      this.item.sizes.forEach((s, i) => {
        const btn = document.createElement('button');
        btn.textContent = `${s.size} ($${parseFloat(s.base_price).toFixed(2)})`;
        btn.dataset.size = s.size;
        btn.classList.add('size-btn');
        if (s.size === this.size) btn.classList.add('active');
        sizeContainer.appendChild(btn);
      });

      // Re-bind listeners
      this.setupSizeListeners();
    }
  }

  setupSizeListeners() {
    const sizeButtons = this.shadowRoot.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        sizeButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.size = e.target.dataset.size;

        const selected = this.item.sizes?.find(s => s.size === this.size);
        this.price = parseFloat(selected?.base_price) || 0;

        this.shadowRoot.getElementById("item-price").textContent = `$${this.price.toFixed(2)}`;
        this.updateTotalPrice();
      });
    });
  }


  setupEventListeners() {
    const decreaseBtn = this.shadowRoot.getElementById('decrease-quantity');
    const increaseBtn = this.shadowRoot.getElementById('increase-quantity');
    const quantityInput = this.shadowRoot.getElementById('quantity');

    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          quantityInput.value = this.quantity;
          this.updateTotalPrice();
        }
      });
    }

    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        this.quantity++;
        quantityInput.value = this.quantity;
        this.updateTotalPrice();
      });
    }

    if (quantityInput) {
      quantityInput.addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        this.quantity = value > 0 ? value : 1;
        quantityInput.value = this.quantity;
        this.updateTotalPrice();
      });
    }

    const addToCartBtn = this.shadowRoot.getElementById('add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        this.addToCart();
      });
    }

    const backBtn = this.shadowRoot.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.router.navigate('/menu');
      });
    }
  }

  addToCart() {
    if (!this.item) return;

    const cartItem = {
      id: this.item.id,
      name: this.item.name,
      price: this.price,
      image: this.item.image_url,
      quantity: this.quantity,
      size: this.size,
    };

    cartService.addItem(cartItem);

    const messageElement = this.shadowRoot.getElementById('added-message');
    if (messageElement) {
      messageElement.classList.remove('hidden');
      setTimeout(() => {
        messageElement.classList.add('hidden');
      }, 3000);
    }

    window.dispatchEvent(new CustomEvent('cart-updated'));
  }
  updateTotalPrice() {
    const total = this.price * this.quantity;
    const totalPriceEl = this.shadowRoot.getElementById('total-price');
    if (totalPriceEl) {
      totalPriceEl.textContent = `$${total.toFixed(2)}`;
    }
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

    #back-btn {
      background-color: transparent;
      color: --btn-bg;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 16px;
      margin-bottom: 20px;
      display: inline-block;
    }

    .item-container {
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }

    .item-image-container {
      flex: 1;
      min-width: 300px;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .item-image-container img {
      max-width: 100%;
      height: auto;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .item-details {
      flex: 1;
      min-width: 300px;
      padding: 30px;
    }

    .item-name {
      font-size: 2rem;
      color: #6f4e37;
      margin-bottom: 10px;
    }

    .item-description {
      color: #8b5a2b;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .item-price {
      font-size: 1.8rem;
      font-weight: bold;
      color: #6f4e37;
      margin-bottom: 20px;
    }

    .size-selection,
    .quantity-control,
    .special-instructions {
      margin-bottom: 20px;
    }

    .size-selection h3,
    .quantity-control h3,
    .special-instructions h3 {
      font-size: 1.2rem;
      color: #6f4e37;
      margin-bottom: 10px;
    }

    .sizes {
      display: flex;
      gap: 10px;
    }

    .size-btn {
      background-color: #f5f0e8;
      color: #6f4e37;
      border: 2px solid #d4a574;
      border-radius: 20px;
      padding: 8px 16px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .size-btn.active {
      background-color: #d4a574;
      color: #fff;
    }

    .size-btn:hover {
      background-color: #e9e1d9;
    }

    .quantity-buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .quantity-btn {
      width: 40px;
      height: 40px;
      background-color: #f5f0e8;
      color: #6f4e37;
      border: 2px solid #d4a574;
      border-radius: 50%;
      font-size: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .quantity-btn:hover {
      background-color: #e9e1d9;
    }

    #quantity {
      width: 60px;
      height: 40px;
      border: 2px solid #d4a574;
      border-radius: 20px;
      text-align: center;
      font-size: 1.2rem;
      color: #6f4e37;
    }

    #special-instructions {
      width: 100%;
      height: 80px;
      border: 2px solid #d4a574;
      border-radius: 10px;
      padding: 10px;
      font-size: 1rem;
      color: #6f4e37;
      resize: none;
    }

    #add-to-cart {
      background-color: #6f4e37;
      color: #fff;
      border: none;
      border-radius: 30px;
      padding: 15px 30px;
      font-size: 1.2rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      display: block;
      width: 100%;
    }

    #add-to-cart:hover {
      background-color: #5d3f2e;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    #added-message {
      background-color: #4CAF50;
      color: white;
      padding: 10px;
      border-radius: 5px;
      margin-top: 10px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .item-container {
        flex-direction: column;
      }
    }

    /* 🌙 DARK MODE SUPPORT */
    :host-context(.dark) .container {
      background-color: #121212;
      color: #f1f1f1;
    }

    :host-context(.dark) .item-container {
      background-color: #1e1e1e;
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .item-name,
    :host-context(.dark) .item-description,
    :host-context(.dark) .item-price,
    :host-context(.dark) .size-selection h3,
    :host-context(.dark) .quantity-control h3,
    :host-context(.dark) .special-instructions h3 {
      color: #f1f1f1;
    }

    :host-context(.dark) .size-btn {
      background-color: #333;
      color: #f1f1f1;
      border-color: #555;
    }

    :host-context(.dark) .size-btn.active {
      background-color: #d4a574;
      color: #fff;
    }

    :host-context(.dark) #quantity,
    :host-context(.dark) #special-instructions {
      background-color: #2b2b2b;
      color: #f1f1f1;
      border-color: #555;
    }

    :host-context(.dark) #add-to-cart {
      background-color: #d4a574;
      color: #1f1f1f;
    }

    :host-context(.dark) #add-to-cart:hover {
      background-color: #bb9059;
    }

    :host-context(.dark) #back-btn {
      color: #d4a574;
    }

    :host-context(.dark) #added-message {
      background-color: #357a38;
    }
    .total-price {
      margin-bottom: 20px;
    }

    .total-price h3 {
      font-size: 1.2rem;
      color: #6f4e37;
      margin-bottom: 5px;
    }

    .total-price-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #6f4e37;
    }

  </style>
  `;

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet}
      <div class="container">
        <button id="back-btn">← Back to Menu</button>
        
        <div class="item-container">
          <div class="item-image-container">
            <img id="item-image" src="/img/default-coffee.jpg" alt="Coffee">
          </div>
          
          <div class="item-details">
            <h1 id="item-name" class="item-name">Coffee Name</h1>
            <p id="item-description" class="item-description">A delicious coffee beverage perfect for any time of day.</p>
            <div id="item-price" class="item-price">$0.00</div>
            
              <div class="size-selection">
                <h3>Size</h3>
                <div class="sizes" id="size-buttons">
                  <!-- Dynamic buttons will be injected here -->
                </div>
              </div>

            
            <div class="quantity-control">
              <h3>Quantity</h3>
              <div class="quantity-buttons">
                <button id="decrease-quantity" class="quantity-btn">-</button>
                <input type="number" id="quantity" min="1" value="1">
                <button id="increase-quantity" class="quantity-btn">+</button>
              </div>
            </div>
            
            <div class="total-price">
              <h3>Total Price</h3>
              <div id="total-price" class="total-price-value">$0.00</div>
            </div>

            
            <button id="add-to-cart">Add to Cart</button>
            <div id="added-message" class="hidden">Added to cart!</div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('item-page', ItemPage);
