class BaristaPage extends HTMLElement {
  constructor() {
    super();
    this.orders = [];
    this.token = '';
    this.shopId = '';
  }

  connectedCallback() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const shopId = localStorage.getItem('selected_shop_id');

    if (!token || !shopId) {
      this.renderError('You must be logged in and have a selected coffee shop.');
      return;
    }

    if (role !== 'Barista') {
      window.location.href = '/menu';
      return;
    }

    this.token = token;
    this.shopId = shopId;
    this.fetchOrders();
  }

  async fetchOrders() {
    try {
      const res = await fetch(`http://localhost:3000/coffee-shops/${this.shopId}/orders`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch orders');

      const data = await res.json();
      this.orders = data.orders;
      this.render();
    } catch (err) {
      console.error(err);
      this.renderError('Failed to load orders.');
    }
  }

  renderError(message) {
    this.innerHTML = `
      <style>
        .container {
          padding: 20px;
          font-family: sans-serif;
          text-align: center;
          color: red;
        }
      </style>
      <div class="container">${message}</div>
    `;
  }

  render() {
    this.innerHTML = `
      <style>
        .container {
          padding: 20px;
          font-family: sans-serif;
          max-width: 800px;
          margin: auto;
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .order {
          background: white;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 0 5px rgba(0,0,0,0.05);
        }
        .order p {
          margin: 6px 0;
        }
        .status {
          font-weight: bold;
          color: #6b4f2c;
        }
      </style>
      <div class="container">
        <h2>Incoming Orders</h2>
        ${this.orders.length === 0 ? '<p>No orders found.</p>' : this.orders.map(order => `
          <div class="order">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Status:</strong> <span class="status">${order.status}</span></p>
            <p><strong>Items:</strong> ${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</p>
          </div>
        `).join('')}
      </div>
    `;
  }
}

customElements.define('barista-page', BaristaPage);
