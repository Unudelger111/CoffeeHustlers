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
          position: relative;
          z-index: 1000;
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

        /* Desktop Navigation */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
        }

        .search-container {
          display: flex;
          flex: 1;
          max-width: 400px;
          gap: 10px;
          align-items: center;
          margin-left: 20px;
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
          transition: var(--transition);
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

        /* Mobile Navigation */
        .mobile-nav {
          display: none;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 30px;
          height: 30px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
        }

        .hamburger span {
          width: 100%;
          height: 3px;
          background-color: var(--header-text);
          border-radius: 2px;
          transition: var(--transition);
          transform-origin: center;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: var(--header-bg);
          z-index: 999;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          overflow-y: auto;
          padding-top: 80px;
        }

        .mobile-menu.active {
          transform: translateX(0);
        }

        .mobile-menu-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mobile-search {
          margin-bottom: 20px;
        }

        .mobile-search .search-wrapper {
          position: relative;
          margin-bottom: 10px;
        }

        .mobile-search .search-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 25px;
          border: 2px solid var(--header-shadow);
          background-color: var(--header-bg);
          color: var(--header-text);
          font-size: 16px;
        }

        .mobile-search .search-button {
          width: 100%;
          padding: 12px;
          border-radius: 25px;
          font-size: 16px;
          height: auto;
        }

        .mobile-menu-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          background-color: var(--header-button-bg);
          color: var(--header-button-text);
          border-radius: 15px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          gap: 12px;
          cursor: pointer;
          border: none;
          width: 100%;
          justify-content: flex-start;
          transition: var(--transition);
        }

        .mobile-menu-item:hover {
          background-color: var(--header-button-hover);
          transform: translateX(5px);
        }

        .mobile-menu-item i {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .mobile-menu-item.cart-item {
          position: relative;
        }

        .mobile-menu-item .mobile-cart-count {
          background-color: #6F4E37;
          color: #fff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          margin-left: auto;
        }

        /* User section in mobile menu */
        .mobile-user-section {
          border-top: 1px solid var(--header-shadow);
          padding-top: 20px;
          margin-top: 20px;
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 20px;
          background-color: #f9f5f1;
          border-radius: 15px;
          margin-bottom: 15px;
        }

        :host([theme="dark"]) .mobile-user-info {
          background-color: #3a322c;
        }

        .mobile-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #6f4e37;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
          flex-shrink: 0;
        }

        .mobile-user-details {
          flex: 1;
        }

        .mobile-user-name {
          font-weight: 600;
          color: var(--header-title);
          font-size: 16px;
          margin-bottom: 2px;
        }

        .mobile-user-email {
          font-size: 14px;
          color: var(--header-text);
          opacity: 0.8;
        }

        .mobile-logout {
          background-color: #e74c3c;
          color: white;
        }

        .mobile-logout:hover {
          background-color: #c0392b;
        }

        /* User Account Styling for Desktop */
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

        /* Responsive breakpoints */
        @media (max-width: 1024px) {
          .search-container {
            max-width: 300px;
          }
        }

        @media (max-width: 768px) {
          header {
            padding: 12px 16px;
          }

          .desktop-nav {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .mobile-nav {
            display: block;
          }

          header h1 {
            font-size: 18px;
          }

          .logo {
            height: 40px;
            margin-right: 8px;
          }
        }

        @media (max-width: 480px) {
          header {
            padding: 10px 12px;
          }

          header h1 {
            font-size: 16px;
          }

          .logo {
            height: 35px;
            margin-right: 6px;
          }

          .hamburger {
            width: 28px;
            height: 28px;
          }

          .hamburger span {
            height: 2.5px;
          }
        }

        /* Overlay for mobile menu */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 998;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-overlay.active {
          opacity: 1;
          visibility: visible;
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

        <!-- Desktop Navigation -->
        <div class="desktop-nav">
          <div class="search-container">
            <div class="search-wrapper">
              <input type="text" id="search-input" class="search-input" placeholder="Search drinks..." />
              <button id="clear-btn" class="clear-button" title="Clear">×</button>
            </div>
            <button id="search-btn" class="search-button">
              <img src="/images/search-icon.png" alt="Search" class="search-icon" />
            </button>
          </div>

          <div class="header-buttons">
            <button id="history-btn"><i class="fas fa-history"></i> History</button>
            <button id="cart-btn"><i class="fas fa-shopping-cart"></i> Cart <span id="cart-count">0</span></button>
            
            <div class="user-container">
              <button id="account-btn"><i class="fas fa-user"></i> Account</button>
              <div id="user-dropdown" class="user-dropdown">
                <div class="dropdown-header">
                  <div class="user-full-name"></div>
                  <div class="user-email"></div>
                </div>
                <div class="dropdown-menu">
                  <div class="dropdown-item logout" id="logout-btn">
                    <span class="icon">⤴</span>
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="mobile-nav">
          <button class="hamburger" id="hamburger-btn">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <!-- Mobile Menu Overlay -->
      <div class="mobile-overlay" id="mobile-overlay"></div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" id="mobile-menu">
        <div class="mobile-menu-content">
          <!-- Mobile Search -->
          <div class="mobile-search">
            <div class="search-wrapper">
              <input type="text" id="mobile-search-input" class="search-input" placeholder="Search drinks..." />
              <button id="mobile-clear-btn" class="clear-button" title="Clear">×</button>
            </div>
            <button id="mobile-search-btn" class="search-button">
              <i class="fas fa-search"></i> Search
            </button>
          </div>

          <!-- Mobile Menu Items -->
          <div class="mobile-menu-items">
            <button id="mobile-history-btn" class="mobile-menu-item">
              <i class="fas fa-history"></i>
              <span>Order History</span>
            </button>
            
            <button id="mobile-cart-btn" class="mobile-menu-item cart-item">
              <i class="fas fa-shopping-cart"></i>
              <span>Shopping Cart</span>
              <span id="mobile-cart-count" class="mobile-cart-count">0</span>
            </button>
          </div>

          <!-- Mobile User Section -->
          <div class="mobile-user-section" id="mobile-user-section">
            <!-- Will be populated based on login status -->
          </div>
        </div>
      </div>
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

    this.updateMobileUserSection();
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

  updateMobileUserSection() {
    const mobileUserSection = this.shadowRoot.getElementById('mobile-user-section');
    
    if (this.username) {
      mobileUserSection.innerHTML = `
        <div class="mobile-user-info">
          <div class="mobile-user-avatar">${this.getInitials(this.username)}</div>
          <div class="mobile-user-details">
            <div class="mobile-user-name">${this.username}</div>
            ${this.hasAttribute('user-email') ? `<div class="mobile-user-email">${this.getAttribute('user-email')}</div>` : ''}
          </div>
        </div>
        <button id="mobile-logout-btn" class="mobile-menu-item mobile-logout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      `;
    } else {
      mobileUserSection.innerHTML = `
        <button id="mobile-login-btn" class="mobile-menu-item">
          <i class="fas fa-user"></i>
          <span>Login / Sign Up</span>
        </button>
      `;
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
    const mobileCartCountEl = this.shadowRoot.getElementById('mobile-cart-count');
    
    if (cartCountEl) {
      cartCountEl.textContent = this.cartCount || '0';
    }
    if (mobileCartCountEl) {
      mobileCartCountEl.textContent = this.cartCount || '0';
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

  closeMobileMenu() {
    const hamburger = this.shadowRoot.getElementById('hamburger-btn');
    const mobileMenu = this.shadowRoot.getElementById('mobile-menu');
    const mobileOverlay = this.shadowRoot.getElementById('mobile-overlay');
    
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
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
        this.handleLogout();
      });
    }

    const hamburgerBtn = this.shadowRoot.getElementById('hamburger-btn');
    const mobileMenu = this.shadowRoot.getElementById('mobile-menu');
    const mobileOverlay = this.shadowRoot.getElementById('mobile-overlay');
    const mobileCartBtn = this.shadowRoot.getElementById('mobile-cart-btn');
    const mobileHistoryBtn = this.shadowRoot.getElementById('mobile-history-btn');

    hamburgerBtn.addEventListener('click', () => {
      const isActive = hamburgerBtn.classList.contains('active');
      
      if (isActive) {
        this.closeMobileMenu();
      } else {
        hamburgerBtn.classList.add('active');
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileOverlay.addEventListener('click', () => {
      this.closeMobileMenu();
    });

    mobileCartBtn.addEventListener('click', () => {
      this.closeMobileMenu();
      this.navigateTo('/cart');
    });

    mobileHistoryBtn.addEventListener('click', () => {
      this.closeMobileMenu();
      this.navigateTo('/order-history');
    });

    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.id === 'mobile-login-btn') {
        this.closeMobileMenu();
        this.navigateTo('/login');
      } else if (e.target.id === 'mobile-logout-btn' || e.target.closest('#mobile-logout-btn')) {
        this.closeMobileMenu();
        this.handleLogout();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });

    document.addEventListener('click', (e) => {
      const userContainer = this.shadowRoot.querySelector('.user-container');
      
      if (userDropdown && 
          userDropdown.classList.contains('visible') && 
          !userContainer.contains(e.target) && 
          !this.shadowRoot.contains(e.target)) {
        userDropdown.classList.remove('visible');
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

    const mobileSearchInput = this.shadowRoot.getElementById('mobile-search-input');
    const mobileSearchBtn = this.shadowRoot.getElementById('mobile-search-btn');
    const mobileClearBtn = this.shadowRoot.getElementById('mobile-clear-btn');

    const updateMobileClearVisibility = () => {
      mobileClearBtn.style.display = mobileSearchInput.value ? 'block' : 'none';
    };

    mobileSearchBtn.addEventListener('click', () => {
      const query = mobileSearchInput.value.trim();
      if (query) {
        this.closeMobileMenu();
        this.navigateTo(`/search?q=${encodeURIComponent(query)}`);
      }
    });

    mobileSearchInput.addEventListener('input', updateMobileClearVisibility);

    mobileSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = mobileSearchInput.value.trim();
        if (query) {
          this.closeMobileMenu();
          this.navigateTo(`/search?q=${encodeURIComponent(query)}`);
        }
      }
    });

    mobileClearBtn.addEventListener('click', () => {
      mobileSearchInput.value = '';
      updateMobileClearVisibility();
      mobileSearchInput.focus();
    });

    updateMobileClearVisibility();

    window.addEventListener('user-logged-in', (e) => {
      if (e.detail && e.detail.user) {
        this.username = e.detail.user.name;
        if (e.detail.user.email) {
          this.setAttribute('user-email', e.detail.user.email);
        }
        this.updateMobileUserSection();
      }
    });
  }

  handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    const userDropdown = this.shadowRoot.getElementById('user-dropdown');
    if (userDropdown && userDropdown.classList.contains('visible')) {
      userDropdown.classList.remove('visible');
    }
    
    this.removeAttribute('username');
    this.removeAttribute('user-email');
    this.updateMobileUserSection();

    const logoutEvent = new CustomEvent('user-logged-out', {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(logoutEvent);

    this.navigateTo('/');
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

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    });
  }

  disconnectedCallback() {
    window.removeEventListener('cart-updated', this.updateCartCountFromStorage);
    window.removeEventListener('user-logged-in', this.updateUserInterface);
    window.removeEventListener('storage', this.updateUserFromStorage);
    document.removeEventListener('keydown', this.closeMobileMenu);
  }
}

customElements.define('nav-bar', Header);