
export default class LandingPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    const continueBtn = this.shadowRoot.getElementById('continue-btn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('navigate', {
          bubbles: true,
          composed: true,
          detail: { path: '/menu' }
        }))
      })
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
      }

      body {
        background-color: #f5f0e8;
        color: #4a3520;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .landing-page {
        text-align: center;
        padding: 40px 20px;
      }

      .landing-page h1 {
        font-size: 3.5rem;
        margin-bottom: 10px;
        color: #6f4e37;
      }

      .landing-page p {
        font-size: 1.2rem;
        margin-bottom: 40px;
        color: #8b5a2b;
      }

      button {
        cursor: pointer;
        background-color: #6f4e37;
        color: #fff;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 16px;
        transition: all 0.3s ease;
        margin: 10px;
      }

      button:hover {
        background-color: #8b5a2b;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .primary-btn {
        background-color: #d4a574;
        color: #4a3520;
        font-weight: bold;
      }

      .primary-btn:hover {
        background-color: #c69c6d;
      }

      .button-container {
        margin-top: 30px;
      }

    /* Coffee Animation */
      .cup {
        position: relative;
        width: 220px;
        height: 180px;
        border: 8px solid #ffefdb;
        box-shadow: 0 0 0 12px #352a22;
        border-radius: 10px 10px 60px 75px;
        background: url('../images/coffee.png');
        background-repeat: repeat-x;
        background-position: 0 130px;
        animation: filling 4s infinite;
      }

      @keyframes filling {
        0%, 100% {
          background-position: 0 130px;
        }

        50% {
          background-position: 600px -70px;
        }
      }

      .cup .cup-handle {
        position: absolute;
        top: 10px;
        right: -74px;
        width: 65px;
        height: 120px;
        border: 12px solid #352a22;
        border-radius: 20px 10px 50px 20px;
      }

      .cup .steam {
        position: absolute;
        border-radius: 10px 2px;
        width: 8px;
        animation: steaming 2s infinite;
      }

      @keyframes steaming {
        0%, 100% {
          opacity: 0;
        }

        50% {
          opacity: 1;
          filter: blur(.8px);
          transform: translateY(-10px);
        }
      }

      .cup .steam:nth-child(1) {
        top: -70px;
        left: 65px;
        height: 30px;
        background: #8e5a3423;
        animation-delay: .2s;
      }

      .cup .steam:nth-child(2) {
        top: -120px;
        left: 95px;
        height: 50px;
        background: #8e5a3454;
        animation-delay: .6s;
      }

      .cup .steam:nth-child(3) {
        top: -90px;
        left: 125px;
        height: 40px;
        background: #8e5a3433;
        animation-delay: 1s;
      }
      .cup-container {
        height: 40vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      </style>
      <div class="container">
          <div class="landing-page">
              <h1>Coffee Hustlers</h1>
              <p>Pre-order your coffee NOW.</p>
              
              <div class="cup-container">
                  <div class="cup">
                      <div class="cup-handle"></div>
                      <div class="steam"></div>
                      <div class="steam"></div>
                      <div class="steam"></div>
                  </div>
              </div>
              
              <div class="button-container">
                  <button id="continue-btn" class="primary-btn">Continue</button>
              </div>
          </div>
      </div>
    `
  }
}
customElements.define('landing-page', LandingPage);
