const orders = [
    {
        name: "Cappuccino",
        date: "2025-04-06",
        status: "Delivered"
    },
];

const orderList = document.getElementById('orderList');

orders.forEach(order => {
    const div = document.createElement('div');
    div.className = 'order-item';

    div.innerHTML = `
        <h3>${order.name}</h3>
        <p><strong>Date:</strong> ${order.date}</p>
        <p class="status"><strong>Status:</strong> ${order.status}</p>
    `;

    orderList.appendChild(div);
});
