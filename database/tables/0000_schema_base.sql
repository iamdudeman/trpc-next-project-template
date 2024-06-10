CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users
(
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         varchar(320) NOT NULL UNIQUE,
  password      varchar(100) NOT NULL,
  refresh_token varchar(512)
);
