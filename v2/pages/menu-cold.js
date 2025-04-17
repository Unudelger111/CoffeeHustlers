class MenuCold extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="menu-section" id="cold">
        <div class="menu-item" data-id="5">
          <img src="/CoffeeHustlers/v2/images/iced-coffee.jpg" alt="Iced Coffee">
          <div class="item-details">
            <h3>Iced Coffee</h3>
            <p>$3.99</p>
          </div>
        </div>
        <div class="menu-item" data-id="6">
          <img src="/CoffeeHustlers/v2/images/cold-brew.jpg" alt="Cold Brew">
          <div class="item-details">
            <h3>Cold Brew</h3>
            <p>$4.49</p>
          </div>
        </div>
        <div class="menu-item" data-id="7">
          <img src="/CoffeeHustlers/v2/images/iced-latte.jpg" alt="Iced Latte">
          <div class="item-details">
            <h3>Iced Latte</h3>
            <p>$4.79</p>
          </div>
        </div>
        <div class="menu-item" data-id="5">
          <img src="/CoffeeHustlers/v2/images/iced-coffee.jpg" alt="Iced Coffee">
          <div class="item-details">
            <h3>Iced Coffee</h3>
            <p>$3.99</p>
          </div>
        </div>
        <div class="menu-item" data-id="6">
          <img src="/CoffeeHustlers/v2/images/cold-brew.jpg" alt="Cold Brew">
          <div class="item-details">
            <h3>Cold Brew</h3>
            <p>$4.49</p>
          </div>
        </div>
        <div class="menu-item" data-id="7">
          <img src="/CoffeeHustlers/v2/images/iced-latte.jpg" alt="Iced Latte">
          <div class="item-details">
            <h3>Iced Latte</h3>
            <p>$4.79</p>
          </div>
        </div>
        <div class="menu-item" data-id="5">
          <img src="/CoffeeHustlers/v2/images/iced-coffee.jpg" alt="Iced Coffee">
          <div class="item-details">
            <h3>Iced Coffee</h3>
            <p>$3.99</p>
          </div>
        </div>
        <div class="menu-item" data-id="6">
          <img src="/CoffeeHustlers/v2/images/cold-brew.jpg" alt="Cold Brew">
          <div class="item-details">
            <h3>Cold Brew</h3>
            <p>$4.49</p>
          </div>
        </div>
        <div class="menu-item" data-id="7">
          <img src="/CoffeeHustlers/v2/images/iced-latte.jpg" alt="Iced Latte">
          <div class="item-details">
            <h3>Iced Latte</h3>
            <p>$4.79</p>
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

customElements.define('menu-cold', MenuCold);
