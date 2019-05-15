-- kill schema, tables and functions
DROP SCHEMA IF EXISTS public CASCADE;

-- recreate schema
CREATE SCHEMA public;

-- restore default grants
GRANT ALL ON SCHEMA public TO root;
GRANT ALL ON SCHEMA public TO public;

-- switch to schema
SET search_path TO public;

-- required extension for uuid generation
CREATE EXTENSION pgcrypto;

-- build tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,  
  password TEXT NOT NULL,
  confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  reset_password_token TEXT NOT NULL DEFAULT md5(random()::text),
  reset_password_expires TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
  created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

-- update updated_at timestamp
CREATE OR REPLACE FUNCTION upd_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- update timestamp
CREATE TRIGGER users_timestamp_on_update BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE upd_timestamp(); 
