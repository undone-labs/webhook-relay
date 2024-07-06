const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Try getting variables from .env file
dotenv.config();

const requiredEnvs = [
  'RELAY_ROUTES',
  'CF_ACCOUNT_ID',
  'CF_ZONE_ID',
  'CLOUDFLARE_API_TOKEN',
  'CF_DOMAIN'
];

requiredEnvs.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is required but not set`);
  }
});

const envs = {
  CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
  CF_ZONE_ID: process.env.CF_ZONE_ID,
  CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
  CF_DOMAIN: process.env.CF_DOMAIN,
  RELAY_ROUTES: process.env.RELAY_ROUTES,
};

execSync('wrangler deploy', {
  stdio: 'inherit',
  env: { ...process.env, ...envs }
});
