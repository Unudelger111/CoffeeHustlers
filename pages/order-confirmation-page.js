export default class OrderConfirmationPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.order = null;
  }

  connectedCallback() {
    const saved = sessionStorage.getItem("orderConfirmation");
    if (saved) {
      this.order = JSON.parse(saved);
      sessionStorage.removeItem("orderConfirmation");
    }

    this.render();

    if (this.order?.public_order_id) {
      const qrContainer = this.shadowRoot.getElementById("qr-code");

      // ✅ Load the QRCode library dynamically if not already loaded
      if (!window.QRCode) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js";
        script.onload = () => {
          new QRCode(qrContainer, {
            text: this.order.public_order_id,
            width: 200,
            height: 200,
            colorDark: "#000",
            colorLight: "#fff",
          });
        };
        document.body.appendChild(script);
      } else {
        new QRCode(qrContainer, {
          text: this.order.public_order_id,
          width: 200,
          height: 200,
          colorDark: "#000",
          colorLight: "#fff",
        });
      }
    }
  }


  updateDisplay() {
    const idEl = this.shadowRoot.getElementById("order-id");
    const totalEl = this.shadowRoot.getElementById("order-total");

    if (this.order) {
      if (idEl) idEl.textContent = this.order.public_order_id;
      if (totalEl) totalEl.textContent = "$" + this.order.total_price.toFixed(2);
    }
  }

  render() {
    const orderId = this.order?.public_order_id || "...";
    const total = this.order?.total_price?.toFixed(2) || "0.00";

    this.shadowRoot.innerHTML = `
      <style>
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          background-color: #fff;
          border-radius: 15px;
          text-align: center;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        h2 {
          color: #6f4e37;
          margin-bottom: 20px;
        }
        .info {
          font-size: 1.2rem;
          margin: 15px 0;
          color: #4a3520;
        }
        .btn {
          margin-top: 30px;
          padding: 12px 24px;
          background-color: #6f4e37;
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 1rem;
          cursor: pointer;
        }
        .qr-container {
          margin-top: 30px;
          display: flex;
          justify-content: center;
        }

      </style>
    <div class="container">
        <h2>🎉 Thank you for your order!</h2>
        <div class="info">Order ID: <strong>${orderId}</strong></div>
        <div class="info">Total Paid: <strong>$${total}</strong></div>
        <div id="qr-code" class="qr-container"></div>
        <button class="btn" onclick="window.router.navigate('/menu')">Back to Menu</button>
    </div>
    `;
  }
}

customElements.define("order-confirmation-page", OrderConfirmationPage);
