# TSRX Stack

A showcase of [ts-rest](https://ts-rest.com/) with [Fastify](https://fastify.dev/) and [React](https://react.dev/) in an [Nx](https://nx.dev) monorepo.

Data persistence is provided by [postgres](https://www.postgresql.org/) via the _proven_ enterprise-grade [slonik](https://github.com/gajus/slonik) for _true_ end-to-end type-safety, performance, and no limits on Postgres' features.

ts-rest delivers a productive TRPC-like developer experience without imposing complexity, overhead, or lock-in to any specific stack or ecosystem.

- [nx](https://nx.dev) build system
- [ts-rest](https://ts-rest.com/) to define the contract between the API and UI
- [openapi](https://www.openapis.org/) (swagger) documentation generated from the ts-rest contract
- [react-query](https://tanstack.com/query/latest) powered RPC-like API client provided by ts-rest
- [react](https://react.dev) the world's leading front-end library
- [vite](https://vitejs.dev/) for modern client-side development tooling
- [zod](https://github.com/colinhacks/zod) for run-time type safety and data integrity from the database to the client
- [tailwindcss](https://tailwindcss.com/) for efficient styling

This codebase aims to provide a real-world flex of ts-rest that delivers a working foundation for a data-driven application.

The codebase is thoroughly documented and makes no assumptions about your level of experience with any of the technologies used.

Try it out! Follow the [Development Setup](#development-setup) guide and get started in under 10 minutes!

Need help with your next project? Get in touch at <hello@firxworx.com> for consulting and contract development services.

## Features

Includes authentication with session management and user sign-in/out:

- [@mgcrea/fastify-session](https://github.com/mgcrea/fastify-session)
- [http-only](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#httponly-attribute) session cookie + signed sessions via [libsodium](https://github.com/jedisct1/libsodium.js)
- [argon2](https://github.com/ranisalt/node-argon2) credentials hashing

Application features:

- CRUD functionality for blog posts and user management (all features are public for demo purposes)
- Blog posts are in-memory for demonstration purposes
- Users and sessions are persisted in postgres
- react-router for client-side routing and navigation

Leverages Nx build system:

- The API and UI source is under `apps/`
- Shared libraries are under `packages/`

ts-rest contract definitions which are shared across the stack are housed in `packages/common/contracts`

## Development Setup

### Prerequisites

This project requires a linux or unix environment (Windows users can use WSL2) that includes:

- NodeJS 18+ with the [pnpm](https://pnpm.io/installation) package manager
- `psql` postgres client 
- Docker with `docker compose`

### Install Dependencies

Run `pnpm install` from the project root to install dependencies.

### Setup the Environment

Copy the respective `.env.sample` files to create `.env` in each of: project root, `apps/fastify-api`, and `apps/react-ui`.

Redefine any secret/key values in each file with your own random values.

The root `.env` is especially important because it defines the postgres connection string in the `DB_URL` variable.

The `DB_URL` from `.env.sample` works with the default `docker-compose.yml` configuration.

Alternatively you can set the `DB_URL` to point to another postgres database. [Neon](https://neon.tech/) is a relatively new cloud provider that provides a generous free tier.

Regardless of the database you choose you should always ensure that `sslmode` is included in the `DB_URL`. Always use `sslmode=require` for any remote databases or production deployments to ensure that all connections are encrypted.

### Setup the Development Database

Start the postgres database service using docker compose:

```sh
pnpm docker:postgres:up
```

Initialize and seed the development database with development data:

```sh
pnpm setup:database
```

The `setup:database` script executes `scripts/bash/setup-db.sh` which in turn calls a series of CLI utility scripts from the `packages/database/manager` library. 

The CLI utilities can be helpful for development and are documented in the library's [README](./packages/database/manager/README.md).

When you are done with development, stop all docker services:

```sh
pnpm docker:down
```

### Development Workflow

Start with a build:

```sh
pnpm build
```

Ensure the database is running and has been seeded per the above instructions.

If you aren't sure, you can confirm which docker services are running on your system with the `docker ps` command.

Start the development servers for the API and UI:

```sh
pnpm dev
```

The fastify API runs on port 3939 and the react UI runs on port 4200.

You can try the app by opening http://localhost:4200 in your browser.

#### Proxy Configuration

The UI dev server is configured proxy requests for http://localhost:4200/api to the back-end API.

For reference:
- the proxy configuration is included in the vite config at `apps/react-ui/vite.config.ts`.
- the example ts-rest contract routes all have the prefix "/api/v1": http://localhost:4200/api/v1 (e.g. http://localhost:4200/api/v1/auth/session)

#### Contracts and Implementation

- ts-rest contract definitions: `packages/common/contracts/src/lib/contract-definitions`
- ts-rest contract route implementations (API): `apps/fastify-api/src/app/contracts`
- ts-rest query client (UI): `apps/react-ui/src/api/query-client.ts`
- check out `apps/react-ui/src/components/features` for examples of the client in use
- check out `packages/database/manager/src/lib` for database entities/repositories/services

#### Test Users

The setup/seed step will generate a number of random users.

While the dev server is running you can view the users list in the UI at http://localhost:4200/users.

Each user has the same password: `PassPass123`. You can sign in with any given user's email and this password.

## Database Migrations

This repo does not include a tool for database migrations nor is one required to get the project running.

You are welcome to choose or implement your own solution!

Options include [flyway](https://flywaydb.org) (java -- run via docker), [umzug](https://github.com/sequelize/umzug), [db-migrate](https://github.com/db-migrate/node-db-migrate), [node-pg-migrate](https://www.npmjs.com/package/node-pg-migrate), and [slonik-migrator](https://www.npmjs.com/package/@slonik/migrator).

ORM's and query builders with migration tools that can be used standalone include: [knex](https://knexjs.org/), [kysely](https://kysely.dev/docs/migrations), and [drizzle-kit](https://orm.drizzle.team/kit-docs/overview). Beware of limitations of these tools as they may not support all postgres features.

## Build

Run `pnpm build` to build the fastify API, react UI, and all Nx-buildable packages in the project:

```sh
pnpm build
```

You can also use the `nx` cli to individually build any app or package/library along with its dependencies:

```sh
pnpm nx build fastify-api
pnpm nx build react-ui
```

Add the `--skip-nx-cache` option to build from scratch without using the Nx cache.

### Nx Pro Tips

Nx's file-watching and build cache system is good but not perfect. If you make a change to a ts-rest contract in a shared library it is recommended to restart the development server to ensure that all files and type changes are picked up.

If you find that your changes still aren't reflected in your IDE try running a production build: `pnpm build`.

Nx's cache system helps make incremental builds significantly faster however it can sometimes cause issues with outdated or stale data.

If you experience issues with the dev server or a build try running `pnpm nx reset` and/or `pnpm build --skip-nx-cache` to clear the Nx build cache and force a fresh build.

It is recommended to clear the Nx cache after upgrading Nx or making any significant changes to project files.

## NX Cloud

Consider signing up for an Nx Cloud Account if you would like to enable cloud builds with distributed caching.

Learn more at: https://nx.app/
How to connect this project: https://nx.dev/packages/nx/documents/connect-to-nx-cloud.

Nx Cloud is not required and you build this project using the local cache (the current/default configuration).

If you sign up for Nx Cloud create `nx-cloud.env` by copying `nx-cloud.env.sample` and updating the values.

Move your access token from `nx.json` (where it may be added by the `nx connect` command) to `nx-cloud.env` to avoid committing it to source control and set the value in `nx.json` to an empty string.

In general you should only add read-only tokens to `nx.json` and keep read-write tokens in `nx-cloud.env`. You can create new tokens in your Nx dashboard at https://nx.app/.

## Working with Postgres

While postgres is running connect to a bash shell in the postgres container:

```sh
pnpm docker:postgres:bash
```

From the container's shell run `psql` to connect to the database:

```sh
psql -U postgres
```

You can also connect to the database using the `psql` client installed on your local workstation. 

```sh
pnpm psql
```

Your client version should match the server version running in Docker to avoid warnings or errors.

Stop all docker services when you are finished development:

```sh
pnpm docker:down
```

## Stack Overview

### Nx

The Nx build system makes it easy to add new apps and libraries to the project monorepo and stay on top of dependencies.

This configuration uses a common base tsconfig and a common set of dependencies (a unified `package.json`) for all apps and libraries to ensure consistency and eliminate dependency conflicts.

### ts-rest

[ts-rest](https://ts-rest.com/) enforces a strongly-typed contract between the back-end API and the client. It delivers end-to-end type safety, an API client integreated with [react-query](https://tanstack.com/query/v3/), and a productive RPC/TRPC-like developer experience.

ts-rest is a powerful and flexible alternative to TRPC, GraphQL, and others.

It provides comparable benefits as these technologies without the complexity, overhead, and lock-in to proprietary and/or esoteric tooling or to any specific ecosystem.

Client-server communication is achieved via a standard REST-like JSON API that can be consumed using standard tooling.

OpenAPI 3.0 (swagger) documentation is automatically generated from the ts-rest contract. The OpenAPI spec can be used to generate client libraries for other languages and frameworks.

### slonik

Slonik delivers enterprise-grade Postgres capabilities and imposes no restrictions on Postgres' features.

With slonik you never have to compromise on best-practices or revise your database or queries to support the limitations of an ORM or query builder. This can save significant amounts of time, effort, and even infrastructure costs.

Query results are automatically parsed by zod to ensure data integrity and _true_ end-to-end type safety that extends from the database to the client.

Slonik is configured to automatically convert lower_snake_case table and field names in query results to camelCase to embrace the respective conventions of both postgres and JavaScript/TypeScript.

By not forcing JS/TS ecosystem-specific conventions into the database it is more compatible with other stacks and tools. It is also a lot more convenient to write ad-hoc queries when no capitalization or special quoting is required!

### fastify

Fastify back-end API for high performance and modern features that's easy to deploy and scale.

`@mcgrea/fastify-session` provides session management and uses a custom slonik-powered session store for Postgres.

## Using Nx to Run Tasks

The following content is copied over from the Nx boilerplate README.

To execute tasks with Nx use the following syntax:

```sh
pnpm nx <target> <project> <...options>
```

You can also run multiple targets:

```sh
pnpm nx run-many -t <target1> <target2>
```

...or add `-p` to filter specific projects

```sh
pnpm nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`.
Learn more [in the docs](https://nx.dev/core-features/run-tasks).

Check out the [Nx Console extensions](https://nx.dev/nx-console) for VSCode extensions and other tools for working with Nx.

Nx comes with local caching already built-in (configured per `nx.json`). 
On CI you might want to go a step further:

- [Set up remote caching](https://nx.dev/core-features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/core-features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)
