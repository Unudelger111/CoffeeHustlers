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
    const tax = subtotal * 0.1;
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
      payBtn.addEventListener("click", () => this.submitOrder());
    }
  }

  async submitOrder() {
    const cart = cartService.getCart();
    const pickupTime = cartService.getPickupTime();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!user?.id || !token) {
      alert("You must be logged in to place an order.");
      return;
    }

    if (!pickupTime || !cart.length) {
      alert("Cart is empty or pick-up time not set.");
      return;
    }

    const shopId = cart[0].shop_id;

    const orderPayload = {
      user_id: user.id,
      shop_id: shopId,
      pickup_time: this.combineDateWithTime(pickupTime)
    };

    try {
      const orderRes = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "*/*"
        },
        body: JSON.stringify(orderPayload)
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.message || "Order creation failed");
      }

      const orderData = await orderRes.json();
      const orderId = orderData.id;
      const publicOrderId = orderData.public_order_id;

      for (const item of cart) {
        const itemPayload = {
          quantity: item.quantity,
          subtotal: item.price * item.quantity,

          menu_size_id: item.menu_size_id 
        };

        const itemRes = await fetch(`http://localhost:3000/orders/${orderId}/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept": "*/*"
          },
          body: JSON.stringify(itemPayload)
        });

        if (!itemRes.ok) {
          const err = await itemRes.json();
          throw new Error(`Failed to add item to order: ${err.message}`);
        }
      }

      sessionStorage.setItem("orderConfirmation", JSON.stringify({
        public_order_id: publicOrderId,
        total_price: this.totalAmount
      }));

      cartService.clearCart();
      window.router.navigate("/order-confirmation");

    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("❌ Failed to place order: " + error.message);
    }
  }
  
  combineDateWithTime(timeStr) {
    const [hour, minute] = timeStr.split(":").map(Number);
    const now = new Date();
    now.setHours(hour);
    now.setMinutes(minute);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now.toISOString(); 
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