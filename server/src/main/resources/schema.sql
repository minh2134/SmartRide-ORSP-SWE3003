-- deleting previous tables for testing purposes
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS sex;

CREATE TABLE IF NOT EXISTS sex (
	name		TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS customers (
	userid		INTEGER PRIMARY KEY,
	username	TEXT,
	password	TEXT,
	name		TEXT,
	age		INTEGER NOT NULL,
	sex		TEXT,
	FOREIGN KEY(sex) REFERENCES sex(name)
);

CREATE TABLE IF NOT EXISTS drivers (
	userid 		INTEGER PRIMARY KEY,
	username 	TEXT,
	name 		TEXT,
	password	TEXT,
	age 		INTEGER NOT NULL,
	sex 		TEXT,
	license 	TEXT,
	FOREIGN KEY(sex) REFERENCES sex(name)
);

INSERT INTO sex (name) VALUES ('male'), ('female');

