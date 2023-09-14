# fastify-api

## Project Layout

Refer to `src/app.ts` for the core application configuration.

- `src/app/contracts`: implementations of ts-rest contracts (sub-contracts of the combined ts-rest API contract)
- `src/app/plugins`: fastify plugins (one per file) autoloaded by `src/app.ts`
- `src/app/routes`: fastify routes (one per file) autoloaded by `src/app.ts`

### API Routes

This API includes an example of how ts-rest can co-exist alongiside standard fastify routes.

Refer to `src/app/routes/root.ts` for a standard fastify route definition.
This file can be used as a template to add more routes.

Refer to `src/app/contracts/root.ts` for the "contracts router" definition of the ts-rest combined contract implemented by this API. If you add new sub-contracts to the combined contracts, you will need to add them here.

Do not use `index.ts` as a filename under `app/routes` or `app/contracts` unless it is a directory index file that exports the rest of the contents of the directory.

Take care to note the differences between the fastify router definitions vs. express (and other frameworks) as this is a potential source of confusion when working with multiple frameworks.

### OpenAPI

This API uses OpenAPI (Swagger) to document the API specified by the ts-rest contract.

When the server is running the Swagger UI is available at `/docs` and the OpenAPI JSON is at `/docs/json`.

Refer to `src/docs.ts` for configuration with `@ts-rest/open-api`.
This configuration is registered as a plugin in `src/app/plugins/swagger.ts`.

https://github.com/fastify/fastify-swagger
https://github.com/fastify/fastify-swagger-ui

