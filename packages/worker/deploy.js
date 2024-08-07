const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Try getting variables from .env file
const localEnvPath = path.resolve(__dirname, '.env');
const rootEnvPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
  console.log('.env loaded from package directory');
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
  console.log('.env loaded from repo root');
} else {
  throw new Error('No .env file found');
}

const requiredEnvs = [
  'RELAY_ROUTES',
  'CF_ACCOUNT_ID',
  'CF_ZONE_ID',
  'CLOUDFLARE_API_TOKEN',
  'CF_DOMAIN'
];

// Output loaded environment variables for troubleshooting
console.log('Loaded environment variables:');
requiredEnvs.forEach((envVar) => {
  console.log(`${envVar}: ${process.env[envVar]}`);
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is required but not set`);
  }
});

// Read the wrangler.template.toml file
const templatePath = path.join(__dirname, 'wrangler.template.toml');
let wranglerToml = fs.readFileSync(templatePath, 'utf8');

// Replace the environment variables in the wrangler.template.toml file
wranglerToml = wranglerToml.replace(/\$\{CF_ACCOUNT_ID\}/g, process.env.CF_ACCOUNT_ID)
                            .replace(/\$\{CF_ZONE_ID\}/g, process.env.CF_ZONE_ID)
                            .replace(/\$\{CLOUDFLARE_API_TOKEN\}/g, process.env.CLOUDFLARE_API_TOKEN)
                            .replace(/\$\{CF_DOMAIN\}/g, process.env.CF_DOMAIN)
                            .replace(/\$\{RELAY_ROUTES\}/g, process.env.RELAY_ROUTES);

// Write the modified wrangler.toml file
const wranglerTomlPath = path.join(__dirname, 'wrangler.toml');
fs.writeFileSync(wranglerTomlPath, wranglerToml);

console.log('Environment variables replaced in wrangler.toml');

// Set the environment variables for the wrangler command
const envs = {
  CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
  CF_ZONE_ID: process.env.CF_ZONE_ID,
  CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
  CF_DOMAIN: process.env.CF_DOMAIN,
  RELAY_ROUTES: process.env.RELAY_ROUTES,
};

execSync(`wrangler deploy --config ${wranglerTomlPath}`, {
  stdio: 'inherit',
  env: { ...process.env, ...envs }
});
