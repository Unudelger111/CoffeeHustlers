export default class Footer extends HTMLElement {   //class aa zarlaj bga
  constructor() {
    super();  //Parent baiguulagch duudna
    this.attachShadow({ mode: "open" }); //Shadow DOM-iig zarlaj bga
    this.render(); //Customer method-iig duudna. Ene ni Shadow DOM-iig HTML CSS-eer duurgej bga
  }

  styleSheet = `
    <style>
      footer {
          background-color: #333;   //ariin ungu
          color: white;             // textiin ungu
          padding: 30px 0 15px;     //deereesee 30px , dooshoo 15px padding
          margin-top: 30px;         // footer-iin deesh 30px margin
      }

      .footer-content {
          display: flex;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
      }

      .footer-section {
          flex: 1;
          margin: 0 10px;
      }

      .footer-section h3 {
          margin-bottom: 15px;
          font-size: 18px;
          color: #f5f5f5;
      }

      .footer-section ul {
          list-style: none;
          padding: 0;
      }

      .footer-section ul li {
          margin-bottom: 8px;
      }

      .footer-section a {
          color: #ddd;
          text-decoration: none;
          transition: color 0.3s;
      }

      .footer-section a:hover {
          color: #fff;
          text-decoration: underline;
      }

      .social-icons {
          display: flex;
          gap: 15px;
      }

      .social-icons a {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 36px;
          background-color: #555;
          border-radius: 50%;
          transition: background-color 0.3s;
      }

      .social-icons a:hover {
          background-color: #6b4226;
          text-decoration: none;
      }

      .footer-bottom {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #555;
          margin-top: 20px;
          font-size: 14px;
          max-width: 1200px;
          margin: 20px auto 0;
          padding: 15px 20px 0;
      }
    </style>
  `

  render() {    //Shadow DOM-iig HTML CSS-eer duurgej bga method
    this.shadowRoot.innerHTML = `
      ${this.styleSheet}
      <footer>
          <div class="footer-content">
              <div class="footer-section">
                  <h3>About Us</h3>
                  <ul>
                      <li><a href="about.html">Our Story</a></li>
                      <li><a href="about.html#mission">Our Mission</a></li>
                      <li><a href="about.html#values">Our Values</a></li>
                  </ul>
              </div>
              <div class="footer-section">
                  <h3>Customer Service</h3>
                  <ul>
                      <li><a href="faq.html">FAQs</a></li>
                      <li><a href="contact.html">Contact Us</a></li>
                      <li><a href="feedback.html">Feedback</a></li>
                  </ul>
              </div>
              <div class="footer-section">
                  <h3>Follow Us</h3>
                  <div class="social-icons">
                      <a href="#" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                      <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
                      <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
                  </div>
              </div>
          </div>
          <div class="footer-bottom">
              <p>&copy; 2025 CoffeeHustlers. All rights reserved.</p>
          </div>
      </footer>
    `;
  }
}

customElements.define('my-footer', Footer);     //Custom Element zarlaj ugj bga
