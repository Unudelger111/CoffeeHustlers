// components/router.js
import './menu-route.js';
import './menu-routes.js';

class MenuRouter extends HTMLElement {
  constructor() {
    super();
    this.routes = new Map();
    this.fullscreenRoutes = ['/account', '/cart']; // Routes that should hide filters
  }

  addRoute(route) {
    this.routes.set(route.path, { comp: route.component });
  }

  navigate(path) {
    location.hash = path;
    this.updateUI(path);
  }

  isFullscreenRoute(path) {
    return this.fullscreenRoutes.some(route => path === route);
  }

  updateUI(path) {
    // If the path starts with "/menu/item/", normalize it to "/menu/item"
    if (path.startsWith("/menu/item/")) {
      path = "/menu/item"; 
    }

    const route = this.routes.get(path);
    if (!route) return;

    const { comp } = route;
    const isFullscreen = this.isFullscreenRoute(path);

    console.log("📦 Importing:", comp);

    // Handle visibility of filters section
    const filtersSection = document.querySelector('.filters');
    if (filtersSection) {
      filtersSection.style.display = isFullscreen ? 'none' : '';
    }

    if (!customElements.get(comp)) {
      import(`../pages/${comp}.js`)
        .then(() => this.renderComponent(comp, path, isFullscreen))
        .catch(err => console.error("Import failed:", err));
    } else {
      this.renderComponent(comp, path, isFullscreen);
    }
  }

  renderComponent(tagName, path, isFullscreen) {
    // For fullscreen routes, render in app-content
    // For regular routes, render in menu-view
    const container = isFullscreen ? 
                    document.querySelector('#app-content') : 
                    document.querySelector('#menu-view');
    
    if (container) {
      // For fullscreen routes, replace the entire content
      if (isFullscreen) {
        container.innerHTML = `<${tagName}></${tagName}>`;
      } else {
        // For regular routes, only replace the menu-view content
        const menuView = document.querySelector('#menu-view');
        if (menuView) {
          menuView.innerHTML = `<${tagName}></${tagName}>`;
        }
      }
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