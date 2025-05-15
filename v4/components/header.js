export default class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
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
        margin: 0;
        color: var(--header-title);
        transition: var(--transition);
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
  transition: color 0.2s ease;
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
        transition: var(--transition);
      }

      .search-button:hover {
        background-color: var(--header-button-hover);
      }

      .search-button img.search-icon {
        width: 16px;
        height: 16px;
        filter: invert(0);
        transition: filter 0.3s ease;
      }

      :host-context([data-theme="dark"]) .search-button img.search-icon {
        filter: invert(1);
      }

      .header-buttons {
        display: flex;
        gap: 10px;
        flex-shrink: 0;
      }

      button {
        cursor: pointer;
        background-color: var(--header-button-bg);
        color: var(--header-button-text);
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        transition: var(--transition);
        box-shadow: 0 2px 5px var(--header-shadow);
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
        background-color: var(--header-cart-badge);
        color: #fff;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: var(--transition);
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

        .search-input {
          width: 100%;
        }

        .header-buttons {
          flex-wrap: wrap;
        }
      }
    </style>

    <header>
      <a href="/" data-link class="logo-container">
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

        <button id="reorder-btn"><i class="fa fa-redo"></i> Re-order</button>
        <button id="history-btn"><i class="fas fa-history"></i> History</button>
        <button id="cart-btn"><i class="fas fa-shopping-cart"></i> Cart <span id="cart-count">0</span></button>
        <button id="account-btn"><i class="fas fa-user"></i> Account</button>
      </div>
    </header>
    `;
  }

  setupEventListeners() {
    const reorderButton = this.shadowRoot.getElementById('reorder-btn');
    const cartButton = this.shadowRoot.getElementById('cart-btn');
    const historyButton = this.shadowRoot.getElementById('history-btn');
    const accountButton = this.shadowRoot.getElementById('account-btn');

    cartButton.addEventListener('click', () => this.navigateTo('/cart'));
    historyButton.addEventListener('click', () => this.navigateTo('/order-history'));
    reorderButton.addEventListener('click', () => this.navigateTo('/reorder'));
    accountButton.addEventListener('click', () => this.navigateTo('/login'));

    this.updateCartCount();
    window.addEventListener('cart-updated', () => this.updateCartCount());

    // Dark mode support
    window.addEventListener('theme-changed', () => this.updateCSSVariables());
    this.updateCSSVariables();

    // Search functionality
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

    updateClearVisibility(); // Initial check
  }

  updateCSSVariables() {
    const rootStyles = getComputedStyle(document.documentElement);
    const host = this.shadowRoot.host;
    host.style.setProperty('--header-bg', rootStyles.getPropertyValue('--card-bg'));
    host.style.setProperty('--header-text', rootStyles.getPropertyValue('--text-color'));
    host.style.setProperty('--header-title', rootStyles.getPropertyValue('--heading-color'));
    host.style.setProperty('--header-shadow', rootStyles.getPropertyValue('--shadow-color'));
    host.style.setProperty('--header-button-bg', rootStyles.getPropertyValue('--button-bg'));
    host.style.setProperty('--header-button-text', rootStyles.getPropertyValue('--button-text'));
    host.style.setProperty('--header-button-hover', rootStyles.getPropertyValue('--secondary-color'));
  }

  updateCartCount() {
    const cartCountEl = this.shadowRoot.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    cartCountEl.textContent = itemCount;
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
    this.updateCartCount();
    this.updateCSSVariables();
  }
}

customElements.define('nav-bar', Header);
