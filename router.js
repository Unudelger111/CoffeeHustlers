import { saveMenuPageState } from './menu-state.js';

export class Router { // Router class-iig export hiijga
  constructor({ routes, rootId, hideHeaderOnPaths = [], hideFooterOnPaths = [] }) {
    this.routes = routes; 
    this.root = document.getElementById(rootId);
    this.routeMatchers = this.compileRoutes(routes); // dynamic route-iig uurchluh
    this.hideHeaderOnPaths = hideHeaderOnPaths; 
    this.hideFooterOnPaths = hideFooterOnPaths; 
    this.handleClick = this.handleClick.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
    this.handleNavigationEvent = this.handleNavigationEvent.bind(this);
    this.init();
  }

  //dynamic route-iig uurchluh
  compileRoutes(routes) {
    return Object.entries(routes).map(([path, component]) => {
      const paramNames = [];
      const regexPath = path.replace(/:([\w]+)/g, (_, key) => {
        paramNames.push(key);
        return '([^\\/]+)';
      });
      const matcher = new RegExp(`^${regexPath}$`);
      return { matcher, paramNames, component };
    });
  }


  // ugsun path iig route tei ni match hiine
  matchRoute(path) {
    for (const { matcher, paramNames, component } of this.routeMatchers) {
      const match = path.match(matcher);
      if (match) {
        const params = {};
        paramNames.forEach((name, index) => {
          params[name] = decodeURIComponent(match[index + 1]);
        });
        return { component, params }; 
      }
    }
    return null;
  }

  shouldShowHeader(path) {
    return !this.pathMatchesAny(path, this.hideHeaderOnPaths);
  }

  shouldShowFooter(path) {
    return !this.pathMatchesAny(path, this.hideFooterOnPaths);
  }

  pathMatchesAny(path, patterns) {
    for (const pattern of patterns) {
      if (pattern === path) return true;
      
      if (pattern.endsWith('*')) {
        const prefix = pattern.slice(0, -1);
        if (path.startsWith(prefix)) return true;
      }
    }
    return false;
  }

  render(path) {
    const match = this.matchRoute(path);
    if (!match) {
      if (this.routes['/404']) {
        const el = document.createElement(this.routes['/404']);
        this.root.innerHTML = '';
        this.root.appendChild(el);
      } else {
        this.root.innerHTML = `<h1>404 Not Found</h1>`;
      }
      return;
    }

    const { component, params } = match;
    this.root.innerHTML = '';
    const el = document.createElement(component);
    el.routeParams = params; 
    this.root.appendChild(el);

    const header = document.querySelector('nav-bar');
    if (header) {
      header.style.display = this.shouldShowHeader(path) ? 'block' : 'none';
    }

    const footer = document.querySelector('my-footer');
    if (footer) {
      footer.style.display = this.shouldShowFooter(path) ? 'block' : 'none';
    }
  }

  navigate(path) {
    history.pushState({}, '', path);
    this.render(path);
  }

  handleClick(event) {
    const anchor = event.target.closest('a');
    if (
      anchor &&
      anchor.origin === location.origin &&
      anchor.hasAttribute('data-link')
    ) {
      event.preventDefault();
      const path = anchor.getAttribute('href');
      
      if (location.pathname === '/menu') {
        saveMenuPageState();
      }

      this.navigate(path);
    }
  }


  handleNavigationEvent(event) {
    if (event.detail && event.detail.path) {
      if (location.pathname === '/menu') {
        saveMenuPageState();
      }

      event.preventDefault();
      this.navigate(event.detail.path);
    }
  }


  handlePopState() {
    this.render(location.pathname);
  }

  init() {
    document.addEventListener('click', this.handleClick);
    document.addEventListener('navigate', this.handleNavigationEvent);
    window.addEventListener('popstate', this.handlePopState);
    this.render(location.pathname);
  }
}
