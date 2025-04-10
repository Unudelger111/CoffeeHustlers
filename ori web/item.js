document.addEventListener('DOMContentLoaded', function() {
    
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    
   
    const items = {
        1: {
            name: 'Espresso',
            description: 'A concentrated shot of coffee with a robust, bold flavor.',
            price: 2.99,
            image: 'images/espresso.jpg'
        },
        2: {
            name: 'Americano',
            description: 'Espresso diluted with hot water, similar strength to coffee but different flavor.',
            price: 3.49,
            image: 'images/americano.jpg'
        },
        3: {
            name: 'Latte',
            description: 'Rich espresso balanced with steamed milk and a light layer of foam.',
            price: 4.29,
            image: 'images/latte.jpg'
        },
        4: {
            name: 'Cappuccino',
            description: 'Equal parts espresso, steamed milk, and milk foam for a perfect balance.',
            price: 4.29,
            image: 'images/cappuccino.jpg'
        },
        5: {
            name: 'Iced Coffee',
            description: 'Chilled coffee served over ice for a refreshing pick-me-up.',
            price: 3.99,
            image: 'images/iced-coffee.jpg'
        },
        6: {
            name: 'Cold Brew',
            description: 'Coffee brewed with cold water over time for a smooth, less acidic taste.',
            price: 4.49,
            image: 'images/cold-brew.jpg'
        },
        7: {
            name: 'Iced Latte',
            description: 'Espresso and cold milk served over ice for a refreshing treat.',
            price: 4.79,
            image: 'images/iced-latte.jpg'
        },
        8: {
            name: 'Mocha',
            description: 'Espresso with steamed milk and chocolate for a decadent drink.',
            price: 4.99,
            image: 'images/mocha.jpg'
        },
        9: {
            name: 'Caramel Macchiato',
            description: 'Vanilla-flavored espresso with caramel drizzle and steamed milk.',
            price: 5.29,
            image: 'images/caramel-macchiato.jpg'
        },
        10: {
            name: 'Croissant',
            description: 'Buttery, flaky pastry that pairs perfectly with coffee.',
            price: 3.49,
            image: 'images/croissant.jpg'
        },
        11: {
            name: 'Blueberry Muffin',
            description: 'Moist muffin packed with juicy blueberries.',
            price: 3.99,
            image: 'images/muffin.jpg'
        }
    };
    
    const item = items[itemId];
    if (item) {
        document.getElementById('item-name').textContent = item.name;
        document.getElementById('item-description').textContent = item.description;
        document.getElementById('item-price').textContent = `$${item.price.toFixed(2)}`;
        document.getElementById('item-img').src = item.image;
        document.getElementById('item-img').alt = item.name;
        document.getElementById('total-price').textContent = `$${item.price.toFixed(2)}`;
        document.title = `Brew Express - ${item.name}`;
    }

    const sizeBtns = document.querySelectorAll('.size-btn');
    let currentSize = 'small';
    let sizePrice = 0;
    
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {

            sizeBtns.forEach(b => b.classList.remove('active'));
       
            this.classList.add('active');

            currentSize = this.getAttribute('data-size');
            sizePrice = parseFloat(this.getAttribute('data-price'));
            
            updateTotalPrice();
        });
    });

    const optionCheckboxes = document.querySelectorAll('.option-checkbox input');
    let optionsPrice = 0;
    
    optionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {

            optionsPrice = 0;
            optionCheckboxes.forEach(cb => {
                if (cb.checked) {
                    optionsPrice += parseFloat(cb.getAttribute('data-price'));
                }
            });
            
            updateTotalPrice();
        });
    });

    const decreaseBtn = document.getElementById('decrease-btn');
    const increaseBtn = document.getElementById('increase-btn');
    const quantityInput = document.getElementById('quantity-input');
    let quantity = 1;
    
    decreaseBtn.addEventListener('click', function() {
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
            updateTotalPrice();
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        if (quantity < 10) {
            quantity++;
            quantityInput.value = quantity;
            updateTotalPrice();
        }
    });
    
    quantityInput.addEventListener('change', function() {
        quantity = parseInt(this.value);
        if (quantity < 1) {
            quantity = 1;
            this.value = 1;
        } else if (quantity > 10) {
            quantity = 10;
            this.value = 10;
        }
        updateTotalPrice();
    });
    
 
    function updateTotalPrice() {
        const basePrice = item.price;
        const total = (basePrice + sizePrice + optionsPrice) * quantity;
        document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
    }
    

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    addToCartBtn.addEventListener('click', function() {

        const selectedOptions = [];
        optionCheckboxes.forEach(cb => {
            if (cb.checked) {
                selectedOptions.push(cb.name);
            }
        });

        const cartItem = {
            id: itemId,
            name: item.name,
            price: item.price,
            size: currentSize,
            sizePrice: sizePrice,
            options: selectedOptions,
            optionsPrice: optionsPrice,
            quantity: quantity,
            totalPrice: (item.price + sizePrice + optionsPrice) * quantity
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartCount();
        

        alert(`${item.name} added to cart!`);
    });
    

    const backBtn = document.getElementById('back-btn');
    
    backBtn.addEventListener('click', function() {
        window.location.href = 'menu.html';
    });
    

    const cartBtn = document.getElementById('cart-btn');
    
    cartBtn.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });
    

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }

    updateCartCount();
});