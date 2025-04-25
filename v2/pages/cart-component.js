class CartComponent extends HTMLElement {
    connectedCallback() {
      this.render();
    }
  
    getCartItems() {
      return JSON.parse(localStorage.getItem('cart')) || [];
    }
  
    updateCart(items) {
      localStorage.setItem('cart', JSON.stringify(items));
      this.render();
    }
  
    render() {
      const cartItems = this.getCartItems();
      let total = 0;
  
      const itemsHTML = cartItems.map((item, index) => {
        total += item.price * item.quantity;
        return `
          <div class="cart-item">
            <span class="item-name">${item.name}</span>
            <span class="item-qty-price">${item.quantity} x $${item.price}</span>
            <button data-index="${index}" class="remove-btn">Remove</button>
          </div>
        `;
      }).join('');
  
      this.innerHTML = `
        <style>
          .cart-wrapper {
            padding: 20px;
            background: #fff;
            max-width: 700px;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .cart-title {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
          }
          .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .cart-total {
            text-align: right;
            font-size: 18px;
            margin-top: 20px;
          }
          .checkout-btn {
            display: block;
            margin: 20px auto 0;
            padding: 10px 15px;
            background: #BF754B;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          .checkout-btn:hover {
            background: #A35A3A;
          }
        </style>
        <div class="cart-wrapper">
          <div class="cart-title">Таны сагс</div>
          ${itemsHTML || '<p>Сагс хоосон байна</p>'}
          <div class="cart-total"><strong>Нийт: $${total.toFixed(2)}</strong></div>
          ${cartItems.length ? '<button class="checkout-btn">Захиалга хийх</button>' : ''}
        </div>
      `;
  
      this.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          cartItems.splice(index, 1);
          this.updateCart(cartItems);
        });
      });
  
      this.querySelector('.checkout-btn')?.addEventListener('click', () => {
        alert('Захиалга баталгаажлаа!');
      });
    }
  }
  
  customElements.define('cart-component', CartComponent);