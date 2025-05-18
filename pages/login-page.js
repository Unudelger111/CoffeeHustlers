/**
 * @class LoginPage
 * Custom login page component that handles login and signup
 */
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

      .error-message {
          color: #e74c3c;
          font-size: 0.9rem;
          margin-top: 5px;
          text-align: center;
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
  `;

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
                  <div class="error-message" id="login-error"></div>
                  
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
                      <label for="signup-phone">Phone Number</label>
                      <input type="text" id="signup-phone" required>
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
                  <div class="error-message" id="signup-error"></div>
                  
                  <div class="alt-auth">
                      <p>Already have an account? <a href="#" id="go-to-login">Login</a></p>
                  </div>
              </form>
          </div>
      </div>
    `;
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

    // Login form submit handler
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = this.shadowRoot.getElementById('login-email').value;
      const password = this.shadowRoot.getElementById('login-password').value;
      const errorElement = this.shadowRoot.getElementById('login-error');
      
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          const responseText = await response.text();
          let errorMsg = 'Login failed';
          
          try {
            // Try to parse as JSON
            const errorData = JSON.parse(responseText);
            errorMsg = errorData.message || errorMsg;
          } catch (parseError) {
            // If parsing fails, use the text directly
            errorMsg = responseText || errorMsg;
          }
          
          throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log('Logged in:', data);

        if (data.token) {
          localStorage.setItem('token', data.token);
          
          // Store user data for dropdown display
          const userData = {
            name: data.user?.name || 'Coffee Lover',
            email: email,
            id: data.user?.id
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Dispatch login event for header to update
          const loginEvent = new CustomEvent('user-logged-in', {
            bubbles: true,
            composed: true,
            detail: { userData }
          });
          this.dispatchEvent(loginEvent);
        }

        // Show success message
        errorElement.textContent = 'Logged in successfully!';
        errorElement.style.color = '#2ecc71';

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/menu';
        }, 1000);
      } catch (err) {
        console.error(err);
        errorElement.textContent = 'Login failed: ' + err.message;
        errorElement.style.color = '#e74c3c';
      }
    });

    // Signup form submit handler
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = this.shadowRoot.getElementById('signup-name').value;
      const email = this.shadowRoot.getElementById('signup-email').value;
      const phone = this.shadowRoot.getElementById('signup-phone').value;
      const password = this.shadowRoot.getElementById('signup-password').value;
      const confirm = this.shadowRoot.getElementById('signup-confirm').value;
      const errorElement = this.shadowRoot.getElementById('signup-error');
      
      // Client-side validation
      if (password !== confirm) {
        errorElement.textContent = 'Passwords do not match!';
        return;
      }
      
      // Prepare the user data - match exact order from Swagger UI example
      const userData = {
        password,
        role: "Customer",
        phone,
        name,
        email
      };
      
      console.log('Attempting to register with data:', JSON.stringify(userData));
      
      try {
        // Show a pending message
        errorElement.textContent = 'Creating account...';
        errorElement.style.color = '#3498db';
        
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          },
          body: JSON.stringify(userData),
          // Add these options to help with potential CORS issues
          mode: 'cors',
          credentials: 'same-origin'
        });

        console.log('Registration response status:', response.status, response.statusText);
        
        // Get the raw response for debugging
        let responseText;
        try {
          responseText = await response.text();
          console.log('Raw server response:', responseText);
        } catch (textError) {
          console.error('Error getting response text:', textError);
        }
        
        // If not OK status, handle the error
        if (!response.ok) {
          let errorMsg = 'Registration failed';
          
          if (responseText) {
            try {
              // Try to parse as JSON
              const errorData = JSON.parse(responseText);
              errorMsg = errorData.message || errorMsg;
              
              // Check if we have detailed validation errors
              if (errorData.errors && Array.isArray(errorData.errors)) {
                errorMsg = errorData.errors.map(err => err.message || err).join(', ');
              }
            } catch (parseError) {
              // If parsing fails, use the text directly
              errorMsg = responseText || errorMsg;
            }
          }
          
          throw new Error(errorMsg);
        }

        // Try to parse the success response
        let data;
        try {
          data = responseText ? JSON.parse(responseText) : { success: true };
          console.log('Registered successfully:', data);
        } catch (parseError) {
          console.log('Response is not JSON but registration appears successful');
          data = { success: true };
        }
        
        // Show success message
        errorElement.textContent = 'Account created successfully!';
        errorElement.style.color = '#2ecc71';
        
        // Clear form fields
        this.shadowRoot.getElementById('signup-name').value = '';
        this.shadowRoot.getElementById('signup-email').value = '';
        this.shadowRoot.getElementById('signup-phone').value = '';
        this.shadowRoot.getElementById('signup-password').value = '';
        this.shadowRoot.getElementById('signup-confirm').value = '';
        
        // Switch to login after short delay
        setTimeout(() => {
          this.switchToLogin();
        }, 1500);
      } catch (err) {
        console.error('Registration error:', err);
        errorElement.textContent = 'Registration failed: ' + err.message;
        errorElement.style.color = '#e74c3c';
      }
    });
  }

  switchToLogin() {
    const loginTab = this.shadowRoot.getElementById('login-tab');
    const signupTab = this.shadowRoot.getElementById('signup-tab');
    const loginForm = this.shadowRoot.getElementById('login-form');
    const signupForm = this.shadowRoot.getElementById('signup-form');
    const loginError = this.shadowRoot.getElementById('login-error');
    
    // Clear any error messages
    loginError.textContent = '';

    // Update tab buttons
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    
    // Update forms visibility
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  switchToSignup() {
    const loginTab = this.shadowRoot.getElementById('login-tab');
    const signupTab = this.shadowRoot.getElementById('signup-tab');
    const loginForm = this.shadowRoot.getElementById('login-form');
    const signupForm = this.shadowRoot.getElementById('signup-form');
    const signupError = this.shadowRoot.getElementById('signup-error');
    
    // Clear any error messages
    signupError.textContent = '';

    // Update tab buttons
    loginTab.classList.remove('active');
    signupTab.classList.add('active');
    
    // Update forms visibility
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  }
}

customElements.define('login-page', LoginPage);