export default class ReorderPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .reorder-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }
      </style>
      <div class="reorder-container">
        <h1>Re-order Your Previous Items</h1>
        <div id="previous-orders"></div>
      </div>
    `;
    this.loadPreviousOrders();
  }

  loadPreviousOrders() {

    const previousOrders = JSON.parse(localStorage.getItem('previousOrders') || '[]');
    const ordersContainer = this.shadowRoot.getElementById('previous-orders');

    if (previousOrders.length === 0) {
      ordersContainer.innerHTML = `<p>No previous orders found.</p>`;
    } else {
      previousOrders.forEach(order => {
        const itemCard = document.createElement('item-card');
        itemCard.order = order; 
        ordersContainer.appendChild(itemCard);
      });
    }
  }
}

customElements.define('reorder-page', ReorderPage);