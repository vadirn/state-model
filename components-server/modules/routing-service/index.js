import createHistory from 'history/createBrowserHistory';

// returns an object, representing querystring
export const decomposeQuery = querystring =>
  querystring
    .slice(1)
    .split('&')
    .reduce((result, item) => {
      const queryItem = item.split('=');
      const nextResult = result;
      const key = global.decodeURIComponent(queryItem[0]);
      const value = queryItem[1] ? global.decodeURIComponent(queryItem[1]) : null;
      if (key.length > 0) {
        nextResult[key] = value || key;
      }
      return nextResult;
    }, {});

export const composeQuery = query => {
  const keys = Object.keys(query);
  if (keys.length === 0) {
    return '';
  }
  return keys
    .reduce((accum, key) => {
      accum += `${key}=${query[key]}&`;
      return accum;
    }, '?')
    .slice(0, -1);
};

export const decomposePath = pathname => {
  let path = '';
  if (pathname[0] === '/') {
    path = pathname.slice(1);
  }
  return path.split('/');
};

// returns null if not matched, returns object with all route and query params
export const matchRoute = (route, location) => {
  const routeComponents = decomposePath(route);
  const pathComponents = decomposePath(location.pathname);
  const query = decomposeQuery(location.search);
  // test path against route
  if (routeComponents.length !== pathComponents.length) {
    return null;
  }
  let result = { params: {}, query };
  routeComponents.some((routeComponent, idx) => {
    if (routeComponent[0] === ':') {
      result.params[routeComponent.slice(1)] = pathComponents[idx];
    } else if (routeComponent !== pathComponents[idx]) {
      result = null;
      return true;
    }
    return false;
  });
  return result;
};

class RoutingService {
  constructor() {
    this.routes = [];
    this.onRouteNotFound = () => {};
    this.history = createHistory();

    this.history.listen((location, action) => {
      // action is one of PUSH, REPLACE, POP
      this.onLocationChange(location, action);
    });
  }
  onLocationChange(location, action) {
    let matchedRoute = null;
    this.routes.some(route => {
      const pathData = matchRoute(route.pattern, location);
      if (pathData !== null) {
        matchedRoute = { ...route, data: pathData };
        return true;
      }
      return false;
    });
    if (matchedRoute === null) {
      this.onRouteNotFound(action);
    } else {
      matchedRoute.onVisit(matchedRoute.data, action);
    }
  }
  addFallback(onRouteNotFound) {
    this.onRouteNotFound = onRouteNotFound;
    // chain
    return this;
  }
  addRoute(shorthand, route, onVisit = () => {}) {
    this.routes.push({
      shorthand,
      pattern: route,
      onVisit,
    });
    // chain
    return this;
  }
  composeURL(shorthand, routeData = {}) {
    let matchedRoute = null;
    const data = Object.assign({ params: {}, query: {} }, routeData);
    this.routes.some(route => {
      if (route.shorthand === shorthand) {
        matchedRoute = route;
        return true;
      }
      return false;
    });
    if (matchedRoute === null) {
      return '';
    }
    const routeComponents = decomposePath(matchedRoute.pattern);
    return `/${routeComponents
      .map(routeComponent => {
        if (routeComponent[0] === ':') {
          return data.params[routeComponent.slice(1)];
        }
        return routeComponent;
      })
      .join('/')}${composeQuery(data.query)}`;
  }
  clearRoutes() {
    this.routes = [];
    this.onRouteNotFound = () => {};
  }
  setURL(url) {
    this.history.push(url);
  }
  replaceURL(url) {
    this.history.replace(url);
  }
  setLocation(shorthand, routeData) {
    this.setURL(this.composeURL(shorthand, routeData));
  }
  replaceLocation(shorthand, routeData) {
    this.replaceURL(this.composeURL(shorthand, routeData));
  }
}

const routingService = new RoutingService();

export default routingService;
