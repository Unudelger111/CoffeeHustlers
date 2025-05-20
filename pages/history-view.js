class HistoryView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentTheme = 'light'; 
    this.onThemeChange = this.onThemeChange.bind(this);
    this.pollingInterval = null;
    this.shopCache = {};
  }

  connectedCallback() {
    window.addEventListener('theme-changed', this.onThemeChange);

    this.currentTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';

    this.renderLoading();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user?.id) {
      this.renderError('You must be logged in to view order history.');
      return;
    }

    this.token = token;
    this.userId = user.id;

    this.fetchOrderHistory();
    this.startPolling();
  }

  disconnectedCallback() {
    window.removeEventListener('theme-changed', this.onThemeChange);
    this.stopPolling();
  }

  onThemeChange(e) {
    this.currentTheme = e.detail.theme || 'light';
    if (this.ordersDisplayed) {
      this.renderOrders(this.ordersDisplayed);
    } else if (this.currentOrderDetail) {
      this.renderOrderDetail(this.currentOrderDetail);
    } else {
      this.renderLoading();
      this.fetchOrderHistory();
    }
  }

  startPolling() {
    this.pollingInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && !this.currentOrderDetail) {
        this.fetchOrderHistory();
      }
    }, 10000); // every 10s
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  async fetchOrderHistory() {
    try {
      const res = await fetch(`http://localhost:3000/users/${this.userId}/orders`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': '*/*'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch order history');
      const orders = await res.json();

      const ordersWithDetails = await Promise.all(orders.map(async order => {
        const detailRes = await fetch(`http://localhost:3000/orders/${order.id}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': '*/*'
          }
        });
        if (!detailRes.ok) throw new Error('Failed to fetch order details for order ' + order.id);
        const orderDetails = await detailRes.json();
        return orderDetails;
      }));

      this.ordersDisplayed = ordersWithDetails;
      this.currentOrderDetail = null;
      this.renderOrders(ordersWithDetails);
    } catch (error) {
      console.error(error);
      this.renderError('Failed to load order history.');
    }
  }

  async fetchOrderDetails(orderId) {
    try {
      const res = await fetch(`http://localhost:3000/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': '*/*'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch order details');
      const order = await res.json();
      this.currentOrderDetail = order;
      this.ordersDisplayed = null;
      this.renderOrderDetail(order);
    } catch (error) {
      console.error(error);
      this.renderError('Failed to load order details.');
    }
  }

  async fetchShopInfo(shopId) {
    if (this.shopCache[shopId]) {
      return this.shopCache[shopId];
    }

    try {
      const res = await fetch(`http://localhost:3000/coffee-shops/${shopId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch shop info');
      const shop = await res.json();
      this.shopCache[shopId] = shop;
      return shop;
    } catch (err) {
      console.error(`Shop fetch failed for ID ${shopId}`, err);
      return null;
    }
  }

  renderLoading() {
    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <div class="history-container">
        <h2>Your Order History</h2>
        <p>Loading...</p>
      </div>
    `;
  }

  renderError(message) {
    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <div class="history-container">
        <h2>Error</h2>
        <p class="error">${message}</p>
      </div>
    `;
  }

  renderOrders(orders) {
    const listItems = orders.map(order => {
      const details = order.OrderDetails;
      const summary = (details || []).slice(0, 2).map(d =>
        `${d.MenuItemSize.menu_item.name} ${d.MenuItemSize.size} x${d.quantity}`
      ).join(', ') + (details.length > 2 ? ` +${details.length - 2} more...` : '');

      return `
        <div class="order-card" data-id="${order.id}" data-shop-id="${order.shop_id}">
          <div class="left"><span class="icon">🛍️</span></div>
          <div class="middle">
            <div class="shop-name" id="shop-${order.id}">Loading shop...</div>
            <div class="order-id">Order ID: ${order.public_order_id}</div>
            <div class="items-summary">${summary || 'No items'}</div>
          </div>
          <div class="right">
            <div class="pickup-time">${new Date(order.pickup_time).toLocaleTimeString()}</div>
            <div class="status">${order.order_status}</div>
            <button class="view-btn">View Details</button>
          </div>
        </div>
      `;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <div class="history-container">
        <h2>Your Order History</h2>
        ${listItems || '<p>No orders found.</p>'}
      </div>
    `;

    // Set up "View Details" button listeners
    this.shadowRoot.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('.order-card').dataset.id;
        this.fetchOrderDetails(id);
      });
    });

    // 🔁 After rendering, fetch and update shop info dynamically
    orders.forEach(async (order) => {
      const shop = await this.fetchShopInfo(order.shop_id); // use the function you defined earlier
      const el = this.shadowRoot.getElementById(`shop-${order.id}`);
      if (el && shop) {
        el.textContent = `${shop.name} - ${shop.location}`;
      } else if (el) {
        el.textContent = 'Unknown Shop';
      }
    });
  }


  renderOrderDetail(order) {
    const items = order.OrderDetails.map(detail => {
      const item = detail.MenuItemSize.menu_item;
      return `
        <div class="item-card">
          <img src="${item.image_url}" alt="${item.name}" />
          <div>
            <h4>${item.name} (${detail.MenuItemSize.size})</h4>
            <p>${item.description}</p>
            <p><strong>Qty:</strong> ${detail.quantity}</p>
            <p><strong>Subtotal:</strong> $${detail.subtotal}</p>
          </div>
        </div>
      `;
    }).join('');

    const total = order.OrderDetails.reduce((sum, d) => sum + parseFloat(d.subtotal), 0).toFixed(2);

    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <div class="history-container">
        <button class="back-btn">← Back to History</button>
        <h2>Order #${order.public_order_id}</h2>
        <p>Status: ${order.order_status}</p>
        <p>Pickup Time: ${new Date(order.pickup_time).toLocaleString()}</p>
        <div class="item-list">${items}</div>
        <div class="total-price"><strong>Total:</strong> $${total}</div>
      </div>
    `;

    this.shadowRoot.querySelector('.back-btn').addEventListener('click', () => this.fetchOrderHistory());
  }

  styles() {
    return `
      :host {
        --bg-color-light: #f8f4ef;
        --bg-color-dark: #2c2c2c;
        --text-color-light: #444;
        --text-color-dark: #ddd;
        --secondary-text-light: #777;
        --secondary-text-dark: #aaa;
        --highlight-color: #6f4e37;
        --button-bg-light: #6f4e37;
        --button-bg-dark: #a67c52;
        --button-text-light: #fff;
        --button-text-dark: #333;
        --card-bg-light: #fff;
        --card-bg-dark: #3a3a3a;
        --shadow-light: rgba(0, 0, 0, 0.08);
        --shadow-dark: rgba(0, 0, 0, 0.5);
      }

      .history-container {
        padding: 20px;
        font-family: 'Poppins', sans-serif;
        background-color: ${this.currentTheme === 'dark' ? 'var(--bg-color-dark)' : 'var(--bg-color-light)'};
        color: ${this.currentTheme === 'dark' ? 'var(--text-color-dark)' : 'var(--text-color-light)'};
        min-height: 300px;
      }

      .order-card {
        display: flex;
        background: ${this.currentTheme === 'dark' ? 'var(--card-bg-dark)' : 'var(--bg-color-light)'};
        border-radius: 12px;
        box-shadow: 0 2px 6px ${this.currentTheme === 'dark' ? 'var(--shadow-dark)' : 'var(--shadow-light)'};
        padding: 16px;
        margin-bottom: 16px;
        align-items: center;
        gap: 16px;
      }

      .left {
        font-size: 28px;
      }

      .middle {
        flex: 1;
      }

     .shop-name {
        font-weight: bold;
        font-size: 16px;
        color: var(--shop-name-color);
      }

      .order-id {
        font-size: 13px;
        color: ${this.currentTheme === 'dark' ? 'var(--secondary-text-dark)' : 'var(--secondary-text-light)'};
        margin-top: 4px;
      }

      .items-summary {
        font-size: 13px;
        color: ${this.currentTheme === 'dark' ? 'var(--secondary-text-dark)' : 'var(--secondary-text-light)'};
        margin-top: 2px;
      }

      .right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
      }

      .pickup-time {
        font-size: 14px;
      }

     .status {
        font-size: 14px;
        font-weight: bold;
        color: var(--status-color);
      }

      .view-btn {
        background-color: ${this.currentTheme === 'dark' ? 'var(--button-bg-dark)' : 'var(--button-bg-light)'};
        color: ${this.currentTheme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)'};
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .view-btn:hover {
        background-color: ${this.currentTheme === 'dark' ? '#b39268' : '#a67c52'};
      }

      .item-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 20px;
      }

      .item-card {
        display: flex;
        gap: 15px;
        background: ${this.currentTheme === 'dark' ? 'var(--card-bg-dark)' : 'var(--card-bg-light)'};
        border-radius: 10px;
        box-shadow: 0 2px 4px ${this.currentTheme === 'dark' ? 'var(--shadow-dark)' : 'var(--shadow-light)'};
        padding: 15px;
      }

      .item-card img {
        width: 160px;
        height: 120px;
        border-radius: 10px;
        object-fit: cover;
      }

      .item-card h4, .item-card p {
        color: ${this.currentTheme === 'dark' ? 'var(--text-color-dark)' : 'var(--text-color-light)'};
      }

      .total-price {
        margin-top: 20px;
        font-size: 16px;
        font-weight: bold;
        color: var(--total-price-color);
      }
      .back-btn {
        margin-bottom: 10px;
        background-color: ${this.currentTheme === 'dark' ? 'var(--button-bg-dark)' : 'var(--button-bg-light)'};
        color: ${this.currentTheme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)'};
        border: none;
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .back-btn:hover {
        background-color: ${this.currentTheme === 'dark' ? '#b39268' : '#a67c52'};
      }

      .error {
        color: red;
      }
    `;
  }
}

customElements.define('history-view', HistoryView);
