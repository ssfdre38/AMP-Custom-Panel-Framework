# AMP Custom Panel Framework

A minimal framework for building a custom web panel for CubeCoders AMP using the AMP HTTP API.

Features:
- Vite app scaffold (Vanilla JS) with dark UI
- AmpClient for Core and ADSModule calls (login, getInstances, start/stop/restart)
- Simple dashboard listing instances with action buttons

## Requirements
- Node.js >= 18, npm >= 9
- An AMP instance reachable at http(s)://host:port/API

## Quickstart
```bash
npm install
npx vite dev          # dev server
npx vite build        # production build to dist/
npx vite preview      # preview built site
```

## Configure API base and auth
- Default API base: http://localhost:8080/API
- On the login screen you can change API base and sign in; sessionID is stored in localStorage as a bearer token.

## Deployment to AMP WebRoot
Build and copy the dist output to your instance WebRoot. Example for ADS01:
```bash
npx vite build
# requires appropriate permissions
rsync -a dist/ /home/amp/.ampdata/instances/ADS01/WebRoot/
```

## Extending the client
Add new endpoints in `src/sdk.js` following the existing pattern, e.g.:
```js
async getInstanceStatuses() { return this._post('/ADSModule/GetInstanceStatuses') }
```
Then consume them in `src/main.js`.

## Security notes
- Prefer HTTPS and restrict AMP API exposure (reverse proxy, firewall)
- Tokens are stored in localStorage; use Logout to clear
- Do not commit secrets or production tokens

## License
MIT
