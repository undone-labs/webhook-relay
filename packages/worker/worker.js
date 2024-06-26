import { localPort } from './config.js';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const localUrl = `http://localhost:${localPort}${url.pathname}${url.search}`;

    const response = await fetch(localUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    return response;
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
