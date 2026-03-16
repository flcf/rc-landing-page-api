# rc-landing-page-api

Serverless APIS deployed to Vercel

To deploy Vercel project locally and test it, run:

```sh
vercel dev --listen 3001
```

This deploys a server on localhost:3001 and uses `.env` file

To deploy Vercel project directly to prod and test, run:

```sh
vercel --prod
```

To get latest environment variables

```sh
vercel env pull .env
```

## Troubleshooting

> Running `vercel dev` throws `Error: Cannot read properties of undefined (reading 'prototype')`

The `vercel` package needs a specific Node version. Check your node version and ensure you are using v20, v22 or v24.
Delete `node_modules/`, `package-lock.json`, and `.vercel/`, then re-run

```sh
npm install
npm install -g vercel@latest
```
