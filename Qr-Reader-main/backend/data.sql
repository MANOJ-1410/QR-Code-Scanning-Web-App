CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE qr_data (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    data VARCHAR(500) NOT NULL
);
