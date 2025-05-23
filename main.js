//Undsen huudsaa udirdah App (main) component
//Custom WC bolon huudasnuud
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
import "./pages/barista-order-page.js";
import './pages/order-confirmation-page.js';

//router.js ees Router class-iig import hiij bga. Ene ni SPA navigation-iig hiij bga. 
import { Router } from "./router.js"; 

//cartnii logiciig global aar importlj bga. Ene ni haanaas ch ashiglaj boldog bolgjgo.
import { cartService } from "./cart-service.js";

// Hereglegch index.html gedeg huudas deer orj irj bga bol / gedeg huudas ruu shiljij bga.
if (window.location.pathname === "/index.html") {
  history.replaceState(null, null, "/");
}

window.cartService = cartService;

// Huudsiig load hiiheed localstorage-aas theme-iig ni shalgaj bga.
document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme');
  console.log(theme)
  if (theme && theme === 'dark') {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
})

// Header ee nuuh huudasnuud.
const hideHeaderOnPaths = [
  '/login',
  '/barista', 
  '/barista-order/:id',
  '/'
];

const hideFooterOnPaths = [
  '/login',
  '/barista',
  '/barista-order/:id',
  '/'
];

// Huudas bolon url-iig uurchluh bolomjtoi Router class-iig hereglej bga.
const router = new Router({
  rootId: "app",   // ene page iig render hii 
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
    '/barista-order/:id': 'barista-order-page',
    '/order-confirmation': 'order-confirmation-page', 
    '/search': 'search-page',

  },
  hideHeaderOnPaths,
  hideFooterOnPaths
});

// router global aar handaj bolno jishee n /menu
window.router = router; 