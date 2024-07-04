import { setRoute, getRoute } from './config.js';

addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname === '/bind' && event.request.method === 'POST') {
    event.respondWith(handleBind(event.request));
  } else {
    const routes = process.env.RELAY_ROUTES.split(',');
    const matchingRoute = routes.find(route => url.pathname === `/${route}`);

    if (matchingRoute) {
      event.respondWith(handleRequest(event.request, matchingRoute));
    } else {
      event.respondWith(new Response('Matching route not found', { status: 404 }));
    }
  }
});

async function handleBind(request) {
  try {
    const { url, route } = await request.json();
    setRoute(route, url);
    return new Response('Route bound successfully', { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

async function handleRequest(request, route) {
  try {
    const clientUrl = getRoute(route);

    if (!clientUrl) {
      // Not to be confused with route not found above lol
      throw new Error('Route not bound');
    }

    const response = await fetch(clientUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    return response;
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
