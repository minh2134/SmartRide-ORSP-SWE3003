-- deleting previous tables for testing purposes
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS authorities;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS sex;

CREATE TABLE IF NOT EXISTS sex (
	name		TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS users (
	username	TEXT PRIMARY KEY,
	password 	TEXT NOT NULL,
	enabled 	INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS authorities (
	username	TEXT PRIMARY KEY,
	authority	TEXT NOT NULL,
	FOREIGN KEY(username) REFERENCES users(username)
);

CREATE TABLE IF NOT EXISTS customers (
	username	TEXT PRIMARY KEY,
	name		TEXT,
	age		INTEGER NOT NULL,
	sex		TEXT,
	FOREIGN KEY(username) REFERENCES users(username),
	FOREIGN KEY(sex) REFERENCES sex(name)
);

CREATE TABLE IF NOT EXISTS drivers (
	username 	TEXT PRIMARY KEY,
	name 		TEXT,
	age 		INTEGER NOT NULL,
	sex 		TEXT,
	license 	TEXT,
	FOREIGN KEY(username) REFERENCES users(username),
	FOREIGN KEY(sex) REFERENCES sex(name)
);

INSERT INTO sex (name) VALUES ('male'), ('female');

