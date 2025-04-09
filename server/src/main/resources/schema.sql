-- deleting previous tables for testing purposes
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS authorities;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS sex;
DROP TABLE IF EXISTS rides;

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
	phone		TEXT,
	FOREIGN KEY(username) REFERENCES users(username),
	FOREIGN KEY(sex) REFERENCES sex(name)
);


CREATE TABLE IF NOT EXISTS drivers (
	username 	TEXT PRIMARY KEY,
	name 		TEXT,
	age 		INTEGER NOT NULL,
	sex 		TEXT,
	phone 		TEXT,
	license 	TEXT NOT NULL,
	FOREIGN KEY(username) REFERENCES users(username),
	FOREIGN KEY(sex) REFERENCES sex(name)
);

CREATE TABLE IF NOT EXISTS rides(
	rideID		INTEGER PRIMARY KEY,
	customer 	TEXT NOT NULL,
	driver 		TEXT,
	pickupLoc	TEXT,
	dropoffLoc	TEXT,
	vehicleType	TEXT,
	isDone		INTEGER NOT NULL DEFAULT 0,
	timeStamp	INTEGER NOT NULL,
	FOREIGN KEY(customer) REFERENCES customers(username),
	FOREIGN KEY(driver) REFERENCES driver(username)
);

INSERT INTO sex (name) VALUES ('male'), ('female');

