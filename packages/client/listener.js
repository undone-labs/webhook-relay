const express = require('express');
const bodyParser = require('body-parser');
const localtunnel = require('localtunnel');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.LOCAL_PORT || 3000;
const workerUrl = process.env.WORKER_URL;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.sendStatus(200);
});

app.listen(port, async () => {
  console.log(`Local server running at http://localhost:${port}`);

  // Start local tunnel and get a tunnel URL
  const tunnel = await localtunnel({ port });

  console.log(`Tunnel URL: ${tunnel.url}`);

  // Register tunnel URL with Cloudflare worker
  try {
    await axios.post(`${workerUrl}/bind`, { url: tunnel.url });
    console.log('Successfully bound to tunnel URL');
  } catch (err) {
    console.error('Failed to bind tunnel URL:', err.message);
  }

  // Handle tunnel close event
  tunnel.on('close', () => {
    console.log('Tunnel closed');
  });
});
