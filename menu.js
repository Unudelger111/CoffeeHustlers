//category, menu 
document.addEventListener('DOMContentLoaded', function() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuSections = document.querySelectorAll('.menu-section');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));

            this.classList.add('active');

            menuSections.forEach(section => section.classList.add('hidden'));
            
            const categoryId = this.getAttribute('data-category');
            document.getElementById(categoryId).classList.remove('hidden');
        });
    });

    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            window.location.href = `item.html?id=${itemId}`;
        });
    });

    const cartBtn = document.getElementById('cart-btn');
    const historyBtn = document.getElementById('history-btn');
    const branchSelector = document.getElementById('branch-selector');
    const accountBtn = document.getElementById('account-btn');
    
    cartBtn.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });
    
    historyBtn.addEventListener('click', function() {
        window.location.href = 'history.html';
    });
    
    branchSelector.addEventListener('click', function() {
        alert('Branch selection modal would appear here');
    });
    
    accountBtn.addEventListener('click', function() {
        const isLoggedIn = localStorage.getItem('user');
        
        if (isLoggedIn) {
            window.location.href = 'account.html';
        } else {
            window.location.href = 'login.html';
        }
    });
});



