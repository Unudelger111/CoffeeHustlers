export default class MenuCategories extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }
  connectedCallback() {
    const buttons = this.shadowRoot.querySelectorAll("button");
    buttons.forEach(el => {
      el.addEventListener("click", (e) => {
        this.dispatchEvent(new CustomEvent("change-tab", {
          bubbles: true,
          composed: true,
          detail: { tab: e.target.dataset.category },
        }));
      })
    })
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
        <button class="category-btn active" data-category="hot">
          <i class="fas fa-mug-hot"></i> Hot Coffee
        </button>
        <button class="category-btn" data-category="cold">
          <i class="fas fa-glass-whiskey"></i> Cold Coffee
        </button>
        <button class="category-btn" data-category="specialty">
          <i class="fas fa-star"></i> Specialty
        </button>
        <button class="category-btn" data-category="food">
          <i class="fas fa-utensils"></i> Food & Snacks
        </button>
      </div>
    `;
  }
}

customElements.define('menu-categories', MenuCategories);
