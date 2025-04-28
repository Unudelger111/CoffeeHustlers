class CartComponent extends HTMLElement {
  connectedCallback() {
    this.render();
    this.updateCartCount();
  }

  getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  updateCart(items) {
    localStorage.setItem('cart', JSON.stringify(items));
    this.render();
    this.updateCartCount();
  }

  updateCartCount() {
    // Update the cart count in the header
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      const cartItems = this.getCartItems();
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      cartCountElement.textContent = totalItems;
    }
  }

  render() {
    const cartItems = this.getCartItems();
    let total = 0;

    const itemsHTML = cartItems.map((item, index) => {
      total += item.price * item.quantity;
      return `
        <div class="cart-item">
          <div class="item-image">
        <img src="${item.image || 'images/default-coffee.jpg'}" alt="${item.name}">
          </div>
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-options">${item.options ? item.options.join(', ') : ''}</div>
          </div>
          <div class="item-quantity">
            <button data-index="${index}" class="quantity-btn minus">-</button>
            <span>${item.quantity}</span>
            <button data-index="${index}" class="quantity-btn plus">+</button>
          </div>
          <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          <button data-index="${index}" class="remove-btn"><i class="fas fa-trash"></i></button>
        </div>
      `;
    }).join('');

    this.innerHTML = `
      <style>
        .cart-wrapper {
          padding: 20px;
          background: #fff;
          max-width: 800px;
          margin: 20px auto;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .cart-title {
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
          color: #BF754B;
        }
        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }
        .item-image {
          width: 80px;
          height: 80px;
          overflow: hidden;
          border-radius: 8px;
          margin-right: 15px;
        }
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-details {
          flex: 2;
        }
        .item-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .item-options {
          font-size: 14px;
          color: #777;
        }
        .item-quantity {
          display: flex;
          align-items: center;
          margin: 0 15px;
        }
        .quantity-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: #f8f8f8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quantity-btn:hover {
          background: #eee;
        }
        .item-quantity span {
          margin: 0 10px;
        }
        .item-price {
          font-weight: bold;
          width: 80px;
          text-align: right;
        }
        .remove-btn {
          color: #ff6b6b;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 10px;
        }
        .remove-btn:hover {
          color: #ff3e3e;
        }
        .cart-total {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 2px solid #eee;
          font-size: 18px;
        }
        .checkout-btn {
          display: block;
          margin: 20px auto 0;
          padding: 12px 25px;
          background: #BF754B;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s;
        }
        .checkout-btn:hover {
          background: #A35A3A;
        }
        .empty-cart {
          text-align: center;
          padding: 30px 0;
          color: #777;
        }
      </style>
      <div class="cart-wrapper">
        <div class="cart-title">Таны сагс</div>
        ${cartItems.length ? itemsHTML : '<div class="empty-cart"><i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 15px;"></i><p>Сагс хоосон байна</p></div>'}
        ${cartItems.length ? `<div class="cart-total"><strong>Нийт: $${total.toFixed(2)}</strong></div>` : ''}
        ${cartItems.length ? '<button class="checkout-btn">Захиалга хийх</button>' : ''}
      </div>
    `;

    this.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        cartItems.splice(index, 1);
        this.updateCart(cartItems);
      });
    });

    this.querySelectorAll('.quantity-btn.minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity -= 1;
          this.updateCart(cartItems);
        }
      });
    });

    this.querySelectorAll('.quantity-btn.plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        cartItems[index].quantity += 1;
        this.updateCart(cartItems);
      });
    });

    this.querySelector('.checkout-btn')?.addEventListener('click', () => {
      alert('Захиалга баталгаажлаа!');
      // Clear cart after checkout
      this.updateCart([]);
    });
  }
}

customElements.define('cart-component', CartComponent);