class ReOrderColumn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.frequentItems = [];
    this.currentTheme = 'light';
    this.isLoading = true;
    this.error = null;
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.onThemeChange = this.onThemeChange.bind(this);
    this.render();
  }

  connectedCallback() {
    // Listen for theme changes
    window.addEventListener('theme-changed', this.onThemeChange);
    this.currentTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
    
    this.fetchFrequentOrders();
  }

  disconnectedCallback() {
    window.removeEventListener('theme-changed', this.onThemeChange);
  }

  onThemeChange(e) {
    this.currentTheme = e.detail.theme || 'light';
    this.render();
  }

  async fetchFrequentOrders() {
    if (!this.token || !this.user?.id) {
      this.isLoading = false;
      this.error = 'Please log in to see your frequent orders';
      this.render();
      return;
    }

    try {
      // Fetch all orders
      const res = await fetch(`http://localhost:3000/users/${this.user.id}/orders`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': '*/*'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch order history');
      const orders = await res.json();

      // Get details for each order
      const ordersWithDetails = await Promise.all(orders.map(async order => {
        const detailRes = await fetch(`http://localhost:3000/orders/${order.id}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': '*/*'
          }
        });
        if (!detailRes.ok) throw new Error('Failed to fetch order details');
        return await detailRes.json();
      }));

      // Calculate frequency of each item
      const itemFrequency = {};
      
      ordersWithDetails.forEach(order => {
        order.OrderDetails?.forEach(detail => {
          const menuItem = detail.MenuItemSize.menu_item;
          const size = detail.MenuItemSize.size;
          const menuItemSizeId = detail.MenuItemSize.id;
          const key = `${menuItem.id}-${size}`;
          
          if (!itemFrequency[key]) {
            itemFrequency[key] = {
              count: 0,
              name: menuItem.name,
              size: size,
              price: detail.subtotal / detail.quantity,
              imageUrl: menuItem.image_url,
              menuItemSizeId: menuItemSizeId,
              lastOrdered: new Date(order.created_at || order.pickup_time)
            };
          }
          
          itemFrequency[key].count += detail.quantity;
          
          // Update last ordered date if this order is newer
          const orderDate = new Date(order.created_at || order.pickup_time);
          if (orderDate > itemFrequency[key].lastOrdered) {
            itemFrequency[key].lastOrdered = orderDate;
          }
        });
      });
      
      // Convert to array and sort by frequency
      this.frequentItems = Object.values(itemFrequency)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 most frequent items
      
      this.isLoading = false;
      this.render();
    } catch (error) {
      console.error('Error fetching frequent orders:', error);
      this.isLoading = false;
      this.error = 'Failed to load your frequent orders';
      this.render();
    }
  }

  addToCart(item) {
    // Create a custom event for adding to cart
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      composed: true,
      detail: {
        menuItemSizeId: item.menuItemSizeId,
        name: item.name,
        size: item.size,
        price: item.price,
        quantity: 1
      }
    });
    
    this.dispatchEvent(event);
    
    // Provide visual feedback
    this.showAddedToCartFeedback(item);
  }
  
  showAddedToCartFeedback(item) {
    const itemElement = this.shadowRoot.querySelector(`.frequent-item[data-id="${item.menuItemSizeId}"]`);
    if (!itemElement) return;
    
    // Add a temporary "added" class for animation
    itemElement.classList.add('added');
    
    // Remove it after animation completes
    setTimeout(() => {
      itemElement.classList.remove('added');
    }, 1500);
  }

  renderLoading() {
    return `<div class="loading">Loading your frequent orders...</div>`;
  }

  renderError() {
    return `<div class="error">${this.error}</div>`;
  }

  renderItems() {
    if (this.frequentItems.length === 0) {
      return `<div class="empty-state">No order history found.<br>Order some delicious drinks first!</div>`;
    }

    return this.frequentItems.map(item => `
      <div class="frequent-item" data-id="${item.menuItemSizeId}">
        <div class="item-image">
          <img src="${item.imageUrl}" alt="${item.name}">
          <div class="frequency">
            ${this.renderFrequencyStars(item.count)}
          </div>
        </div>
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="size">${item.size}</p>
          <p class="price">$${item.price.toFixed(2)}</p>
        </div>
        <button class="add-to-cart-btn" data-id="${item.menuItemSizeId}">
          Add to Cart
        </button>
      </div>
    `).join('');
  }
  
  renderFrequencyStars(count) {
    // Convert count to a star rating (1-5)
    const maxCount = Math.max(...this.frequentItems.map(item => item.count));
    const normalizedCount = Math.max(1, Math.min(5, Math.ceil((count / maxCount) * 5)));
    
    return '★'.repeat(normalizedCount) + '☆'.repeat(5 - normalizedCount);
  }

  render() {
    const content = this.isLoading 
      ? this.renderLoading() 
      : this.error 
        ? this.renderError() 
        : this.renderItems();

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
          overflow-y: auto;
          transition: all 0.3s ease;
        }
        
        h2 {
          margin-bottom: 20px;
          font-size: 1.5rem;
          color: ${this.currentTheme === 'dark' ? '#e0d6cc' : '#6f4e37'};
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 2px solid ${this.currentTheme === 'dark' ? '#483c32' : '#e9e1d9'};
        }
        
        .frequent-item {
          background: ${this.currentTheme === 'dark' ? '#3a332c' : '#ffffff'};
          border-radius: 12px;
          margin-bottom: 15px;
          padding: 12px;
          box-shadow: 0 2px 8px ${this.currentTheme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(111,78,55,0.1)'};
          transition: all 0.3s ease;
          position: relative;
        }
        
        .frequent-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px ${this.currentTheme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(111,78,55,0.15)'};
        }
        
        .frequent-item.added {
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
        
        .item-image {
          width: 100%;
          position: relative;
          margin-bottom: 10px;
        }
        
        .item-image img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .frequency {
          position: absolute;
          bottom: -5px;
          right: 5px;
          background: ${this.currentTheme === 'dark' ? '#332b24' : '#fff'};
          color: #e6a14c;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          box-shadow: 0 2px 4px ${this.currentTheme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'};
        }
        
        .item-details {
          margin-bottom: 10px;
        }
        
        .item-details h3 {
          font-size: 1rem;
          margin-bottom: 4px;
          color: ${this.currentTheme === 'dark' ? '#e0d6cc' : '#6f4e37'};
        }
        
        .size {
          font-size: 0.8rem;
          color: ${this.currentTheme === 'dark' ? '#b0a69a' : '#8b5a2b'};
          margin-bottom: 2px;
        }
        
        .price {
          font-weight: bold;
          color: ${this.currentTheme === 'dark' ? '#e0d6cc' : '#6f4e37'};
        }
        
        .add-to-cart-btn {
          width: 100%;
          padding: 8px;
          background-color: ${this.currentTheme === 'dark' ? '#8b5a2b' : '#6f4e37'};
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-weight: bold;
        }
        
        .add-to-cart-btn:hover {
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
        
        @media (max-width: 768px) {
          .reorder-column {
            padding: 15px 10px;
          }
          
          h2 {
            font-size: 1.2rem;
            margin-bottom: 15px;
          }
          
          .frequent-item {
            padding: 10px;
          }
          
          .item-image img {
            height: 80px;
          }
        }
      </style>
      
      <div class="reorder-column">
        <h2>Re-Order</h2>
        ${content}
      </div>
    `;

    // Add event listeners for add-to-cart buttons
    if (!this.isLoading && !this.error) {
      const buttons = this.shadowRoot.querySelectorAll('.add-to-cart-btn');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const itemId = button.dataset.id;
          const item = this.frequentItems.find(i => i.menuItemSizeId === itemId);
          if (item) this.addToCart(item);
        });
      });
    }
  }
}

customElements.define('reorder-column', ReOrderColumn);