class MenuHot extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<!-- Hot Coffee Section -->
            <div class="menu-section" id="hot">
                <div class="menu-item" data-id="1">
                    <img src="images/espresso.jpg" alt="Espresso">
                    <div class="item-details">
                        <h3>Espresso</h3>
                        <p>$2.99</p>
                    </div>
                </div>
                <div class="menu-item" data-id="2">
                    <img src="images/americano.jpg" alt="Americano">
                    <div class="item-details">
                        <h3>Americano</h3>
                        <p>$3.49</p>
                    </div>
                </div>
                <div class="menu-item" data-id="3">
                    <img src="images/latte.jpg" alt="Latte">
                    <div class="item-details">
                        <h3>Latte</h3>
                        <p>$4.29</p>
                    </div>
                </div>
                <div class="menu-item" data-id="4">
                    <img src="images/cappuccino.jpg" alt="Cappuccino">
                    <div class="item-details">
                        <h3>Cappuccino</h3>
                        <p>$4.29</p>
                    </div>
                </div>
                <div class="menu-item" data-id="1">
                    <img src="images/espresso.jpg" alt="Espresso">
                    <div class="item-details">
                        <h3>Espresso</h3>
                        <p>$2.99</p>
                    </div>
                </div>
                <div class="menu-item" data-id="2">
                    <img src="images/americano.jpg" alt="Americano">
                    <div class="item-details">
                        <h3>Americano</h3>
                        <p>$3.49</p>
                    </div>
                </div>
                <div class="menu-item" data-id="3">
                    <img src="images/latte.jpg" alt="Latte">
                    <div class="item-details">
                        <h3>Latte</h3>
                        <p>$4.29</p>
                    </div>
                </div>
                <div class="menu-item" data-id="4">
                    <img src="images/cappuccino.jpg" alt="Cappuccino">
                    <div class="item-details">
                        <h3>Cappuccino</h3>
                        <p>$4.29</p>
                    </div>
                </div>
                <div class="menu-item" data-id="1">
                    <img src="images/espresso.jpg" alt="Espresso">
                    <div class="item-details">
                        <h3>Espresso</h3>
                        <p>$2.99</p>
                    </div>
                </div>
                <div class="menu-item" data-id="2">
                    <img src="images/americano.jpg" alt="Americano">
                    <div class="item-details">
                        <h3>Americano</h3>
                        <p>$3.49</p>
                    </div>
                </div>
                <div class="menu-item" data-id="3">
                    <img src="images/latte.jpg" alt="Latte">
                    <div class="item-details">
                        <h3>Latte</h3>
                        <p>$4.29</p>
                    </div>
                </div>
                <div class="menu-item" data-id="4">
                    <img src="images/cappuccino.jpg" alt="Cappuccino">
                    <div class="item-details">
                        <h3>Cappuccino</h3>
                        <p>$4.29</p>
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

customElements.define('menu-hot', MenuHot);
