class ReOrderColumn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.latestOrder = null;
    this.currentTheme = 'light';
    this.isLoading = true;
    this.error = null;
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.cartService = null; 
    this.onThemeChange = this.onThemeChange.bind(this);
    this.render();
  }

  connectedCallback() {
    window.addEventListener('theme-changed', this.onThemeChange);
    this.currentTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
    
    import('../cart-service.js')
      .then(module => {
        this.cartService = module.cartService;
        this.fetchLatestOrder();
      })
      .catch(error => {
        console.error('Error importing cart service:', error);
        this.isLoading = false;
        this.error = 'Failed to initialize the component';
        this.render();
      });
  }

  disconnectedCallback() {
    window.removeEventListener('theme-changed', this.onThemeChange);
  }

  onThemeChange(e) {
    this.currentTheme = e.detail.theme || 'light';
    this.render();
  }

  async fetchLatestOrder() {
    if (!this.token || !this.user?.id) {
      this.isLoading = false;
      this.error = 'Please log in to see your previous orders';
      this.render();
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/users/${this.user.id}/orders`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': '*/*'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch order history');
      const orders = await res.json();
      
      if (orders.length === 0) {
        this.isLoading = false;
        this.render();
        return;
      }

      orders.sort((a, b) => {
        const dateA = new Date(a.created_at || a.pickup_time);
        const dateB = new Date(b.created_at || b.pickup_time);
        return dateB - dateA;
      });

      const latestOrder = orders[0];
      const detailRes = await fetch(`http://localhost:3000/orders/${latestOrder.id}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': '*/*'
        }
      });
      
      if (!detailRes.ok) throw new Error('Failed to fetch order details');
      this.latestOrder = await detailRes.json();
      
      this.isLoading = false;
      this.render();
    } catch (error) {
      console.error('Error fetching latest order:', error);
      this.isLoading = false;
      this.error = 'Failed to load your latest order';
      this.render();
    }
  }

  addAllToCart() {
    if (!this.latestOrder || !this.latestOrder.OrderDetails || this.latestOrder.OrderDetails.length === 0 || !this.cartService) {
      console.error('Cannot add to cart: Either no order details or cart service not available');
      return;
    }
    
    try {
      console.log(this.latestOrder);
      const shopId = parseInt(this.latestOrder.shop_id);
      this.latestOrder.OrderDetails.forEach(detail => {
        const menuItem = detail.MenuItemSize.menu_item;
        const price = detail.subtotal / detail.quantity;
        const cartItem = {
          id: detail.MenuItemSize.id,
          name: menuItem.name,
          size: detail.MenuItemSize.size,
          price: price,
          quantity: detail.quantity,
          image: menuItem.image_url,
          shop_id: shopId,
          menu_size_id: detail.menu_size_id          
        };

        this.cartService.addItem(cartItem);
      });
      
      this.showAddedToCartFeedback();
      
      const itemCount = this.latestOrder.OrderDetails.reduce((total, detail) => total + detail.quantity, 0);
      this.showFeedbackMessage(`Added ${itemCount} item${itemCount > 1 ? 's' : ''} to your cart!`);
    } catch (error) {
      console.error('Error adding items to cart:', error);
      this.showFeedbackMessage('Failed to add items to cart', true);
    }
  }
  
  showAddedToCartFeedback() {
    const orderElement = this.shadowRoot.querySelector('.latest-order');
    if (!orderElement) return;
    
    orderElement.classList.add('added');
    
    setTimeout(() => {
      orderElement.classList.remove('added');
    }, 1500);
  }
  
  showFeedbackMessage(message, isError = false) {
    let feedback = this.shadowRoot.querySelector('.feedback-message');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'feedback-message';
      this.shadowRoot.querySelector('.reorder-column').appendChild(feedback);
    }
    
    feedback.textContent = message;
    feedback.className = `feedback-message ${isError ? 'error' : 'success'}`;
    feedback.style.display = 'block';
    
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => {
        feedback.style.display = 'none';
        feedback.style.opacity = '1';
      }, 500);
    }, 3000);
  }

  renderLoading() {
    return `<div class="loading">Loading your latest order...</div>`;
  }

  renderError() {
    return `<div class="error">${this.error}</div>`;
  }

  renderLatestOrder() {
    if (!this.latestOrder || !this.latestOrder.OrderDetails || this.latestOrder.OrderDetails.length === 0) {
      return `<div class="empty-state">No order history found.<br>Order some delicious drinks first!</div>`;
    }

    const orderDate = new Date(this.latestOrder.created_at || this.latestOrder.pickup_time);
    const formattedDate = orderDate.toLocaleDateString();
    const formattedTime = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const itemsList = this.latestOrder.OrderDetails.map(detail => {
      const menuItem = detail.MenuItemSize.menu_item;
      const size = detail.MenuItemSize.size;
      const price = detail.subtotal / detail.quantity;
      
      return `
        <div class="order-item">
          <div class="item-image">
            <img src="${menuItem.image_url}" alt="${menuItem.name}" onerror="this.src='/img/default-coffee.jpg'">
          </div>
          <div class="item-details">
            <h3>${menuItem.name}</h3>
            <p class="size">${size}</p>
            <div class="item-meta">
              <span class="quantity">Qty: ${detail.quantity}</span>
              <span class="price">$${price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const totalItems = this.latestOrder.OrderDetails.reduce((total, detail) => total + detail.quantity, 0);

    return `
      <div class="latest-order">
        <div class="order-header">
          <div class="order-date">
            <div class="date">${formattedDate}</div>
            <div class="time">${formattedTime}</div>
          </div>
          <div class="items-count">${totalItems} item${totalItems > 1 ? 's' : ''}</div>
        </div>
        
        <div class="order-items">
          ${itemsList}
        </div>
        
        <button class="add-all-to-cart-btn">
          Add to Cart
        </button>
      </div>
    `;
  }

  render() {
    const content = this.isLoading 
      ? this.renderLoading() 
      : this.error 
        ? this.renderError() 
        : this.renderLatestOrder();

    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }
        
        :host {
          display: block;
          height: 100%;
        }
        
        .reorder-column {
          padding: 20px;
          background-color: ${this.currentTheme === 'dark' ? '#332b24' : '#f9f5f0'};
          color: ${this.currentTheme === 'dark' ? '#e0d6cc' : '#4a3520'};
          border-right: 1px solid ${this.currentTheme === 'dark' ? '#483c32' : '#e9e1d9'};
          height: 100%;
          overflow-y: hidden;  /* Changed from auto to hidden to remove scrollbar */
          transition: all 0.3s ease;
          position: relative;
        }
        
        h2 {
          margin-bottom: 20px;
          font-size: 1.5rem;
          color: ${this.currentTheme === 'dark' ? '#e0d6cc' : '#6f4e37'};
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 2px solid ${this.currentTheme === 'dark' ? '#483c32' : '#e9e1d9'};
        }
        
        .latest-order {
          background: ${this.currentTheme === 'dark' ? '#3a332c' : '#ffffff'};
          border-radius: 12px;
          margin-bottom: 15px;
          padding: 16px;  
          box-shadow: 0 2px 8px ${this.currentTheme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(111,78,55,0.1)'};
          transition: all 0.3s ease;
        }
        
        .latest-order:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px ${this.currentTheme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(111,78,55,0.15)'};
        }
        
        .latest-order.added {
          background-color: ${this.currentTheme === 'dark' ? '#44382e' : '#f0e8e0'};
          animation: pulse 1.5s ease;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          20% { transform: scale(1.05); }
          40% { transform: scale(1); }
          60% { transform: scale(1.03); }
          80% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px solid ${this.currentTheme === 'dark' ? '#483c32' : '#e9e1d9'};
        }
        
        .order-date {
          color: ${this.currentTheme === 'dark' ? '#e0d6cc' : '#6f4e37'};
        }
        
        .date {
          font-weight: bold;
          font-size: 1rem;
        }
        
        .time {
          font-size: 0.8rem;
          color: ${this.currentTheme === 'dark' ? '#b0a69a' : '#8b5a2b'};
        }
        
        .items-count {
          background-color: ${this.currentTheme === 'dark' ? '#483c32' : '#e9e1d9'};
          color: ${this.currentTheme === 'dark' ? '#e0d6cc' : '#6f4e37'};
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .order-items {
          margin-bottom: 16px;
          /* Removed max-height and overflow for items container */
        }
        
        .order-item {
          display: flex;
          padding: 8px 0;
          border-bottom: 1px solid ${this.currentTheme === 'dark' ? '#483c32' : '#e9e1d9'};
        }
        
        .order-item:last-child {
          border-bottom: none;
        }
        
        .item-image {
          width: 60px;
          height: 60px;
          min-width: 60px;
          border-radius: 8px;
          overflow: hidden;
          margin-right: 12px;
        }
        
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .item-details {
          flex: 1;
        }
        
        .item-details h3 {
          font-size: 0.95rem;
          margin-bottom: 4px;
          color: ${this.currentTheme === 'dark' ? '#e0d6cc' : '#6f4e37'};
        }
        
        .size {
          font-size: 0.8rem;
          color: ${this.currentTheme === 'dark' ? '#b0a69a' : '#8b5a2b'};
          margin-bottom: 4px;
        }
        
        .item-meta {
          display: flex;
          justify-content: space-between;
        }
        
        .quantity {
          font-size: 0.8rem;
          font-weight: bold;
          color: ${this.currentTheme === 'dark' ? '#e0d6cc' : '#6f4e37'};
        }
        
        .price {
          font-size: 0.8rem;
          font-weight: bold;
          color: ${this.currentTheme === 'dark' ? '#e0d6cc' : '#6f4e37'};
        }
        
        .add-all-to-cart-btn {
          width: 100%;
          padding: 12px;
          background-color: ${this.currentTheme === 'dark' ? '#8b5a2b' : '#6f4e37'};
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-weight: bold;
          font-size: 1rem;
        }
        
        .add-all-to-cart-btn:hover {
          background-color: ${this.currentTheme === 'dark' ? '#a67c52' : '#8b5a2b'};
        }
        
        .loading, .error, .empty-state {
          padding: 15px;
          text-align: center;
          color: ${this.currentTheme === 'dark' ? '#b0a69a' : '#8b5a2b'};
          font-style: italic;
        }
        
        .error {
          color: #e74c3c;
        }
        
        .feedback-message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          transition: opacity 0.5s ease;
        }
        
        .feedback-message.success {
          background-color: #4CAF50;
          color: white;
        }
        
        .feedback-message.error {
          background-color: #e74c3c;
          color: white;
        }
        
        @media (max-width: 768px) {
          .reorder-column {
            padding: 15px 10px;
          }
          
          h2 {
            font-size: 1.2rem;
            margin-bottom: 15px;
          }
          
          .latest-order {
            padding: 12px;
          }
          
          .item-image {
            width: 50px;
            height: 50px;
            min-width: 50px;
          }
        }
      </style>
      
      <div class="reorder-column">
        <h2>Re-Order Latest</h2>
        ${content}
      </div>
    `;
    
    if (!this.isLoading && !this.error && this.latestOrder) {
      const addAllButton = this.shadowRoot.querySelector('.add-all-to-cart-btn');
      if (addAllButton) {
        addAllButton.addEventListener('click', () => this.addAllToCart());
      }
    }
  }
}

customElements.define('reorder-column', ReOrderColumn);