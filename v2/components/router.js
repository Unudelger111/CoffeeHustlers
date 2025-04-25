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
    // If the path starts with "/menu/item/", normalize it to "/menu/item"
    if (path.startsWith("/menu/item/")) {
      path = "/menu/item"; 
    }

    const route = this.routes.get(path);
    if (!route) return;

    const { comp } = route;

    console.log("📦 Importing:", comp);

    if (!customElements.get(comp)) {
      import(`../pages/${comp}.js`)
        .then(() => this.renderComponent(comp, path))
        .catch(err => console.error("Import failed:", err));
    } else {
      this.renderComponent(comp, path);
    }
  }

  renderComponent(tagName, path) {
    // Determine the target container based on the path
    const view = path === "/cart" ? document.querySelector('#app-content') : document.querySelector('#menu-view');
    if (view) {
      view.innerHTML = `<${tagName}></${tagName}>`;
    }
  }

  connectedCallback() {
    console.log("menu-router connected");

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
