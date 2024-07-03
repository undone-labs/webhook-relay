# Webhook Relay

A tool to provide an exposed endpoint for webhooks to hit and relay to local machines, to help with local development

### Deployment

Each time a commit is merged to `main`, the worker reinitializes automatically with a Github action.

It can also be initialized locally by running
```ini
wrangler publish --config packages/worker/wrangler.toml
```


### Environment variables

To publish the worker, the following keys must be present in a `.ENV` file, or in CI secrets.

```ini
ENVIRONMENT=production
CF_ACCOUNT_ID=cloudflare-account-id
CF_ZONE_ID=cloudflare-zone-id
CF_API_TOKEN=cloudflate-api-token
CF_CUSTOM_DOMAIN=example.com
```
