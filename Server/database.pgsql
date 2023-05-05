--- create user table ---

CREATE TABLE users(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email text NOT NULL,
    password text NOT NULL,
    created_at date DEFAULT CURRENT_DATE
);

alter table users add column name text;

create table verification_tokens(
    id SERIAL PRIMARY KEY,
    email text not null,
    token text not null
);

alter table users add column isVerified boolean, add column verification_token text;
alter table verification_tokens add column user_id text;


CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name TEXT not null,
  path TEXT not null,
  mimetype TEXT not null,
  user_id UUID not null
);

alter table files add column no_of_downloads integer, add column no_of_sent integer, add column created_at date DEFAULT CURRENT_DATE;


ALTER TABLE files
ADD CONSTRAINT fk_files_users
FOREIGN KEY (user_id)
REFERENCES users (id)
ON DELETE CASCADE;
