export default class LoginPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
    this.setupEventListeners();
  }

  styleSheet = `
    <style>
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
      }
      .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          position: relative;
      }

      .hidden {
          display: none !important;
      }

      .go-back-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          text-decoration: none;
          font-size: 14px;
          background-color: #333;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          transition: background-color 0.3s ease;
          z-index: 10;
      }

      .go-back-btn:hover {
          background-color: #d4a574;
      }



      .coffee-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #6f4e37 0%, #8b5a2b 100%);
          opacity: 0.1;
          z-index: -1;
      }

      .coffee-bg::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
              radial-gradient(circle at 20% 30%, #d4a574 1%, transparent 2%),
              radial-gradient(circle at 80% 20%, #d4a574 1%, transparent 2%),
              radial-gradient(circle at 40% 70%, #d4a574 1%, transparent 2%),
              radial-gradient(circle at 60% 50%, #d4a574 1%, transparent 2%),
              radial-gradient(circle at 10% 60%, #d4a574 1%, transparent 2%),
              radial-gradient(circle at 90% 90%, #d4a574 1%, transparent 2%);
          background-size: 300% 300%;
          animation: steamBubbles 15s ease infinite;
      }

      @keyframes steamBubbles {
          0%, 100% {
              background-position: 0% 0%;
          }
          25% {
              background-position: 100% 0%;
          }
          50% {
              background-position: 100% 100%;
          }
          75% {
              background-position: 0% 100%;
          }
      }


      .auth-container {
          background-color: #fff;
          width: 90%;
          max-width: 450px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          padding: 30px;
          position: relative;
      }

      .auth-container::before {
          content: "";
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 100px;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%);
          filter: blur(5px);
          opacity: 0.7;
          animation: steam 3s ease-in-out infinite;
          z-index: 1;
      }

      @keyframes steam {
          0% {
              transform: translateX(-50%) translateY(0) scale(1);
              opacity: 0.7;
          }
          100% {
              transform: translateX(-50%) translateY(-100px) scale(1.5);
              opacity: 0;
          }
      }


      .auth-header {
          text-align: center;
          margin-bottom: 30px;
      }

      .auth-header h1 {
          color: #6f4e37;
          margin-bottom: 20px;
          font-size: 2rem;
      }


      .auth-tabs {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
      }

      .tab-btn {
          background: none;
          border: none;
          color: #8b5a2b;
          font-size: 1rem;
          cursor: pointer;
          padding: 10px 20px;
          border-radius: 20px;
          transition: all 0.3s ease;
      }

      .tab-btn.active {
          background-color: #6f4e37;
          color: #fff;
      }

      .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
      }

      .input-group {
          position: relative;
      }

      .input-group label {
          display: block;
          margin-bottom: 8px;
          color: #6f4e37;
          font-weight: 500;
      }

      .input-group input {
          width: 100%;
          padding: 12px 40px 12px 15px;
          border: 2px solid #e9e1d9;
          border-radius: 25px;
          font-size: 1rem;
          color: #4a3520;
          transition: all 0.3s ease;
      }

      .input-group input:focus {
          outline: none;
          border-color: #d4a574;
          box-shadow: 0 0 0 2px rgba(212, 165, 116, 0.2);
      }

      .coffee-icon {
          position: absolute;
          right: 15px;
          bottom: 12px;
          font-size: 1.2rem;
      }


      .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
      }

      .remember-me {
          display: flex;
          align-items: center;
          gap: 5px;
      }

      .forgot-password {
          color: #6f4e37;
          text-decoration: none;
      }

      .forgot-password:hover {
          text-decoration: underline;
      }


      .auth-btn {
          background-color: #6f4e37;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 25px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
      }

      .auth-btn:hover {
          background-color: #8b5a2b;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .alt-auth {
          text-align: center;
          font-size: 0.9rem;
      }

      .alt-auth a {
          color: #6f4e37;
          text-decoration: none;
          font-weight: 600;
      }

      .alt-auth a:hover {
          text-decoration: underline;
      }


      @media (max-width: 480px) {
          .auth-container {
              padding: 20px;
          }
          
          .auth-header h1 {
              font-size: 1.8rem;
          }
          
          .form-footer {
              flex-direction: column;
              gap: 10px;
              align-items: flex-start;
          }
      }
    </style>
  `

  render() {
    this.shadowRoot.innerHTML = `
      ${this.styleSheet}
      <div class="container">
        <a data-link href="menu" class="go-back-btn">← Back</a>
          <div class="coffee-bg"></div>
          <div class="auth-container">
              <div class="auth-header">
                  <h1>Coffee Hustlers</h1>
                  <div class="auth-tabs">
                      <button class="tab-btn active" id="login-tab">Login</button>
                      <button class="tab-btn" id="signup-tab">Sign Up</button>
                  </div>
              </div>
              
              <!-- Login Form -->
              <form id="login-form" class="auth-form">
                  <div class="input-group">
                      <label for="login-email">Email</label>
                      <input type="email" id="login-email" required>
                      <span class="coffee-icon">☕</span>
                  </div>
                  
                  <div class="input-group">
                      <label for="login-password">Password</label>
                      <input type="password" id="login-password" required>
                      <span class="coffee-icon">☕</span>
                  </div>
                  
                  <div class="form-footer">
                      <div class="remember-me">
                          <input type="checkbox" id="remember">
                          <label for="remember">Remember me</label>
                      </div>
                      <a href="#" class="forgot-password">Forgot Password?</a>
                  </div>
                  
                  <button type="submit" class="auth-btn">Login</button>
                  
                  <div class="alt-auth">
                      <p>Don't have an account? <a href="#" id="go-to-signup">Sign up</a></p>
                  </div>
              </form>
              
              <!-- Signup Form -->
              <form id="signup-form" class="auth-form hidden">
                  <div class="input-group">
                      <label for="signup-name">Full Name</label>
                      <input type="text" id="signup-name" required>
                      <span class="coffee-icon">☕</span>
                  </div>
                  
                  <div class="input-group">
                      <label for="signup-email">Email</label>
                      <input type="email" id="signup-email" required>
                      <span class="coffee-icon">☕</span>
                  </div>
                  
                  <div class="input-group">
                      <label for="signup-password">Password</label>
                      <input type="password" id="signup-password" required>
                      <span class="coffee-icon">☕</span>
                  </div>
                  
                  <div class="input-group">
                      <label for="signup-confirm">Confirm Password</label>
                      <input type="password" id="signup-confirm" required>
                      <span class="coffee-icon">☕</span>
                  </div>
                  
                  <button type="submit" class="auth-btn">Create Account</button>
                  
                  <div class="alt-auth">
                      <p>Already have an account? <a href="#" id="go-to-login">Login</a></p>
                  </div>
              </form>
          </div>
      </div>
    `
  }

  setupEventListeners() {
    // Get tab buttons
    const loginTab = this.shadowRoot.getElementById('login-tab');
    const signupTab = this.shadowRoot.getElementById('signup-tab');
    
    // Get forms
    const loginForm = this.shadowRoot.getElementById('login-form');
    const signupForm = this.shadowRoot.getElementById('signup-form');
    
    // Get link buttons within forms
    const goToSignup = this.shadowRoot.getElementById('go-to-signup');
    const goToLogin = this.shadowRoot.getElementById('go-to-login');

    // Tab button click handlers
    loginTab.addEventListener('click', () => {
      this.switchToLogin();
    });

    signupTab.addEventListener('click', () => {
      this.switchToSignup();
    });

    // Link buttons click handlers
    goToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchToSignup();
    });

    goToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchToLogin();
    });

    // Form submit handlers
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Here you would add the actual login logic
      console.log('Login form submitted');
    });

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Here you would add the actual signup logic
      console.log('Signup form submitted');
    });
  }

  switchToLogin() {
    const loginTab = this.shadowRoot.getElementById('login-tab');
    const signupTab = this.shadowRoot.getElementById('signup-tab');
    const loginForm = this.shadowRoot.getElementById('login-form');
    const signupForm = this.shadowRoot.getElementById('signup-form');

    // Update tab buttons
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    
    // Update forms visibility
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  }

  switchToSignup() {
    const loginTab = this.shadowRoot.getElementById('login-tab');
    const signupTab = this.shadowRoot.getElementById('signup-tab');
    const loginForm = this.shadowRoot.getElementById('login-form');
    const signupForm = this.shadowRoot.getElementById('signup-form');

    // Update tab buttons
    loginTab.classList.remove('active');
    signupTab.classList.add('active');
    
    // Update forms visibility
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  }
}

customElements.define('login-page', LoginPage);
