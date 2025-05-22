export default class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); //shadowDOM uchir n tusgaarlsn styles css
    this.render(); //tovchluuraa render hiine
  }

  connectedCallback() {
    const toggleButton = this.shadowRoot.querySelector('.theme-toggle-button'); //tovchluur
    this.updateCSSVariables(); //css iin uurchlultuudig update hiine
    window.addEventListener('theme-changed', () => this.updateCSSVariables()); //theme uurchlultuudig sonsoh
    
    //huuudsaa load hiihed ali theme ee ashiglah ve gdge shiidn
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark-mode');
      toggleButton.classList.add('dark');
      this.dispatchThemeEvent('dark');
    } else if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.remove('dark-mode');
      toggleButton.classList.remove('dark');
      this.dispatchThemeEvent('light');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark-mode');
        toggleButton.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        this.dispatchThemeEvent('dark');
      }
    }
    //tovchluur deer click hiihad theme iig uurchluh
    toggleButton.addEventListener('click', () => {
      if (toggleButton.classList.contains('dark')) {
        document.documentElement.classList.remove('dark-mode');
        toggleButton.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        this.dispatchThemeEvent('light');
      } else {
        document.documentElement.classList.add('dark-mode');
        toggleButton.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        this.dispatchThemeEvent('dark');
      }
      this.updateCSSVariables();
    });
  }

  updateCSSVariables() {
    const rootStyles = getComputedStyle(document.documentElement); //root iin styles iig avna
    const host = this.shadowRoot.host;
    //custom property
    host.style.setProperty('--theme-toggle-light-bg', rootStyles.getPropertyValue('--button-bg'));
    host.style.setProperty('--theme-toggle-light-text', rootStyles.getPropertyValue('--button-text'));
    host.style.setProperty('--theme-toggle-dark-bg', rootStyles.getPropertyValue('--primary-button-bg'));
    host.style.setProperty('--theme-toggle-dark-text', rootStyles.getPropertyValue('--primary-button-text'));
    host.style.setProperty('--theme-toggle-shadow', rootStyles.getPropertyValue('--shadow-color'));
    host.style.setProperty('--theme-toggle-border', rootStyles.getPropertyValue('--border-color'));
    host.style.setProperty('--theme-toggle-secondary', rootStyles.getPropertyValue('--secondary-color'));
  }

  //tsaashaa dispatch
  dispatchThemeEvent(theme) {
    const event = new CustomEvent('theme-changed', {
      detail: { theme }
    });

    window.dispatchEvent(event);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --theme-toggle-light-bg: var(--button-bg, #8b6e4e);
          --theme-toggle-light-text: var(--button-text, #fff);
          --theme-toggle-dark-bg: var(--primary-button-bg, #c89f7c);
          --theme-toggle-dark-text: var(--primary-button-text, #3c2f24);
          --theme-toggle-shadow: var(--shadow-color, rgba(109, 82, 60, 0.15));
          --theme-toggle-border: var(--border-color, #8b6e4e);
          --theme-toggle-secondary: var(--secondary-color, #a67c52);
        }

        .theme-toggle-container {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }

        .theme-toggle-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--theme-toggle-light-bg);
          color: var(--theme-toggle-light-text);
          box-shadow: 0 3px 8px var(--theme-toggle-shadow);
          border: 2px solid var(--theme-toggle-border);
          transition: var(--transition, all 0.3s ease);
          position: relative;
          overflow: hidden;
        }

        .theme-toggle-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 12px var(--theme-toggle-shadow);
          background-color: var(--theme-toggle-secondary);
        }
        
        .theme-toggle-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px var(--theme-toggle-shadow);
        }

        .theme-toggle-button.dark {
          background-color: var(--theme-toggle-dark-bg);
          color: var(--theme-toggle-dark-text);
          border-color: var(--theme-toggle-border);
          box-shadow: 0 3px 8px var(--theme-toggle-shadow);
        }

        .theme-toggle-button.dark:hover {
          background-color: var(--theme-toggle-secondary);
          box-shadow: 0 5px 12px var(--theme-toggle-shadow);
        }

        .light-icon, .dark-icon {
          font-size: 24px;
          position: absolute;
          transition: all 0.3s ease;
        }

        .light-icon {
          opacity: 1;
          transform: translateY(0);
        }

        .dark-icon {
          opacity: 0;
          transform: translateY(20px);
        }

        .theme-toggle-button.dark .light-icon {
          opacity: 0;
          transform: translateY(-20px);
        }

        .theme-toggle-button.dark .dark-icon {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .theme-toggle-container {
            position: relative;
            top: 0;
            right: 0;
            display: flex;
            justify-content: center;
            margin: 15px auto;
          }
        }
      </style>

      <div class="theme-toggle-container">
        <button class="theme-toggle-button" aria-label="Toggle theme">
          <span class="light-icon">☀️</span>
          <span class="dark-icon">🌙</span>
        </button>
      </div>
    `;
  }
}

customElements.define('theme-toggle', ThemeToggle);