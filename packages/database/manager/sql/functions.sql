-- required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- function to set `updated_at` to CURRENT_TIMESTAMP (useful for ON UPDATE triggers re `updated_at` columns)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP; -- NEW is a RECORD object containing the insert/update data
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- check it an index exists in a schema and return a boolean (enables 'IF NOT EXISTS' for indexes)
CREATE OR REPLACE FUNCTION index_exists(_schema TEXT, _index TEXT)
RETURNS BOOLEAN AS
$$
BEGIN
  RETURN EXISTS (
    SELECT FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = _index AND n.nspname = _schema
  );
END
$$
LANGUAGE 'plpgsql';

-- check if a trigger exists in a schema and return a boolean (enables 'IF NOT EXISTS' for triggers)
CREATE OR REPLACE FUNCTION trigger_exists(_schema TEXT, _trigger TEXT)
RETURNS BOOLEAN AS
$$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM pg_trigger t
    INNER JOIN pg_class c ON t.tgrelid = c.oid
    INNER JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE t.tgname = _trigger
    AND n.nspname = _schema
  );
END;
$$
LANGUAGE plpgsql;
