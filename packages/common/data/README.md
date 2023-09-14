# common-data (@rfx/common-data)

This library contains zod schemas for all data including models/entities and the DAO and DTO types associated with them.

Supports both front-end and back-end applications.

Having zod schemas in their own library helps avoid circular dependency issues with downstream libraries such as those containing ts-rest contracts or other sorts of shared API/RPC definitions.

## Conventions

This project uses a dual record identifier system with int `id` and string `uid` fields.

DAO's (Data Access Objects) are for internal use:

- DAO's include both int `id` and public-facing string `uid` properties.
- They may contain sensitive information and should not be exposed to clients.

DTO's (Data Transfer Objects) are used for exchanging data between the client:

- DTO's include only the `uid` identifier
- They should not contain any sensitive or internal/implementation-specific data.

### UUID Identifiers

For the sake of providing a simplified example project UUID's are used for the `uid` field vs. a more production-appropriate identifier such as ULID.

Random UUID's are not sortable (and therefore fragment indexes) and require a full table scan to find records by this value. 

## Build Notes

`package.json` intentionally omits `main` and `module` fields so they are added by Nx (via esbuild) during build.
Tree-shaking is enabled via `sideEffects: none`.

The build configuration depends on `"generatePackageJson": true` and  `"format": ["cjs", "esm"]` in `project.json`.

This library was generated with [Nx](https://nx.dev).

## Package Contents

- `src/lib/z-base`: base model and DTO/DAO schemas common to most models
- `src/lib/z-<model>`: model-specific schemas and associated interface/type definitions

## Building

Run `pnpm nx build common-data` to build the library.

## Running unit tests

Run `pnpm nx test common-data` to execute the unit tests via ViTest.
