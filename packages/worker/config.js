const routeMap = new Map();

export const setRoute = (route, url) => {
  routeMap.set(route, url);
};

export const getRoute = (route) => {
  return routeMap.get(route);
};
