import './menu-route.js';
import './menu-routes.js';

class MenuRouter extends HTMLElement {
  constructor() {
    super();
    this.routes = new Map();
  }

  addRoute(route) {
    this.routes.set(route.path, { comp: route.component });
  }

  navigate(path) {
    location.hash = path;
    this.updateUI(path);
  }

  updateUI(path) {
    // Normalize path for dynamic item route
    if (path.startsWith("/menu/item/")) {
      path = "/menu/item"; // Match route map key
    }

    const route = this.routes.get(path);
    if (!route) return;

    const { comp } = route;

    console.log("📦 Importing:", comp);

    if (!customElements.get(comp)) {
      import(`../pages/${comp}.js`)
        .then(() => this.renderComponent(comp))
        .catch(err => console.error("❌ Import failed:", err));
    } else {
      this.renderComponent(comp);
    }
  }

  renderComponent(tagName) {
    const view = document.querySelector('#menu-view');
    if (view) {
      view.innerHTML = `<${tagName}></${tagName}>`;
    }
  }

  connectedCallback() {
    console.log("✅ menu-router connected");

    requestAnimationFrame(() => {
      const path = location.hash.slice(1) || "/menu/hot";
      this.updateUI(path);
    });

    window.addEventListener('hashchange', () => {
      const path = location.hash.slice(1);
      this.updateUI(path);
    });
  }
}

customElements.define('menu-router', MenuRouter);
