import { saveMenuPageState } from '../menu-state.js'; // adjust path if needed

export default class ItemCard extends HTMLElement {
  static get observedAttributes() {
    return ['id', 'name', 'price', 'img', 'description'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();

    // ✅ Store item in sessionStorage on click
    const anchor = this.shadowRoot.querySelector("a");
    if (anchor) {
        // ✅ Save current menu-page state before routing
        anchor.addEventListener("click", () => {
        
        saveMenuPageState();
        
        const itemData = {
          id: parseInt(this.getAttribute("id") || 0),
          name: this.getAttribute("name") || "Unknown Item",
          price: parseFloat(this.getAttribute("price") || 0),
          image: this.getAttribute("img") || "",
          description: this.getAttribute("description") || ""
        };
        sessionStorage.setItem("selectedItem", JSON.stringify(itemData));
      });
    }

    window.addEventListener('theme-changed', this.handleThemeChange);
  }

  disconnectedCallback() {
    window.removeEventListener('theme-changed', this.handleThemeChange);
  }

  handleThemeChange = () => {
    this.render();
  };

  render() {
    const id = this.getAttribute("id") || "";
    const name = this.getAttribute("name") || "Item Name";
    const price = this.getAttribute("price") || "0.00";
    const imgSrc = this.getAttribute("img") || "";
    
    this.shadowRoot.innerHTML = `
      <style>
        a {
          text-decoration: none;
          display: block; /* Makes the entire card clickable */
        }

        button {
          cursor: pointer;
          background-color: var(--primary-button-bg, #d4a574);
          color: var(--primary-button-text, #4a3520);
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        button:hover {
          background-color: var(--secondary-color, #c69c6d);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px var(--shadow-color, rgba(0, 0, 0, 0.1));
        }

        .menu-item {
          background-color: var(--card-bg, #fff);
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px var(--shadow-color, rgba(0, 0, 0, 0.1));
          transition: transform 0.3s ease;
          cursor: pointer;
          width: 100%; /* Full width of parent container */
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-details p {
          color: var(--secondary-color, #8b5a2b);
          font-weight: bold;
        }
        
        .item-price {
          font-size: 16px;
          font-weight: bold;
          color: var(--price-color, #8b5a2b);
        }
        
        /* Add a placeholder style for images that fail to load */
        img.error {
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 14px;
        }
      </style>
      <a data-link href="/item/${id}">
        <div class="menu-item" data-id="${id}">
          <img src="${imgSrc}" alt="${name}" onerror="this.classList.add('error'); this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'%3E%3Crect width=\\'100\\' height=\\'100\\' fill=\\'%23f5f5f5\\' /%3E%3Ctext x=\\'50\\' y=\\'50\\' font-family=\\'Arial\\' font-size=\\'14\\' text-anchor=\\'middle\\' alignment-baseline=\\'middle\\' fill=\\'%23999\\' %3ENo Image%3C/text%3E%3C/svg%3E';">
          <div class="item-details">
            <h3>${name}</h3>
            <p class="item-price">$${price}</p>
          </div>
        </div>
      </a>
    `;
  }
}

customElements.define('item-card', ItemCard);