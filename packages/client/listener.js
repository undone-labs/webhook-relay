const localtunnel = require('localtunnel');
const axios = require('axios');
require('dotenv').config();

// Forwards to another app, which should already be running in the target port
const port = process.env.LOCAL_PORT || 3000;
const workerUrl = process.env.WORKER_URL;

// Start local tunnel and get a tunnel URL
(async () => {
  const tunnel = await localtunnel({ port });

  console.log(`Tunnel URL: ${tunnel.url}`);

  // Register tunnel URL with Cloudflare worker
  try {
    await axios.post(`${workerUrl}/bind`, { url: tunnel.url });
    console.log('Successfully bound to tunnel URL');
  } catch (err) {
    console.error('Failed to bind tunnel URL:', err.message);
  }

  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
})();
