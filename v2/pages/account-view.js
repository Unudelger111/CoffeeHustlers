class AccountView extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <style>@import url('login.css');</style>
        
        <a href="menu.html" class="go-back-btn">← Back</a>
  
        <div class="container">
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
      `;
  
      this.setupListeners();
    }
  
    setupListeners() {
      // Toggle between login and signup forms
      const loginTab = this.querySelector('#login-tab');
      const signupTab = this.querySelector('#signup-tab');
      const loginForm = this.querySelector('#login-form');
      const signupForm = this.querySelector('#signup-form');
      const goToSignup = this.querySelector('#go-to-signup');
      const goToLogin = this.querySelector('#go-to-login');
  
      // Show login form when Login tab is clicked
      loginTab.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
      });
  
      // Show signup form when Sign Up tab is clicked
      signupTab.addEventListener('click', () => {
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
      });
  
      // Switch to signup form from login form
      goToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
      });
  
      // Switch to login form from signup form
      goToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
      });
  
      // Handle form submission (could be extended to connect to backend)
      this.querySelector('#login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Logging in...');
        // Handle login logic here
      });
  
      this.querySelector('#signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Creating account...');
        // Handle signup logic here
      });
    }
  }
  
  customElements.define('account-view', AccountView);
  