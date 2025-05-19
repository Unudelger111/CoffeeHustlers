export function saveMenuPageState() {
  const menuPage = document.querySelector('menu-page');
  if (!menuPage) return;

  const shopSelect = menuPage.shadowRoot.querySelector('#shop-select');
  const locationSelect = menuPage.shadowRoot.querySelector('#location-select');

  const state = {
    tab: menuPage.tab || '',
    scrollY: window.scrollY,
    franchise: shopSelect?.value || '',
    location: locationSelect?.value || ''
  };

  sessionStorage.setItem("menuState", JSON.stringify(state));
}
