CREATE TABLE users
(
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password      TEXT NOT NULL,
  refresh_token TEXT
);
