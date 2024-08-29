CREATE DATABASE pokemons_db;

CREATE TABLE pokemons (
    number INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    types TEXT[] NOT NULL,
    image VARCHAR(255) NOT NULL
);