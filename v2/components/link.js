
class MenuLink extends HTMLButtonElement {
  connectedCallback() {
    this.addEventListener('click', (e) => {
      e.preventDefault();
      const path = this.getAttribute('to');
      document.querySelector('menu-router')?.navigate(path);
    });
  }
}

customElements.define('menu-link', MenuLink, { extends: 'button' });
