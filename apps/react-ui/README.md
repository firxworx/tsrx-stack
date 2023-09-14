# react-ui

React + Vite UI. 

Runs on http://localhost:4200 in development.

API requests to http://localhost:4200/api are proxied to the back-end API at http://localhost:3939.

## Development

Copy `.env.sample` to create `.env`.

Ensure the `VITE_API_URL` reflects the URL that `/api` paths should be appended to. 
In development due to the proxy configuration this should be the same as the UI URL.

Refer to `vite.config.ts` for development and preview server configuration including port and proxy settings.

## Proxy Configuration

Requests to the `/api` path are proxied to the back-end API per `vite.config.ts`.

Using the Vite proxy contrasts with many Nx workspaces which often use built-in support for the Angular proxy. In Nx workspaces that proxy is configured via `proxy.conf.json` file which the `serve` target in `project.json` referencds via the `proxyConfig` property. None of these should be set while using the Vite proxy.

## TailwindCSS

Refer to `tailwind.config.js` and `postcss.config.js` for project-specific tailwind configuration.

The Tailwind config references the tailwind preset in the project root: `tailwind-preset.cjs`.

## ts-rest + react-query

This app uses the react-query client provided by ts-rest. Refer to `src/api` for configuration.
