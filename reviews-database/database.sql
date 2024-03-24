-- this is a psotgres database file--
-- its just for me to keep track of the database schema and to keep track of the commands I used to create the database--

CREATE DATABASE reviews;


CREATE TABLE review(
    review_id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    location_name VARCHAR(255),
    rating INT,
    description VARCHAR(1024)
);
