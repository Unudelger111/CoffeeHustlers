export default class Header extends HTMLElement {
  static get observedAttributes() {
    return ['username', 'cart-count', 'user-avatar', 'theme'];
  }
  get username() {
    return this.getAttribute('username');
  }
  
  set username(value) {
    if (value) {
      this.setAttribute('username', value);
    } else {
      this.removeAttribute('username');
    }
  }
  
  get cartCount() {
    return this.getAttribute('cart-count');
  }
  
  set cartCount(value) {
    this.setAttribute('cart-count', value);
  }
  
  get userAvatar() {
    return this.getAttribute('user-avatar');
  }
  
  set userAvatar(value) {
    if (value) {
      this.setAttribute('user-avatar', value);
    } else {
      this.removeAttribute('user-avatar');
    }
  }
  
  get theme() {
    return this.getAttribute('theme');
  }
  
  set theme(value) {
    if (value) {
      this.setAttribute('theme', value);
    } else {
      this.removeAttribute('theme');
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.user = null;
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'username':
        this.updateUserDisplay();
        break;
      case 'cart-count':
        this.updateCartCountDisplay();
        break;
      case 'user-avatar':
        this.updateUserAvatar();
        break;
      case 'theme':
        this.updateTheme();
        break;
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

        :host {
          --header-bg: var(--card-bg, #fff);
          --header-text: var(--text-color, #3c2f24);
          --header-title: var(--heading-color, #5e4a3a);
          --header-shadow: var(--shadow-color, rgba(109, 82, 60, 0.15));
          --header-button-bg: var(--button-bg, #8b6e4e);
          --header-button-text: var(--button-text, #fff);
          --header-button-hover: var(--secondary-color, #a67c52);
          --header-cart-badge: #ff6b6b;
          --transition: var(--transition, all 0.3s ease);
        }

        /* Light/Dark theme support */
        :host([theme="dark"]) {
          --header-bg: #2d2520;
          --header-text: #f5f0eb;
          --header-title: #e0d5ca;
          --header-shadow: rgba(0, 0, 0, 0.3);
        }

        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          background-color: var(--header-bg);
          box-shadow: 0 2px 5px var(--header-shadow);
          gap: 20px;
          flex-wrap: wrap;
        }

        .logo-container {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: var(--header-title);
          flex-shrink: 0;
        }

        .logo {
          height: 50px;
          margin-right: 10px;
          transition: var(--transition);
        }

        header h1 {
          color: var(--header-title);
          font-size: 20px;
        }

        .search-container {
          display: flex;
          flex: 1;
          max-width: 400px;
          gap: 10px;
          align-items: center;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 20px;
          border: 1px solid var(--header-shadow);
          background-color: var(--header-bg);
          color: var(--header-text);
          font-size: 14px;
        }

        .search-input::placeholder {
          color: #aaa;
        }

        .clear-button {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          font-size: 16px;
          color: var(--header-text);
          cursor: pointer;
          display: none;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          padding: 0;
        }

        .clear-button:hover {
          color: var(--header-button-hover);
        }

        .search-input:not(:placeholder-shown) + .clear-button {
          display: block;
        }

        .search-button {
          padding: 8px 14px;
          border-radius: 20px;
          border: none;
          background-color: var(--header-button-bg);
          color: var(--header-button-text);
          cursor: pointer;
        }

        .search-button:hover {
          background-color: var(--header-button-hover);
        }

        .search-button img.search-icon {
          width: 16px;
          height: 16px;
          filter: invert(0);
        }

        :host([theme="dark"]) .search-button img.search-icon {
          filter: invert(1);
        }

        .header-buttons {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
          align-items: center;
        }

        button {
          cursor: pointer;
          background-color: var(--header-button-bg);
          color: var(--header-button-text);
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        button i {
          font-size: 14px;
        }

        button.user-logged-in {
          padding: 4px 12px;
        }

        button:hover {
          background-color: var(--header-button-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px var(--header-shadow);
        }

        #cart-btn {
          position: relative;
        }

        #cart-count {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #6F4E37; 
        color: #fff;
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; 
        width: 24px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        box-shadow: inset 0 0 2px #3e2b23; 
        font-family: sans-serif;
      }

        /* User Account Styling */
        .user-container {
          position: relative;
        }

        .user-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: transparent;
          border: none;
        }

        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #6f4e37;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 12px;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 13px;
          max-width: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--header-button-text);
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 200px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transform: translateY(-10px);
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1500; 
        }

        :host([theme="dark"]) .user-dropdown {
          background-color: #2d2520;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .user-dropdown.visible {
          opacity: 1;
          transform: translateY(0);
          visibility: visible;
        }

        .dropdown-header {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f1f1;
          background-color: #f9f5f1;
        }

        :host([theme="dark"]) .dropdown-header {
          background-color: #3a322c;
          border-bottom: 1px solid #4a4038;
        }

        .dropdown-header .user-full-name {
          font-weight: 600;
          color: #6f4e37;
          font-size: 15px;
        }

        :host([theme="dark"]) .dropdown-header .user-full-name {
          color: #e0d5ca;
        }

        .dropdown-header .user-email {
          font-size: 13px;
          color: #8b5a2b;
          word-break: break-word;
        }

        :host([theme="dark"]) .dropdown-header .user-email {
          color: #c3b5a6;
        }

        .dropdown-menu {
          padding: 8px 0;
        }

        .dropdown-item {
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #3c2f24;
          font-size: 14px;
          cursor: pointer;
        }

        :host([theme="dark"]) .dropdown-item {
          color: #e0d5ca;
        }

        .dropdown-item:hover {
          background-color: #f9f5f1;
        }

        :host([theme="dark"]) .dropdown-item:hover {
          background-color: #4a4038;
        }

        .dropdown-item.logout {
          color: #e74c3c;
        }

        .dropdown-item .icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        @media (max-width: 768px) {
          header {
            flex-direction: column;
            align-items: stretch;
          }

          .search-container,
          .header-buttons {
            width: 100%;
            justify-content: space-between;
          }

          .header-buttons {
            flex-wrap: wrap;
          }

          .user-dropdown {
            right: 0;
            width: 100%;
            max-width: 300px;
          }
        }
          @media (max-width: 600px) {
    .user-btn {
      padding: 4px 8px;
      gap: 4px;
    }

    button.user-logged-in {
      padding: 4px 8px;
    }

    .user-avatar {
      width: 20px;
      height: 20px;
      font-size: 10px;
    }

    .user-name {
      font-size: 12px;
      max-width: 70px;
    }

    .user-dropdown {
      width: 100%;
      left: 0;
      right: 0;
      top: 100%;
      position: absolute;
      box-shadow: none;
      border-radius: 0;
      padding: 6px 12px;
      z-index: 1500;
    }
  }
    
      </style>
  `;

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet}
      <header>
        <a href="/menu" data-link class="logo-container">
          <img src="/images/coffee-logo.png" alt="CoffeeHustlers Logo" class="logo">
          <h1>CoffeeHustlers</h1>
        </a>

        <div class="header-buttons">
          <div class="search-container">
            <div class="search-wrapper">
              <input type="text" id="search-input" class="search-input" placeholder="Search drinks..." />
              <button id="clear-btn" class="clear-button" title="Clear">×</button>
            </div>
            <button id="search-btn" class="search-button">
              <img src="/images/search-icon.png" alt="Search" class="search-icon" />
            </button>
          </div>

          <button id="history-btn"><i class="fas fa-history"></i> History</button>
          <button id="cart-btn"><i class="fas fa-shopping-cart"></i> Cart <span id="cart-count">0</span></button>
          
          <div class="user-container">
            <button id="account-btn"><i class="fas fa-user"></i> Account</button>
            <div id="user-dropdown" class="user-dropdown">
              <div class="dropdown-header">
                <div class="user-full-name"></div>
                <div class="user-email"></div>
              </div>
              <div class="dropdown-item logout" id="logout-btn">
                <span class="icon">⤴</span>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    `;

    this.updateUserInterface();
  }

  updateUserInterface() {
    if (this.hasAttribute('username')) {
      this.updateUserDisplay();
      this.updateUserAvatar();
    } else {
      const user = this.getUserData();
      if (user) {
        this.username = user.name;
        if (user.email) {
          this.setAttribute('user-email', user.email);
        }
      }
    }
    
    if (this.hasAttribute('cart-count')) {
      this.updateCartCountDisplay();
    } else {
      this.updateCartCountFromStorage();
    }
  }
  
  updateUserDisplay() {
    const accountBtn = this.shadowRoot.getElementById('account-btn');
    const userFullName = this.shadowRoot.querySelector('.user-full-name');
    const userEmail = this.shadowRoot.querySelector('.user-email');
    
    if (this.username) {
      accountBtn.classList.add('user-logged-in');
      accountBtn.innerHTML = `
        <div class="user-avatar">${this.getInitials(this.username)}</div>
        <span class="user-name">${this.username.split(' ')[0]}</span>
      `;
      
      if (userFullName) userFullName.textContent = this.username;
      if (userEmail && this.hasAttribute('user-email')) {
        userEmail.textContent = this.getAttribute('user-email');
      }
    } else {

      accountBtn.classList.remove('user-logged-in');
      accountBtn.innerHTML = '<i class="fas fa-user"></i> Account';
      
      const userDropdown = this.shadowRoot.getElementById('user-dropdown');
      if (userDropdown && userDropdown.classList.contains('visible')) {
        userDropdown.classList.remove('visible');
      }
    }
  }
  
  updateUserAvatar() {
    const userAvatar = this.shadowRoot.querySelector('.user-avatar');
    if (!userAvatar) return;
    
    if (this.hasAttribute('user-avatar')) {
      userAvatar.innerHTML = `<img src="${this.getAttribute('user-avatar')}" alt="User avatar">`;
    } else if (this.username) {
      userAvatar.textContent = this.getInitials(this.username);
    }
  }
  
  updateCartCountDisplay() {
    const cartCountEl = this.shadowRoot.getElementById('cart-count');
    if (cartCountEl) {
      cartCountEl.textContent = this.cartCount || '0';
    }
  }
  
  updateCartCountFromStorage() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    this.cartCount = itemCount.toString();
  }
  
  updateTheme() {
  }

  getInitials(name) {
    if (!name) return '?';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  getUserData() {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
    
      if (userData && token) {
        return JSON.parse(userData);
      }
    } catch (e) {
      console.error('Failed to parse user data', e);
    }
    
    return null;
  }

  setupEventListeners() {
    const cartButton = this.shadowRoot.getElementById('cart-btn');
    const historyButton = this.shadowRoot.getElementById('history-btn');
    const accountButton = this.shadowRoot.getElementById('account-btn');
    const logoutButton = this.shadowRoot.getElementById('logout-btn');
    const userDropdown = this.shadowRoot.getElementById('user-dropdown');

    cartButton.addEventListener('click', () => this.navigateTo('/cart'));
    historyButton.addEventListener('click', () => this.navigateTo('/order-history'));
    
    accountButton.addEventListener('click', (e) => {
      if (this.username) {
        e.stopPropagation();
        userDropdown.classList.toggle('visible');
      } else {

        this.navigateTo('/login');
      }
    });
 
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        userDropdown.classList.remove('visible');
        
        this.removeAttribute('username');
        this.removeAttribute('user-email');

        const logoutEvent = new CustomEvent('user-logged-out', {
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(logoutEvent);

        this.navigateTo('/');
      });
    }

    document.addEventListener('click', (e) => {
      const userContainer = this.shadowRoot.querySelector('.user-container');
      
      if (userDropdown && 
          userDropdown.classList.contains('visible') && 
          !userContainer.contains(e.target) && 
          !this.shadowRoot.contains(e.target)) {
        userDropdown.classList.remove('visible');
      }
    });

    window.addEventListener('user-logged-in', (e) => {
      if (e.detail && e.detail.user) {
        this.username = e.detail.user.name;
        if (e.detail.user.email) {
          this.setAttribute('user-email', e.detail.user.email);
        }
      }
    });

    const searchInput = this.shadowRoot.getElementById('search-input');
    const searchBtn = this.shadowRoot.getElementById('search-btn');
    const clearBtn = this.shadowRoot.getElementById('clear-btn');

    const updateClearVisibility = () => {
      clearBtn.style.display = searchInput.value ? 'block' : 'none';
    };

    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        this.navigateTo(`/search?q=${encodeURIComponent(query)}`);
      }
    });

    searchInput.addEventListener('input', updateClearVisibility);

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          this.navigateTo(`/search?q=${encodeURIComponent(query)}`);
        }
      }
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      updateClearVisibility();
      searchInput.focus();
    });

    updateClearVisibility(); 
  }

  navigateTo(path) {
    const navigationEvent = new CustomEvent('navigate', {
      bubbles: true,
      composed: true,
      detail: { path }
    });
    this.dispatchEvent(navigationEvent);
  }

  connectedCallback() {
    this.updateUserInterface();
    
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') {
        this.updateCartCountFromStorage();
      }
    });
    
    window.addEventListener('cart-updated', () => {
      this.updateCartCountFromStorage();
    });
  }

  disconnectedCallback() {
    window.removeEventListener('cart-updated', this.updateCartCountFromStorage);
    window.removeEventListener('user-logged-in', this.updateUserInterface);
    window.removeEventListener('storage', this.updateUserFromStorage);
  }
}

customElements.define('nav-bar', Header);