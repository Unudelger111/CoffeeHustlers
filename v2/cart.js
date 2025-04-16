document.addEventListener('DOMContentLoaded', function () {
   
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartContainer = document.getElementById('empty-cart');
    const cartSummaryContainer = document.getElementById('cart-summary');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const cartCountElement = document.getElementById('cart-count'); 

    const backBtn = document.getElementById('back-btn');
    const browseMenuBtn = document.getElementById('browse-menu-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

   
    let cart = [];

    function isCartEmpty() {
        return cart.length === 0;
    }

    function formatPrice(price) {
        return '$' + price.toFixed(2);
    }


    function calculateTotals() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; 
        const total = subtotal + tax;

        subtotalElement.textContent = formatPrice(subtotal);
        taxElement.textContent = formatPrice(tax);
        totalElement.textContent = formatPrice(total);
    }


    function updateCartCountDisplay() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }


    function renderCartItems() {
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='img/default-coffee.jpg'">
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-size">${item.size}</div>
                    <div class="item-options">${item.options || 'No special instructions'}</div>
                </div>
                <div class="item-quantity">x${item.quantity}</div>
                <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
                <button class="remove-btn" data-id="${item.id}">×</button>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function () {
                const itemId = parseInt(this.getAttribute('data-id'));
                removeFromCart(itemId);
            });
        });
    }


    function updateCartUI() {
        if (isCartEmpty()) {
            cartItemsContainer.classList.add('hidden');
            cartSummaryContainer.classList.add('hidden');
            emptyCartContainer.classList.remove('hidden');
        } else {
            cartItemsContainer.classList.remove('hidden');
            cartSummaryContainer.classList.remove('hidden');
            emptyCartContainer.classList.add('hidden');
            renderCartItems();
            calculateTotals();
        }
        updateCartCountDisplay();
    }


    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCartUI();
    }

    function clearCart() {
        cart = [];
        updateCartUI();
    }


    function goToMenu() {
        window.location.href = 'menu.html';
    }


    function goToCheckout() {
        window.location.href = 'checkout.html';
    }


    backBtn.addEventListener('click', goToMenu);
    browseMenuBtn.addEventListener('click', goToMenu);
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', goToCheckout);

    updateCartUI();
});
