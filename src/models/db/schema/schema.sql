DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS users;
CREATE TABLE session;

CREATE TABLE contacts (
  id serial,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL
);

CREATE TABLE users (
  id serial,
  name  VARCHAR(255) NOT NULL,
  email  VARCHAR(255) NOT NULL,
  password  VARCHAR(255) NOT NULL,
  role VARCHAR DEFAULT 'regular'
);

CREATE TABLE session (
  "sid" VARCHAR NOT NULL,
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL
);
