# database-manager (@rfx/database-manager)

This library is home to the project's sql schema definitions and it exports repository functions
and services that are used to interact with entities stored in the database.

This library also includes CLI "utility scripts" to manage the database schema and seed it with development data.

This library was generated with [Nx](https://nx.dev).

## Project Conventions

Database entities (which generally correspond to a table) are defined under `src/lib/entities`.

Each entity has a corresponding `sql` file that defines the table schema plus a corresponding `ts` file that defines async `seed()` and `drop()` functions and exports a "table identifier tuple" as an array: `['schema','table_name']`.

The ts file can export any other useful constants or functions that are useful for interacting with the table.

The CLI utility scripts can be used to create/seed/drop any entites in the database.

Any CLI utilities that interact with a table accept a table identifier argument: 
`<schema>.<table_name>` (e.g. `public.user`)

By adhering to conventions and defining a schema `sql` file and operations `ts` file for every table, developers have a lot of flexibility and are well-equipped to run ad-hoc queries, run experiments, and efficiently develop features.

## CLI Utility Scripts for Managing the Database

The script implementations are housed under `src/lib/cli` in this library.

The CLI scripts should be run via `pnpm` using the scripts defined in `package.json`:

- `pnpm cli:pg:setup` - run `sql/functions.sql` to create required extensions and postgres functions
- `pnpm cli:pg:schema <schema>.<table_name>` - execute a table's corresponding `schema.table_name.sql` file
- `pnpm cli:pg:seed <schema>.<table_name>` - execute `seed()` from a table's corresponding `schema.table_name.ts` file
- `pnpm cli:pg:drop <schema>.<table_name>` - execute `drop()` from a table's corresponding `schema.table_name.ts` file
- `pnpm cli:pg:adhoc` - execute the script `src/lib/cli/cli-adhoc-query.ts`

The ad-hoc `cli-adhoc-query.ts` is provided as an example template for a "scratch pad" script you can use for ad-hoc testing of queries/repositories/services in development.

The reason to use `pnpm` to execute these scripts is because each definition in `package.json`:

- uses `tsx` to execute the ts file using this library's `tsconfig.json`
- references the `.env` in the project root (to populate the `DB_URL` environment variable)
- runs `dotenv-expand` to support variable expansion so `DB_URL` can be composed from other variables

The `setup:database` script mentioned in the README is a wrapper for a series of CLI utility scripts.

## Building

Run `pnpm nx build database-manager` to build the library on its own.

## Running unit tests

Run `pnpm nx test database-manager` to execute the unit tests via [Jest](https://jestjs.io).
