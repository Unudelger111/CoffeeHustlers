class BaristaPage extends HTMLElement {
  constructor() {
    super();
    this.orders = [];
    this.token = '';
    this.shopId = '';
    this.expandedOrderId = null;
    this.orderDetailsCache = {};
    this.pollingInterval = null;
  }

  connectedCallback() {
    const token = localStorage.getItem('token');
    const shopId = localStorage.getItem('selected_shop_id');

    if (!token || !shopId) {
      this.renderError('You must be logged in and have a selected coffee shop.');
      return;
    }

    this.token = token;
    this.shopId = shopId;
    this.fetchOrders();
    this.startPolling();
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
      console.log('Fetching data!');
      this.orders = data;
      this.render();
    } catch (err) {
      console.error(err);
      this.renderError('Failed to load orders.');
    }
  }
  startPolling() {
    this.pollingInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.fetchOrders();
      }
    }, 10000); // every 10 seconds
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    const logoutEvent = new CustomEvent('user-logged-out', {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(logoutEvent);

    window.location.href = '/login'; 
  }

  disconnectedCallback() {
    this.stopPolling();
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

  async fetchOrderDetails(orderId) {
    if (this.orderDetailsCache[orderId]) return; 

    try {
      const res = await fetch(`http://localhost:3000/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch order details');

      const orderData = await res.json();
      this.orderDetailsCache[orderId] = orderData;
      this.expandedOrderId = orderId;
      this.render(); 
    } catch (err) {
      console.error(err);
      alert('Failed to load item details.');
    }
  }


  render() {
    this.innerHTML = `
      <style>
        .container {
          padding: 20px;
          font-family: sans-serif;
          max-width: 900px;
          margin: auto;
        }
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        h2 {
          margin: 0;
          font-size: 24px;
          color: var(--heading-color, #6b4f2c);
        }
        .logout-btn {
          background-color: #6f4e37;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .logout-btn:hover {
          background-color: #a67c52;
          transform: translateY(-2px);
        }
        .order {
          background: var(--card-bg, #fff);
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 0 5px rgba(0,0,0,0.05);
          transition: box-shadow 0.3s ease;
        }
        .order:hover {
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .order-info p {
          margin: 4px 0;
          color: #333;
        }
        .status {
          font-weight: bold;
          color: #6b4f2c;
        }
        @media (max-width: 600px) {
          .top-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .logout-btn {
            align-self: flex-end;
          }
        }
        .toggle-btn {
          background: none;
          border: none;
          color: #6f4e37;
          cursor: pointer;
          font-size: 14px;
          margin-top: 10px;
          text-decoration: underline;
        }
        .order-items {
          margin-top: 10px;
          padding-left: 20px;
          font-size: 14px;
        }

      </style>

      <div class="container">
        <div class="top-bar">
          <h2>Incoming Orders</h2>
          <button class="logout-btn" id="logout-btn">Logout</button>
        </div>
        ${this.orders.length === 0
          ? `<p>No orders found.</p>`
          : this.orders.map(order => `
              <div class="order" data-id="${order.id}" style="cursor: pointer;">
                <div class="order-header">
                  <div><strong>Order ID:</strong> ${order.public_order_id}</div>
                  <div><strong>Customer:</strong> ${order.User?.name || "Unknown"}</div>
                </div>
                <div class="order-info">
                  <p><strong>Status:</strong> <span class="status">${order.order_status}</span></p>
                  <p><strong>Pickup Time:</strong> ${new Date(order.pickup_time).toLocaleString()}</p>
                  <p><strong>Ordered At:</strong> ${new Date(order.order_time).toLocaleString()}</p>
                </div>
                
              </div>
            `).join('')}
      </div>
    `;

    this.querySelector('#logout-btn')?.addEventListener('click', () => this.logout());
    this.querySelectorAll('.order').forEach(orderEl => {
      const orderId = parseInt(orderEl.dataset.id);
      orderEl.addEventListener('click', () => {
        window.location.href = `/barista-order/${orderId}`;
      });
    });

  }
}

customElements.define('barista-page', BaristaPage);
