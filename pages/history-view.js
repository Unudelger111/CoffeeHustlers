class HistoryView extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = './history.css';

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="history-container">
        <h2>Your Order History</h2>
        <ul id="history-list"></ul>
      </div>
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);
  }

  connectedCallback() {
    const list = this.shadowRoot.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');

    if (history.length === 0) {
      list.innerHTML = '<li>No orders yet.</li>';
    } else {
      list.innerHTML = history.map(item => `<li>${item}</li>`).join('');
    }
  }
}

customElements.define('history-view', HistoryView);
