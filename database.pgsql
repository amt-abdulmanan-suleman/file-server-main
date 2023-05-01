--- create user table ---

CREATE TABLE users(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email text NOT NULL,
    password text NOT NULL,
    created_at date DEFAULT CURRENT_DATE
);