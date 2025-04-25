document.addEventListener('DOMContentLoaded', function() {
    const shopSelectorBtn = document.getElementById('shop-selector-btn');
    const continueBtn = document.getElementById('continue-btn');

    shopSelectorBtn.addEventListener('click', function() {
 
        alert('Shop selection modal would appear here');
    });

    continueBtn.addEventListener('click', function() {
        window.location.href = 'menu_final_routed.html';
    });
});