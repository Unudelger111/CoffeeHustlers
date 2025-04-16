class MenuRoute extends HTMLElement {
  connectedCallback() {
    requestAnimationFrame(() => {
      const router = this.closest('menu-router');
      if (router && typeof router.addRoute === 'function') {
        router.addRoute({
          path: this.getAttribute('path'),
          component: this.getAttribute('component')
        });
      } else {
        console.warn("Router not ready or missing addRoute");
      }
    });
  }
}
customElements.define('menu-route', MenuRoute);
