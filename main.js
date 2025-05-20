import "./components/menu-categories.js";
import "./components/item-card.js";
import "./components/header.js";
import "./components/footer.js";
import "./components/ThemeToggle.js";
import "./components/reorder.js";

import "./pages/landing-page.js";
import "./pages/menu-page.js";
import "./pages/item-page.js";
import "./pages/login-page.js"
import "./pages/cart-page.js";
import "./pages/history-view.js";
import "./pages/payment.js";
import "./pages/barista-page.js";
import './pages/order-confirmation-page.js';

import { Router } from "./router.js";
import { cartService } from "./cart-service.js";

if (window.location.pathname === "/index.html") {
  history.replaceState(null, null, "/");
}

window.cartService = cartService;

document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme');
  console.log(theme)
  if (theme && theme === 'dark') {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
})

const hideHeaderOnPaths = [
  '/login', 
  '/'
];

const hideFooterOnPaths = [
  '/login',
  '/'
];

const router = new Router({
  rootId: "app",
  routes: {
    '/': 'landing-page',
    '/menu': 'menu-page',
    '/item/:id': 'item-page',
    '/login': 'login-page',
    '/cart': 'cart-page',
    '/account': 'login-page',
    '/order-history': 'history-view',
    '/reorder': 'reorder-page',
    '/payment': 'payment-page',
    '/barista': 'barista-page',
    '/order-confirmation': 'order-confirmation-page',
  },
  hideHeaderOnPaths,
  hideFooterOnPaths
});

window.router = router;