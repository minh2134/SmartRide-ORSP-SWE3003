INSERT INTO users (username, password) VALUES
	('customer', '$2a$10$Y5WKyjlIddvaNbyzVmIQs.ZuYEknDUmL3VEQkfB1oNeckhL9C5XeG'),
	('driver', '$2a$10$OZrrCIj61p9acbvhF2UY9elt5Wt/LK58CjkOAHuFg8H/C0yzO0FLC'),
	('driverAlt', '$2a$10$q6t0dbbcd2RJEaVXpPmgiehEhEWbZRmRUz/Zkh3FSBryltOXNE2w2');

INSERT INTO authorities (username, authority) VALUES
	('customer', 'ROLE_USER'),
	('driver', 'ROLE_USER'),
	('driverAlt', 'ROLE_USER');

INSERT INTO customers (username, name, age, sex) VALUES 
	('customer', 'Puout', 46, 'male');

INSERT INTO drivers (username, name, age, sex, license) VALUES
	('driver', 'Dump', 23, 'male', 'DSCKSAH'),
	('driverAlt', 'Zelenlandd', 32, 'male', 'UKREINE');
