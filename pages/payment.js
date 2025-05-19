import { cartService } from "../cart-service.js";

export default class PaymentPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.paymentType = "Credit Card";
    this.render();
    this.bindEvents();
    this.renderCartItems();
    this.calculateTotal();
  }

  formatPrice(price) {
    return "$" + parseFloat(price).toFixed(2);
  }

  calculateTotal() {
    const cart = cartService.getCart();
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const totalElement = this.shadowRoot.getElementById("total");
    if (totalElement) totalElement.textContent = this.formatPrice(total);
    this.totalAmount = total;
  }

  renderCartItems() {
    const cartItemsContainer = this.shadowRoot.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";

    const cart = cartService.getCart();
    cart.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <span>${item.name} (${item.size || "Regular"}) x${item.quantity}</span>
        <span>${this.formatPrice(item.price * item.quantity)}</span>
      `;
      cartItemsContainer.appendChild(div);
    });
  }

  bindEvents() {
    const payBtn = this.shadowRoot.getElementById("pay-btn");
    const paymentSelect = this.shadowRoot.getElementById("payment-type");

    if (paymentSelect) {
      paymentSelect.addEventListener("change", (e) => {
        this.paymentType = e.target.value;
      });
    }

    if (payBtn) {
      payBtn.addEventListener("click", () => this.generateQRCode());
    }
  }

  generateQRCode() {
    const cart = cartService.getCart();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const order = {
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size || "Regular",
        quantity: item.quantity,
        price: item.price,
      })),
      total: this.totalAmount,
      paymentType: this.paymentType,
      timestamp: new Date().toISOString(),
    };

    const qrContainer = this.shadowRoot.getElementById("qr-code");
    qrContainer.innerHTML = ""; 

    // Generate QR code with qrcode library (https://github.com/soldair/node-qrcode)
    QRCode.toCanvas(order, { errorCorrectionLevel: "H", width: 200 }, (error, canvas) => {
      if (error) {
        console.error(error);
        alert("Failed to generate QR code");
        return;
      }
      qrContainer.appendChild(canvas);
    });
  }

  styleSheet = `
  <style>
    * {
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    h2 {
      color: #6f4e37;
      margin-bottom: 20px;
      text-align: center;
    }
    .cart-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e9e1d9;
      color: #6f4e37;
      font-weight: 600;
    }
    #total-row {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      font-size: 1.3rem;
      font-weight: bold;
      color: #6f4e37;
    }
    label {
      display: block;
      margin: 20px 0 8px;
      font-weight: 600;
      color: #6f4e37;
    }
    select {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #d4a574;
      font-size: 1rem;
      color: #6f4e37;
      background: #fff;
      cursor: pointer;
    }
    button {
      margin-top: 25px;
      width: 100%;
      background-color: #6f4e37;
      color: white;
      font-weight: bold;
      padding: 14px 0;
      border: none;
      border-radius: 25px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #533d26;
    }
    #qr-code {
      margin-top: 30px;
      text-align: center;
    }
  </style>
  `;

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet}
      <div class="container">
        <h2>Confirm Your Payment</h2>
        <div id="cart-items"></div>
        <div id="total-row">
          <span>Total:</span>
          <span id="total">$0.00</span>
        </div>
        <label for="payment-type">Select Payment Type</label>
        <select id="payment-type">
          <option value="Credit Card" selected>Credit Card</option>
          <option value="Mobile Pay">Mobile Pay</option>
          <option value="Cash">Cash</option>
        </select>
        <button id="pay-btn">Pay</button>
        <div id="qr-code"></div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
    `;
  }
}

customElements.define("payment-page", PaymentPage);
