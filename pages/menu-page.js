export default class MenuPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.tab = "";
    this.menuItems = [];
    this.franchises = [];
    this.franchiseMap = {};
    this.categories = [];
    this.render();
    this.setupThemeListener();
    this.setupCartEvents();
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
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#6f4e37';
    notification.style.color = '#fff';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
    
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
      document.body.removeChild(notification);
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
          padding: 20px;
          min-height: 100vh;
          background-color: var(--bg-color, #f5f0e8);
          color: var(--text-color, #4a3520);
          transition: all 0.3s ease;
          display: flex;

      }
      
      .reorder-sidebar {
          width: 250px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: calc(100vh - 40px);
          overflow-y: auto;
          padding-right: 16px;
      }
      
      .menu-content {
          flex: 1;
          padding-left: 20px;
      }

      .hidden {
          display: none !important;
      }

      /* Toggle Position */
      .theme-toggle-wrapper {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 100;
      }

      /* Updated dropdown styles */
      .dropdowns {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin: 30px auto;
          max-width: 600px;
      }

      .dropdowns select {
          padding: 12px 20px;
          border-radius: 25px;
          border: 2px solid var(--border-color, #6f4e37);
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          background-color: var(--dropdown-bg, #fff);
          color: var(--text-color, #6f4e37);
          appearance: none;
          box-shadow: 0 4px 10px var(--shadow-color, rgba(111, 78, 55, 0.1));
          cursor: pointer;
          width: 100%;
          max-width: 220px;
          text-align: center;
          background-repeat: no-repeat;
          background-position: right 15px center;
          background-size: 16px;
          transition: all 0.3s ease;
      }

      .dropdowns select:hover {
          background-color: var(--bg-color, #f9f5f0);
          transform: translateY(-2px);
      }

      .dropdowns select:focus {
          outline: none;
          border-color: var(--secondary-color, #8b5a2b);
          box-shadow: 0 4px 12px var(--shadow-color, rgba(111, 78, 55, 0.2));
      }

      .dropdowns select option {
          background-color: var(--dropdown-bg, #fff);
          color: var(--text-color, #4a3520);
          padding: 10px;
      }

      .menu-categories {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin: 30px 0;
          flex-wrap: wrap;
      }

      .category-btn {
          background-color: var(--category-bg, #e9e1d9);
          color: var(--text-color, #6f4e37);
          padding: 10px 20px;
          border-radius: 25px;
          transition: all 0.3s ease;
      }

      .category-btn.active {
          background-color: var(--category-active-bg, #6f4e37);
          color: var(--category-active-text, #fff);
      }

      .menu-section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 25px;
      }

      .menu-item {
          background-color: var(--card-bg, #fff);
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px var(--shadow-color, rgba(0, 0, 0, 0.1));
          transition: transform 0.3s ease;
          cursor: pointer;
      }

      .menu-item:hover {
          transform: translateY(-5px);
      }

      .menu-item img {
          width: 100%;
          height: auto;
          object-fit: contain;
          aspect-ratio: 4 / 3;
          padding: 10px;
      }

      .item-details {
          padding: 15px;
      }

      .item-details h3 {
          margin-bottom: 5px;
          color: var(--heading-color, #6f4e37);
      }

      .item-details p {
          color: var(--secondary-color, #8b5a2b);
          font-weight: bold;
      }
      
      .loading-indicator {
          text-align: center;
          padding: 30px;
          font-size: 18px;
      }

      @media (max-width: 768px) {
          .container {
              flex-direction: column;
          }
          
          .reorder-sidebar {
              width: 100%;
              height: auto;
              max-height: 300px;
              margin-bottom: 20px;
          }
          
          .menu-content {
              padding-left: 0;
          }
      
          .menu-section {
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }

          .dropdowns {
              flex-direction: column;
              gap: 10px;
          }
          
          .theme-toggle-wrapper {
              position: relative;
              top: 10px;
              right: auto;
              display: flex;
              justify-content: center;
              margin-bottom: 20px;
          }
      }

      @media (max-width: 480px) {
          .menu-categories {
              flex-direction: column;
              align-items: center;
          }

          .category-btn {
              width: 80%;
          }

          .menu-section {
              grid-template-columns: 1fr;
          }
      }
    </style> 
  `;

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet}
      <div class="container">
        <div class="reorder-sidebar">
          <reorder-column></reorder-column>
        </div>
        
        <div class="menu-content">
          <div class="theme-toggle-wrapper">
            <theme-toggle></theme-toggle>
          </div>

          ${this.franchises.length > 0 ? `
            <div class="dropdowns">
              <select id="shop-select">
                <option disabled selected>Select Coffee Shop</option>
                ${this.franchises.map(name => `<option value="${name}">${name}</option>`).join("")}
              </select>
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