document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = checkLoginStatus();
    
    if (!isLoggedIn) {
        // User is not logged in, show login prompt and redirect
        redirectToLogin();
    } else {
        // User is logged in, fetch and display previous orders
        loadPreviousOrders();
    }
});

// Function to check if user is logged in
function checkLoginStatus() {
    // In a real application, this would check cookies, localStorage, or a session
    // For demonstration, we'll use localStorage
    return localStorage.getItem('coffeeHustlersLoggedIn') === 'true';
}

// Function to redirect to login page with a message
function redirectToLogin() {
    const ordersContainer = document.getElementById('previous-orders');
    
    // Clear loading message
    ordersContainer.innerHTML = `
        <div class="login-prompt">
            <h3>Please Log In to View Your Order History</h3>
            <p>You need to be logged in to view and reorder from your order history.</p>
            <a href="login.html" class="login-btn">Log In</a>
        </div>
    `;
    
    // Could also use a direct redirect after a short delay:
    // setTimeout(() => {
    //     window.location.href = 'login.html?redirect=reorder.html';
    // }, 3000);
}

// Function to load previous orders
function loadPreviousOrders() {
    const ordersContainer = document.getElementById('previous-orders');
    
    // In a real application, you would fetch this data from a server
    // For demonstration, we'll use mock data
    setTimeout(() => {
        const previousOrders = getMockOrders();
        
        if (previousOrders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="no-orders">
                    <h3>No Previous Orders Found</h3>
                    <p>You haven't placed any orders yet. Browse our menu to place your first order!</p>
                    <a href="menu.html" class="reorder-btn">Go to Menu</a>
                </div>
            `;
            return;
        }
        
        // Clear loading message
        ordersContainer.innerHTML = '';
        
        // Add each order to the container
        previousOrders.forEach(order => {
            const orderCard = createOrderCard(order);
            ordersContainer.appendChild(orderCard);
        });
    }, 1000); // Simulate network delay
}

// Function to create an order card element
function createOrderCard(order) {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    
    // Format the date
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Create header with date and total
    const orderHeader = document.createElement('div');
    orderHeader.className = 'order-header';
    orderHeader.innerHTML = `
        <div class="order-date">${formattedDate}</div>
        <div class="order-total">Total: $${order.total.toFixed(2)}</div>
    `;
    
    // Create items section
    const orderItems = document.createElement('div');
    orderItems.className = 'order-items';
    
    order.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <div class="item-price">$${item.price.toFixed(2)}</div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
            </div>
        `;
        orderItems.appendChild(itemElement);
    });
    
    // Create actions section
    const orderActions = document.createElement('div');
    orderActions.className = 'order-actions';
    orderActions.innerHTML = `
        <button class="details-btn" data-order-id="${order.id}">Order Details</button>
        <button class="reorder-btn" data-order-id="${order.id}">Reorder</button>
    `;
    
    // Add event listeners for buttons
    orderActions.querySelector('.reorder-btn').addEventListener('click', function() {
        reorderItems(order);
    });
    
    orderActions.querySelector('.details-btn').addEventListener('click', function() {
        viewOrderDetails(order.id);
    });
    
    // Assemble the card
    orderCard.appendChild(orderHeader);
    orderCard.appendChild(orderItems);
    orderCard.appendChild(orderActions);
    
    return orderCard;
}

// Function to handle reordering
function reorderItems(order) {
    // In a real application, this would add all items to cart
    alert(`Items from order #${order.id} have been added to your cart!`);
    
    // Mock adding items to cart
    let currentCount = parseInt(document.getElementById('cart-count').textContent);
    document.getElementById('cart-count').textContent = currentCount + order.items.length;
    
    // Redirect to cart page
    // window.location.href = 'cart.html';
}

// Function to view order details
function viewOrderDetails(orderId) {
    // In a real application, this would navigate to an order details page
    alert(`Viewing details for order #${orderId}`);
    // window.location.href = `order-details.html?id=${orderId}`;
}

// Function to get mock order data
function getMockOrders() {
    return [
        {
            id: '1001',
            date: '2025-03-15T10:30:00',
            total: 12.77,
            items: [
                {
                    id: 3,
                    name: 'Latte',
                    price: 4.29,
                    quantity: 1,
                    image: 'images/latte.jpg'
                },
                {
                    id: 10,
                    name: 'Milk Cake',
                    price: 3.49,
                    quantity: 1,
                    image: 'images/milk-cake.jpg'
                },
                {
                    id: 11,
                    name: 'Hotdog Pretzel',
                    price: 3.99,
                    quantity: 1,
                    image: 'images/hotdog.jpg'
                }
            ]
        },
        {
            id: '982',
            date: '2025-03-10T15:45:00',
            total: 9.98,
            items: [
                {
                    id: 8,
                    name: 'Mocha',
                    price: 4.99,
                    quantity: 1,
                    image: 'images/mocha.jpg'
                },
                {
                    id: 8,
                    name: 'Mocha',
                    price: 4.99,
                    quantity: 1,
                    image: 'images/mocha.jpg'
                }
            ]
        },
        {
            id: '875',
            date: '2025-03-01T08:15:00',
            total: 10.77,
            items: [
                {
                    id: 2,
                    name: 'Americano',
                    price: 3.49,
                    quantity: 1,
                    image: 'images/americano.jpg'
                },
                {
                    id: 5,
                    name: 'Iced Coffee',
                    price: 3.99,
                    quantity: 1,
                    image: 'images/iced-coffee.jpg'
                },
                {
                    id: 12,
                    name: 'Chocolate bread',
                    price: 3.29,
                    quantity: 1,
                    image: 'images/chocolate-bread.jpg'
                }
            ]
        }
    ];
}