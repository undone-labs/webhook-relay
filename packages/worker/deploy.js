const { execSync } = require('child_process');
const fs = require('fs');
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

// Read the wrangler.toml file
let wranglerToml = fs.readFileSync('packages/worker/wrangler.toml', 'utf8');

// Replace the environment variables in the wrangler.toml file
wranglerToml = wranglerToml.replace(/\$\{CF_ACCOUNT_ID\}/g, process.env.CF_ACCOUNT_ID)
                            .replace(/\$\{CF_ZONE_ID\}/g, process.env.CF_ZONE_ID)
                            .replace(/\$\{CLOUDFLARE_API_TOKEN\}/g, process.env.CLOUDFLARE_API_TOKEN)
                            .replace(/\$\{CF_DOMAIN\}/g, process.env.CF_DOMAIN)
                            .replace(/\$\{RELAY_ROUTES\}/g, process.env.RELAY_ROUTES);

// Write the modified wrangler.toml file back
fs.writeFileSync('packages/worker/wrangler.toml', wranglerToml);

console.log('Environment variables replaced in wrangler.toml');

// Set the environment variables for the wrangler command
const envs = {
  CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
  CF_ZONE_ID: process.env.CF_ZONE_ID,
  CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
  CF_DOMAIN: process.env.CF_DOMAIN,
  RELAY_ROUTES: process.env.RELAY_ROUTES,
};

execSync('wrangler deploy --config packages/worker/wrangler.toml', {
  stdio: 'inherit',
  env: { ...process.env, ...envs }
});
