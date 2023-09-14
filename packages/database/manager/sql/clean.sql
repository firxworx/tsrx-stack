-- ensure uuid extension in case pg < v13
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- retired naming convention
DROP INDEX IF EXISTS "uix__*";
DROP INDEX IF EXISTS "idx__*";

-- current naming convention
DROP INDEX IF EXISTS "ux__*";
DROP INDEX IF EXISTS "ix__*";

------------------------------------------------------------------
-- table schemas
------------------------------------------------------------------

-- user
DROP TABLE IF EXISTS "public"."user" CASCADE;
