export default class MenuPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.tab = "";
    this.menuItems = [];
    this.franchises = [];
    this.franchiseMap = {};
    this.categories = [];
    this.isMobile = window.innerWidth <= 768;
    this.render();
    this.setupThemeListener();
    this.setupCartEvents();
    this.setupResizeListener();
  }

  setupResizeListener() {
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;
      if (wasMobile !== this.isMobile) {
        this.render();
      }
    });
  }

  async fetchFranchises() {
    try {
      const res = await fetch("http://localhost:3000/franchises", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: "*/*",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch franchises");

      const franchises = await res.json();
      this.franchises = franchises.map(f => f.name);
      franchises.forEach(f => this.franchiseMap[f.name] = f.id);

      this.render();
      this.addFranchiseListener();

      const shopSelect = this.shadowRoot.querySelector("#shop-select");
      if (shopSelect && this.restoreFranchise) {
        shopSelect.value = this.restoreFranchise;
        const franchiseId = this.franchiseMap[this.restoreFranchise];
        if (franchiseId) {
          await this.fetchLocations(franchiseId); 
        }
      }
    } catch (error) {
      console.error("Error fetching franchises:", error);
    }
  }

  async fetchLocations(franchiseId) {
    try {
      const res = await fetch(`http://localhost:3000/franchises/${franchiseId}/coffee-shops`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: "*/*",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch coffee shop locations");

      const locations = await res.json();
      this.populateLocationSelect(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }

  async fetchCoffeeShopMenu(coffeeShopId) {
    try {
      const res = await fetch(`http://localhost:3000/coffee-shops/${coffeeShopId}/menu`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: "*/*",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch menu");

      const items = await res.json();
      this.menuItems = items;

      const categoriesSet = new Set(items.map(i => i.category));
      this.categories = [...categoriesSet];
      if (!this.tab || !this.categories.includes(this.tab)) {
        this.tab = this.categories[0];
      }

      await this.fetchMenuItemPrices();

      this.updateCategories();  
      this.renderItems();      

    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  }

  async fetchMenuItemPrices() {
    try {
      const enhancedMenuItems = await Promise.all(
        this.menuItems.map(async (item) => {
          try {
            const res = await fetch(`http://localhost:3000/menu-items/${item.id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                Accept: "*/*",
              },
            });

            if (!res.ok) throw new Error(`Failed to fetch price for item ${item.id}`);

            const detailedItem = await res.json();
            const smallestSize = detailedItem.sizes && detailedItem.sizes.length > 0 
              ? detailedItem.sizes.reduce((prev, curr) => 
                  parseFloat(prev.base_price) < parseFloat(curr.base_price) ? prev : curr
                )
              : null;
              
            return {
              ...item,
              price: smallestSize ? smallestSize.base_price : "N/A", 
              sizes: detailedItem.sizes || []
            };
          } catch (error) {
            console.error(`Error fetching price for menu item ${item.id}:`, error);
            return { ...item, price: "N/A", sizes: [] };
          }
        })
      );

      this.menuItems = enhancedMenuItems;
    } catch (error) {
      console.error("Error fetching menu item prices:", error);
    }
  }

  async populateLocationSelect(locations) {
    const locationSelect = this.shadowRoot.querySelector("#location-select");
    if (!locationSelect) return;

    locationSelect.innerHTML = `<option disabled selected>Select Location</option>`;
    locations.forEach(shop => {
      const option = document.createElement("option");
      option.value = shop.id;
      option.textContent = shop.location || shop.name;
      locationSelect.appendChild(option);
    });

    if (this.restoreLocation) {
      locationSelect.value = this.restoreLocation;
      await this.fetchCoffeeShopMenu(this.restoreLocation); 
      window.scrollTo(0, this.savedScrollY || 0);
      sessionStorage.removeItem("menuState"); 
      this.restoreLocation = null;
    }

    locationSelect.addEventListener("change", (e) => {
      const shopId = e.target.value;
      if (shopId) {
        cartService.clearCart();
        sessionStorage.setItem("selectedShopId", shopId);
        this.fetchCoffeeShopMenu(shopId);
      }
    });
  }

  addFranchiseListener() {
    const shopSelect = this.shadowRoot.querySelector("#shop-select");
    if (!shopSelect) return;

    shopSelect.addEventListener("change", (e) => {
      const selectedName = e.target.value;
      const franchiseId = this.franchiseMap[selectedName];
      if (franchiseId) this.fetchLocations(franchiseId);
    });
  }

  renderItems() {
    const container = this.shadowRoot.getElementById('menu-items-container');
    if (!container) return;

    const itemsHTML = this.menuItems
      .filter(el => el.category === this.tab)
      .map(el => `
        <item-card
          id="${el.id}"
          name="${el.name}"
          price="${el.price}"
          img="${el.image_url}"
          sizes='${JSON.stringify(el.sizes || [])}'
        ></item-card>
      `).join("");

    container.innerHTML = itemsHTML;
    this.updateActiveButton();
  }

  updateActiveButton() {
    const buttons = this.shadowRoot.querySelectorAll(".category-btn");
    buttons.forEach(button => {
      if (button.dataset.category === this.tab) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  setupThemeListener() {
    document.addEventListener('theme-changed', () => {
      this.updateThemeStyles();
    });
  }
  
  setupCartEvents() {
    this.addEventListener('add-to-cart', (e) => {
      const item = e.detail;
      console.log('Adding to cart:', item);
      const addToCartEvent = new CustomEvent('add-item-to-cart', {
        bubbles: true,
        composed: true,
        detail: item
      });
      
      this.dispatchEvent(addToCartEvent);
      this.showAddToCartNotification(item);
    });
  }
  
  showAddToCartNotification(item) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `Added ${item.name} (${item.size}) to cart!`;
    
    notification.style.position = 'fixed';
    notification.style.bottom = this.isMobile ? '80px' : '20px';
    notification.style.right = '20px';
    notification.style.left = this.isMobile ? '20px' : 'auto';
    notification.style.backgroundColor = '#6f4e37';
    notification.style.color = '#fff';
    notification.style.padding = this.isMobile ? '12px 16px' : '10px 20px';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    notification.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
    notification.style.fontSize = this.isMobile ? '14px' : '16px';
    notification.style.textAlign = 'center';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }

  updateThemeStyles() {}

  connectedCallback() {
    const savedState = sessionStorage.getItem("menuState");
    console.log("🟡 connectedCallback: savedState = ", savedState);

    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.tab = state.tab || this.tab;
        this.savedScrollY = state.scrollY || 0;
        this.restoreFranchise = state.franchise;
        this.restoreLocation = state.location;

        console.log("Restoring tab:", this.tab);
        console.log("Restoring franchise:", this.restoreFranchise);
        console.log("Restoring location:", this.restoreLocation);
      } catch (e) {
        console.warn("Failed to parse saved menu state:", e);
      }
    }

    this.fetchFranchises();
  }

  updateCategories() {
    const catComponent = this.shadowRoot.querySelector("menu-categories");
    if (!catComponent) return;
    catComponent.setAttribute('categories', JSON.stringify(this.categories));
    catComponent.setAttribute('active', this.tab);
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
          display: block;
          position: relative;
      }

      .container {
          padding: 16px;
          min-height: 100vh;
          background-color: var(--bg-color, #f5f0e8);
          color: var(--text-color, #4a3520);
          transition: all 0.3s ease;
          display: flex;
      }
      
      .reorder-sidebar {
          width: 280px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: calc(100vh - 32px);
          overflow-y: auto;
          border-radius: 12px;
          margin-right: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      }
      
      .menu-content {
          flex: 1;
          min-width: 0;
      }

      .hidden {
          display: none !important;
      }

      .theme-toggle-wrapper {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 50;
      }

      .dropdowns {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 30px auto 40px;
          max-width: 600px;
          flex-wrap: wrap;
      }

      .dropdowns select {
          padding: 14px 24px;
          border-radius: 30px;
          border: 2px solid var(--border-color, #6f4e37);
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          font-weight: 500;
          background-color: var(--dropdown-bg, #fff);
          color: var(--text-color, #6f4e37);
          appearance: none;
          box-shadow: 0 4px 16px var(--shadow-color, rgba(111, 78, 55, 0.12));
          cursor: pointer;
          flex: 1;
          min-width: 180px;
          max-width: 280px;
          text-align: center;
          background-repeat: no-repeat;
          background-position: right 15px center;
          background-size: 16px;
          transition: all 0.3s ease;
      }

      .dropdowns select:hover {
          background-color: var(--bg-color, #f9f5f0);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px var(--shadow-color, rgba(111, 78, 55, 0.18));
      }

      .dropdowns select:focus {
          outline: none;
          border-color: var(--secondary-color, #8b5a2b);
          box-shadow: 0 6px 24px var(--shadow-color, rgba(111, 78, 55, 0.25));
      }

      .dropdowns select option {
          background-color: var(--dropdown-bg, #fff);
          color: var(--text-color, #4a3520);
          padding: 12px;
      }
      label {
        font-size: 14px;
        margin-bottom: 4px;
        display: block;
      }

      .menu-categories {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 30px 0 40px;
          flex-wrap: wrap;
          padding: 0 8px;
      }

      .category-btn {
          background-color: var(--category-bg, #e9e1d9);
          color: var(--text-color, #6f4e37);
          padding: 12px 24px;
          border-radius: 25px;
          transition: all 0.3s ease;
          font-weight: 500;
          font-size: 15px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
      }

      .category-btn.active {
          background-color: var(--category-active-bg, #6f4e37);
          color: var(--category-active-text, #fff);
          box-shadow: 0 4px 12px rgba(111, 78, 55, 0.3);
      }

      .category-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(111, 78, 55, 0.2);
      }

      .menu-section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          padding: 0 8px;
      }

      .menu-item {
          background-color: var(--card-bg, #fff);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.08));
          transition: all 0.3s ease;
          cursor: pointer;
      }

      .menu-item:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 32px var(--shadow-color, rgba(0, 0, 0, 0.15));
      }

      .menu-item img {
          width: 100%;
          height: auto;
          object-fit: contain;
          aspect-ratio: 4 / 3;
          padding: 12px;
      }

      .item-details {
          padding: 20px;
      }

      .item-details h3 {
          margin-bottom: 8px;
          color: var(--heading-color, #6f4e37);
          font-size: 18px;
          font-weight: 600;
      }

      .item-details p {
          color: var(--secondary-color, #8b5a2b);
          font-weight: 700;
          font-size: 16px;
      }
      
      .loading-indicator {
          text-align: center;
          padding: 40px 20px;
          font-size: 18px;
          color: var(--text-color, #6f4e37);
      }

      /* Mobile Styles - Tablet */
      @media (max-width: 1024px) {
          .container {
              padding: 12px;
          }
          
          .reorder-sidebar {
              width: 240px;
              margin-right: 16px;
          }
          
          .menu-section {
              grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
              gap: 20px;
          }
          
          .theme-toggle-wrapper {
              top: 12px;
              right: 12px;
          }
      }

      /* Mobile tom utas */
      @media (max-width: 768px) {
          .container {
              flex-direction: column;
              padding: 12px;
              gap: 0;
          }
          
          .reorder-sidebar {
              width: 100%;
              height: auto;
              max-height: 280px;
              margin-right: 0;
              margin-bottom: 20px;
              position: relative;
              border-radius: 12px;
              padding: 16px;
          }
          
          .menu-content {
              padding-left: 0;
          }

          .theme-toggle-wrapper {
              position: relative;
              top: 0;
              right: 0;
              display: flex;
              justify-content: flex-end;
              margin: 0 0 20px 0;
              z-index: 10;
          }

          .dropdowns {
              flex-direction: column;
              gap: 12px;
              margin: 20px auto 30px;
              padding: 0 4px;
          }

          .dropdowns select {
              width: 100%;
              max-width: none;
              min-width: auto;
              padding: 16px 20px;
              font-size: 16px;
          }

          .menu-categories {
              gap: 8px;
              margin: 20px 0 30px;
              padding: 0 4px;
          }

          .category-btn {
              padding: 10px 16px;
              font-size: 14px;
              flex: 1;
              min-width: 80px;
          }
      
          .menu-section {
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              gap: 16px;
              padding: 0 4px;
          }

          .item-details {
              padding: 16px;
          }

          .item-details h3 {
              font-size: 16px;
          }

          .item-details p {
              font-size: 15px;
          }
      }

      /* Mobile  */
      @media (max-width: 480px) {
          .container {
              padding: 8px;
          }

          .reorder-sidebar {
              padding: 12px;
              margin-bottom: 16px;
          }

          .theme-toggle-wrapper {
              top: 8px;
              right: 8px;
          }

          .dropdowns {
              margin: 16px auto 24px;
              padding: 0 2px;
          }

          .dropdowns select {
              padding: 14px 16px;
              font-size: 15px;
              border-radius: 25px;
          }

          .menu-categories {
              gap: 6px;
              margin: 16px 0 24px;
              padding: 0 2px;
          }

          .category-btn {
              padding: 8px 12px;
              font-size: 13px;
              border-radius: 20px;
          }

          .menu-section {
              grid-template-columns: 1fr;
              gap: 12px;
              padding: 0 2px;
          }

          .menu-item {
              border-radius: 12px;
          }

          .item-details {
              padding: 12px;
          }

          .item-details h3 {
              font-size: 15px;
              margin-bottom: 6px;
          }

          .item-details p {
              font-size: 14px;
          }

          .loading-indicator {
              padding: 30px 16px;
              font-size: 16px;
          }
      }

      /* Mobile */
      @media (max-width: 360px) {
          .container {
              padding: 6px;
          }

          .theme-toggle-wrapper {
              top: 6px;
              right: 6px;
          }

          .dropdowns select {
              padding: 12px 14px;
              font-size: 14px;
          }

          .category-btn {
              padding: 6px 10px;
              font-size: 12px;
          }

          .menu-section {
              gap: 10px;
          }

          .item-details {
              padding: 10px;
          }
      }

      @media (max-height: 500px) and (orientation: landscape) {
          .reorder-sidebar {
              max-height: 200px;
          }
          
          .menu-categories {
              margin: 16px 0 20px;
          }
          
          .category-btn {
              padding: 8px 16px;
              font-size: 13px;
          }
      }

      @media (hover: none) and (pointer: coarse) {
          .category-btn {
              min-height: 44px;
              display: flex;
              align-items: center;
              justify-content: center;
          }

          .dropdowns select {
              min-height: 48px;
          }

          .menu-item {
              cursor: default;
          }

          .menu-item:active {
              transform: scale(0.98);
          }
      }
    </style> 
  `;

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet}
      <div class="container">
        ${!this.isMobile ? `
          <div class="reorder-sidebar">
            <reorder-column></reorder-column>
          </div>
        ` : ''}
        
        <div class="menu-content">
          <div class="theme-toggle-wrapper">
            <theme-toggle></theme-toggle>
          </div>

          ${this.isMobile ? `
            <div class="reorder-sidebar">
              <reorder-column></reorder-column>
            </div>
          ` : ''}

          ${this.franchises.length > 0 ? `
            <div class="dropdowns">
              <label for="shop-select">Coffee Shop</label>
              <select id="shop-select">
                <option disabled selected>Select Coffee Shop</option>
                ${this.franchises.map(name => `<option value="${name}">${name}</option>`).join("")}
              </select>
              <label for="location-select">Location</label>
              <select id="location-select">
                <option disabled selected>Select Location</option>
              </select>
            </div>
          ` : `<p class="loading-indicator">Loading coffee shops...</p>`}

            <menu-categories 
              categories='${JSON.stringify(this.categories)}' 
              active='${this.tab}'
            ></menu-categories>

          <div class="menu-items">
            <div class="menu-section" id="menu-items-container"></div>
          </div>
        </div>
      </div>
    `;

    const catComponent = this.shadowRoot.querySelector("menu-categories");
    if (catComponent) {
      catComponent.addEventListener("change-tab", (e) => {
        this.tab = e.detail.tab;
        this.updateCategories(); 
        this.renderItems();    
      });
    }
  }
}

customElements.define('menu-page', MenuPage); 