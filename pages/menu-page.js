export default class MenuPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.tab = "hot";
    this.data = [];
    this.render();
    this.setupThemeListener();
  }

    async fetchData() {
      const res = await fetch("data/items.json");
      this.data = await res.json();
      this.renderItems();
    }

  renderItems() {
    const container = this.shadowRoot.getElementById('menu-items-container');
    if (!container) return;

    const itemsHTML = this.data.filter(el => el.type === this.tab).map(el => `
      <item-card
        id="${el.id}"
        name="${el.name}"
        price="${el.price}"
        img="${el.image}"
      ></item-card>
    `).join("");

    container.innerHTML = itemsHTML;
    this.updateActiveButton();
  }

  updateActiveButton() {
    const menuCategoriesComponent = this.shadowRoot.querySelector('menu-categories');
    if (!menuCategoriesComponent) return;

    const buttons = menuCategoriesComponent.shadowRoot.querySelectorAll('.category-btn');

    buttons.forEach(button => {
      if (button.dataset.category === this.tab) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  setupThemeListener() {
    // Listen for theme-changed events
    document.addEventListener('theme-changed', (e) => {
      this.updateThemeStyles();
    });
  }

  updateThemeStyles() {
    // This method can be used to dynamically update styles if needed
    // Most styling will come from CSS variables
  }

  connectedCallback() {
    this.fetchData();

    const observer = new MutationObserver(() => {
      const categoryBtn = this.shadowRoot.querySelector("menu-categories");
      if (categoryBtn) {
        categoryBtn.addEventListener('change-tab', (e) => {
          this.tab = e.detail.tab;
          this.renderItems();
        });
        observer.disconnect();
      }
    });

    observer.observe(this.shadowRoot, { childList: true, subtree: true });
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
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          background-color: var(--bg-color, #f5f0e8);
          color: var(--text-color, #4a3520);
          transition: all 0.3s ease;
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

      @media (max-width: 768px) {
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
        <div class="theme-toggle-wrapper">
          <theme-toggle></theme-toggle>
        </div>

        <div class="dropdowns">
          <select id="shop-select">
            <option disabled selected>Select Coffee Shop</option>
            <option value="Cafe Bene">Cafe Bene</option>
            <option value="Coffee Namu">Coffee Namu</option>
            <option value="Tom N Toms">Tom N Toms</option>
          </select>
          <select id="location-select">
            <option disabled selected>Select Location</option>
            <option value="Downtown">Downtown</option>
            <option value="Uptown">Uptown</option>
            <option value="Suburb">Suburb</option>
          </select>
        </div>

        <menu-categories></menu-categories>

        <div class="menu-items">
          <div class="menu-section" id="menu-items-container"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('menu-page', MenuPage);