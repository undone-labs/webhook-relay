const localtunnel = require('localtunnel');
const axios = require('axios');
require('dotenv').config();

// Forwards to another app, which should already be running in the target port
const port = process.env.LOCAL_PORT || 3000;
const workerUrl = process.env.WORKER_URL;

const args = process.argv.slice(2);
const route = args[args.indexOf('--route') + 1];

if (!route) {
  console.error('Route muse be specified: use --route foo to bind to /foo');
  process.exit(1);
}

// Start local tunnel and get a tunnel URL
(async () => {
  const tunnel = await localtunnel({ port });

  console.log(`Tunnel URL: ${tunnel.url}`);

  // Register tunnel URL with Cloudflare worker
  try {
    await axios.post(`${workerUrl}/bind`, { url: tunnel.url, route });
    console.log(`Successfully bound to tunnel URL for route ${route}`);
  } catch (err) {
    console.error('Failed to bind tunnel URL:', err.message);
  }

  // Handle tunnel close event
  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
})();
