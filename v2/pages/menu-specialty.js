class MenuSpecialty extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="menu-section" id="specialty">
        <div class="menu-item" data-id="8">
          <img src="images/mocha.jpg" alt="Mocha">
          <div class="item-details">
            <h3>Mocha</h3>
            <p>$4.99</p>
          </div>
        </div>
        <div class="menu-item" data-id="9">
          <img src="images/caramel-macchiato.jpg" alt="Caramel Macchiato">
          <div class="item-details">
            <h3>Caramel Macchiato</h3>
            <p>$5.29</p>
          </div>
        </div>
        <div class="menu-item" data-id="8">
          <img src="images/mocha.jpg" alt="Mocha">
          <div class="item-details">
            <h3>Mocha</h3>
            <p>$4.99</p>
          </div>
        </div>
        <div class="menu-item" data-id="9">
          <img src="images/caramel-macchiato.jpg" alt="Caramel Macchiato">
          <div class="item-details">
            <h3>Caramel Macchiato</h3>
            <p>$5.29</p>
          </div>
        </div>
        <div class="menu-item" data-id="8">
          <img src="images/mocha.jpg" alt="Mocha">
          <div class="item-details">
            <h3>Mocha</h3>
            <p>$4.99</p>
          </div>
        </div>
        <div class="menu-item" data-id="9">
          <img src="images/caramel-macchiato.jpg" alt="Caramel Macchiato">
          <div class="item-details">
            <h3>Caramel Macchiato</h3>
            <p>$5.29</p>
          </div>
        </div>
      </div>
    `;
            // Add click listeners to items
            this.querySelectorAll('.menu-item').forEach(item => {
              const itemId = item.getAttribute('data-id');
              item.style.cursor = 'pointer';
              item.addEventListener('click', () => {
                document.querySelector('menu-router')?.navigate(`/menu/item/${itemId}`);
              });
            });
  }
}

customElements.define('menu-specialty', MenuSpecialty);
