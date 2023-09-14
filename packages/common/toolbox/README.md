# common-toolbox (@rfx/common-toolbox)

Common utilities and helper functions applicable across the stack.

Includes an assortment of:

- type utilities, type guards, and type assertion functions
- tools for strings, dates, numbers, random values, currency, etc.
- zod schemas, preprocessor functions, and other helpers for data validation

## Build

Run `pnpm nx build common-toolbox` to build this library.

This library builds both CommonJS and ESM to support both Node apps and React + Vite.

Note `package.json` omits `main` and `module` fields so they are added by Nx (via esbuild) during build.
The build configuration depends on `"generatePackageJson": true` and  `"format": ["cjs", "esm"]` in `project.json`.

Tree-shaking is enabled via `sideEffects: none`.

This library was generated with [Nx](https://nx.dev) `js:library` and uses the esbuild bundler.

## Unit Tests

Run `pnpm nx test common-toolbox` to run the unit tests via [Jest](https://jestjs.io).
