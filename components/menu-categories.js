export default class MenuCategories extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.categories = [];
    this.activeTab = "";
  }

  static get observedAttributes() {
    return ["categories", "active"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "categories") {
      try {
        this.categories = JSON.parse(newValue);
      } catch (e) {
        console.error("Invalid JSON for categories attribute");
      }
    } else if (name === "active") {
      this.activeTab = newValue;
    }
    this.render();
  }

  connectedCallback() {
    this.shadowRoot.addEventListener("click", (e) => {
      if (e.target.matches("button[data-category]")) {
        const tab = e.target.dataset.category;
        this.dispatchEvent(new CustomEvent("change-tab", {
          bubbles: true,
          composed: true,
          detail: { tab },
        }));
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        button {
            cursor: pointer;
            background-color: #d4a574;
            color: #4a3520;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        button:hover {
            background-color: #c69c6d;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .menu-categories {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 30px 0;
            flex-wrap: wrap;
        }

        .category-btn {
            background-color: #e9e1d9;
            color: #6f4e37;
            padding: 10px 20px;
            border-radius: 25px;
        }

        .category-btn.active {
            background-color: #6f4e37;
            color: #fff;
        }

        @media (max-width: 480px) {
            .menu-categories {
                flex-direction: column;
                align-items: center;
            }
            .category-btn {
                width: 80%;
            }
        }
      </style>
      <div class="menu-categories">
        ${this.categories.map(cat => `
          <button class="category-btn ${cat === this.activeTab ? 'active' : ''}" data-category="${cat}">
            ${cat}
          </button>
        `).join("")}
      </div>
    `;
  }
}

customElements.define('menu-categories', MenuCategories);
