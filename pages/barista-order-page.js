export default class BaristaOrderPage extends HTMLElement {
  constructor() {
    super();
    this.order = null;
    this.token = localStorage.getItem('token');
    this.orderId = null;
  }

  connectedCallback() {
    this.orderId = parseInt(this.routeParams?.id);

    if (!this.token || !this.orderId) {
      this.innerHTML = `<p>Error: Missing token or order ID</p>`;
      return;
    }

    this.fetchOrder();
  }

  async fetchOrder() {
    try {
      const res = await fetch(`http://localhost:3000/orders/${this.orderId}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      if (!res.ok) throw new Error('Failed to load order');
      this.order = await res.json();
      this.render();
    } catch (err) {
      this.innerHTML = `<p>Error loading order.</p>`;
    }
  }

  async updateStatus(newStatus) {
    try {
      const res = await fetch(`http://localhost:3000/orders/${this.orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        },
        body: JSON.stringify({ order_status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      alert('Status updated!');
      this.fetchOrder();
    } catch (err) {
      alert('Error updating status');
    }
  }

  render() {
    if (!this.order) {
      this.innerHTML = `<p>Loading...</p>`;
      return;
    }

    const { public_order_id, order_status, pickup_time, order_time, User, OrderDetails } = this.order;

    this.innerHTML = `
      <style>
        .container {
          max-width: 800px;
          margin: auto;
          padding: 20px;
          font-family: sans-serif;
        }
        .item {
          margin-bottom: 10px;
        }
        button {
          padding: 8px 16px;
          margin-right: 10px;
          border-radius: 20px;
          background-color: #6f4e37;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-color: #a67c52;
        }
      </style>
      <div class="container">
        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> ${public_order_id}</p>
        <p><strong>Customer:</strong> ${User?.name || 'Unknown'}</p>
        <p><strong>Status:</strong> ${order_status}</p>
        <p><strong>Pickup:</strong> ${new Date(pickup_time).toLocaleString()}</p>
        <p><strong>Ordered At:</strong> ${new Date(order_time).toLocaleString()}</p>

        <h3>Items:</h3>
        <div>
          ${OrderDetails.map(d => `
            <div class="item">
              ${d.MenuItemSize.menu_item.name} (${d.MenuItemSize.size}) × ${d.quantity}
            </div>
          `).join('')}
        </div>

        <h3>Update Status:</h3>
        <button data-status="Preparing">Preparing</button>
        <button data-status="Ready">Ready</button>
        <button data-status="Completed">Completed</button>
        <br><br>
        <button onclick="window.history.back()">← Back</button>
      </div>
    `;

    this.querySelectorAll('button[data-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        const status = btn.getAttribute('data-status');
        this.updateStatus(status);
      });
    });
  }
}

customElements.define('barista-order-page', BaristaOrderPage);
