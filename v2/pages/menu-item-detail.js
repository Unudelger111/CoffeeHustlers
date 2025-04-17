console.log("✅ menu-item-detail.js loaded");
class MenuItemDetail extends HTMLElement {
    connectedCallback() {
        const idMatch = location.hash.match(/\/menu\/item\/(\d+)/);
        const itemId = idMatch ? idMatch[1] : null;
  
      const items = {
        1: { name: 'Espresso', description: 'A concentrated shot of coffee with a robust, bold flavor.', price: 2.99, image: 'images/espresso.jpg' },
        2: { name: 'Americano', description: 'Espresso diluted with hot water, similar strength to coffee but different flavor.', price: 3.49, image: 'images/americano.jpg' },
        3: { name: 'Latte', description: 'Rich espresso balanced with steamed milk and a light layer of foam.', price: 4.29, image: 'images/latte.jpg' },
        4: { name: 'Cappuccino', description: 'Equal parts espresso, steamed milk, and milk foam.', price: 4.29, image: 'images/cappuccino.jpg' },
        5: { name: 'Iced Coffee', description: 'Chilled coffee served over ice.', price: 3.99, image: 'images/iced-coffee.jpg' },
        6: { name: 'Cold Brew', description: 'Coffee brewed cold for smoothness.', price: 4.49, image: 'images/cold-brew.jpg' },
        7: { name: 'Iced Latte', description: 'Espresso and cold milk over ice.', price: 4.79, image: 'images/iced-latte.jpg' },
        8: { name: 'Mocha', description: 'Espresso with steamed milk and chocolate.', price: 4.99, image: 'images/mocha.jpg' },
        9: { name: 'Caramel Macchiato', description: 'Vanilla espresso with caramel drizzle.', price: 5.29, image: 'images/caramel-macchiato.jpg' },
        10: { name: 'Milk Cake', description: 'Delicious milk-soaked pastry.', price: 3.49, image: 'images/milk-cake.jpg' },
        11: { name: 'Hotdog Pretzel', description: 'Savory pretzel filled with hotdog.', price: 3.99, image: 'images/hotdog.jpg' },
        12: { name: 'Chocolate Bread', description: 'Rich chocolate-filled bread.', price: 3.99, image: 'images/chocolate-bread.jpg' },
        13: { name: 'Milk Cream Croissant', description: 'Flaky croissant with creamy filling.', price: 3.99, image: 'images/croissant.jpg' },
      };
  
      const item = items[itemId];
      if (!item) {
        this.innerHTML = `<p style="padding: 2rem">Item not found.</p>`;
        return;
      }
  
      this.innerHTML = `
        <div class="container">
          <div class="item-details">
            <div class="item-image">
              <img id="item-img" src="${item.image}" alt="${item.name}">
              <div class="steam-effect">
                <div class="steam steam-1"></div>
                <div class="steam steam-2"></div>
                <div class="steam steam-3"></div>
              </div>
            </div>
            <div class="item-info">
              <h2 id="item-name">${item.name}</h2>
              <p id="item-description">${item.description}</p>
              <p id="item-price" class="price">$${item.price.toFixed(2)}</p>
  
              <div class="size-selection">
                <h3>Size</h3>
                <div class="size-options">
                  <button class="size-btn active" data-size="small" data-price="0">Small</button>
                  <button class="size-btn" data-size="medium" data-price="0.50">Medium</button>
                  <button class="size-btn" data-size="large" data-price="1.00">Large</button>
                </div>
              </div>
  
              <div class="options">
                <h3>Options</h3>
                <div class="option-group">
                  <label class="option-checkbox">
                    <input type="checkbox" name="extra-shot" data-price="0.80"> Extra Shot
                    <span class="price-add">+$0.80</span>
                  </label>
                  <label class="option-checkbox">
                    <input type="checkbox" name="extra-cream" data-price="0.50"> Extra Cream
                    <span class="price-add">+$0.50</span>
                  </label>
                  <label class="option-checkbox">
                    <input type="checkbox" name="vanilla-syrup" data-price="0.75"> Vanilla Syrup
                    <span class="price-add">+$0.75</span>
                  </label>
                </div>
              </div>
  
              <div class="quantity">
                <h3>Quantity</h3>
                <div class="quantity-selector">
                  <button id="decrease-btn">-</button>
                  <input type="number" id="quantity-input" value="1" min="1" max="10">
                  <button id="increase-btn">+</button>
                </div>
              </div>
  
              <div class="total">
                <h3>Total</h3>
                <p id="total-price">$${item.price.toFixed(2)}</p>
              </div>
  
              <button id="add-to-cart-btn" class="primary-btn">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
  
      // Interactivity (price, cart, size, quantity)
      const sizeBtns = this.querySelectorAll('.size-btn');
      const optionCheckboxes = this.querySelectorAll('.option-checkbox input');
      const quantityInput = this.querySelector('#quantity-input');
      const decreaseBtn = this.querySelector('#decrease-btn');
      const increaseBtn = this.querySelector('#increase-btn');
      const totalDisplay = this.querySelector('#total-price');
      const addToCartBtn = this.querySelector('#add-to-cart-btn');
  
      let quantity = 1;
      let sizePrice = 0;
      let optionsPrice = 0;
  
      const updateTotalPrice = () => {
        const base = item.price;
        const total = (base + sizePrice + optionsPrice) * quantity;
        totalDisplay.textContent = `$${total.toFixed(2)}`;
      };
  
      sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          sizeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          sizePrice = parseFloat(btn.dataset.price);
          updateTotalPrice();
        });
      });
  
      optionCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          optionsPrice = 0;
          optionCheckboxes.forEach(opt => {
            if (opt.checked) optionsPrice += parseFloat(opt.dataset.price);
          });
          updateTotalPrice();
        });
      });
  
      increaseBtn.addEventListener('click', () => {
        if (quantity < 10) {
          quantity++;
          quantityInput.value = quantity;
          updateTotalPrice();
        }
      });
  
      decreaseBtn.addEventListener('click', () => {
        if (quantity > 1) {
          quantity--;
          quantityInput.value = quantity;
          updateTotalPrice();
        }
      });
  
      quantityInput.addEventListener('input', () => {
        quantity = Math.max(1, Math.min(10, parseInt(quantityInput.value) || 1));
        quantityInput.value = quantity;
        updateTotalPrice();
      });
  
      addToCartBtn.addEventListener('click', () => {
        const selectedOptions = [];
        optionCheckboxes.forEach(cb => {
          if (cb.checked) selectedOptions.push(cb.name);
        });
  
        const cartItem = {
          id: itemId,
          name: item.name,
          price: item.price,
          size: this.querySelector('.size-btn.active')?.dataset.size,
          sizePrice,
          options: selectedOptions,
          optionsPrice,
          quantity,
          totalPrice: (item.price + sizePrice + optionsPrice) * quantity
        };
  
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
  
        alert(`${item.name} added to cart!`);
      });
    }
  }
  
  customElements.define('menu-item-detail', MenuItemDetail);
  