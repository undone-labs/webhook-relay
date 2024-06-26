import { getPublicUrl, setPublicUrl } from './config.js';

addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname === '/bind' && event.request.method === 'POST') {
    event.respondWith(handleBind(event.request));
  } else {
    event.respondWith(handleRequest(event.request));
  }
});

async function handleBind(request) {
  try {
    const { url } = await request.json();
    setPublicUrl(url);
    return new Response('Public URL bound successfully', { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const publicUrl = getPublicUrl();
    if (!publicUrl) {
      throw new Error('Public URL not bound');
    }

    const localUrl = `${publicUrl}${url.pathname}${url.search}`;

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
