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

DELETE from users where email="abdul.suleman@amalitech.org"