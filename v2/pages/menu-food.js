class MenuFood extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="menu-section" id="food">
        <div class="menu-item" data-id="10">
          <img src="/v2/images/milk-cake.jpg" alt="Croissant">
          <div class="item-details">
            <h3>Milk Cake</h3>
            <p>$3.49</p>
          </div>
        </div>
        <div class="menu-item" data-id="11">
          <img src="/v2/images/hotdog.jpg" alt="Blueberry Muffin">
          <div class="item-details">
            <h3>Hotdog Pretzel</h3>
            <p>$3.99</p>
          </div>
        </div>
        <div class="menu-item" data-id="12">
          <img src="/v2/images/chocolate-bread.jpg" alt="Blueberry Muffin">
          <div class="item-details">
            <h3>Chocolate Bread</h3>
            <p>$3.99</p>
          </div>
        </div>
        <div class="menu-item" data-id="13">
          <img src="/v2/images/croissant.jpg" alt="Blueberry Muffin">
          <div class="item-details">
            <h3>Milk Cream Croissant</h3>
            <p>$3.99</p>
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

customElements.define('menu-food', MenuFood);
