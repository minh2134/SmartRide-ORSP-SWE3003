INSERT INTO users (username, password) VALUES
	('customer', '$2a$10$Y5WKyjlIddvaNbyzVmIQs.ZuYEknDUmL3VEQkfB1oNeckhL9C5XeG'),
	('driver', '$2a$10$OZrrCIj61p9acbvhF2UY9elt5Wt/LK58CjkOAHuFg8H/C0yzO0FLC'),
	('driverAlt', '$2a$10$q6t0dbbcd2RJEaVXpPmgiehEhEWbZRmRUz/Zkh3FSBryltOXNE2w2'),
	('DUMMY', '$2a$10$A7oAqpGqsglzSeIV/omy0uQVaACmV/Soa16JyvMLF/DJm.o3iOQRa');

INSERT INTO authorities (username, authority) VALUES
	('customer', 'ROLE_USER'),
	('driver', 'ROLE_USER'),
	('driverAlt', 'ROLE_USER'),
	('DUMMY', 'ROLE_USER');

INSERT INTO customers (username, name, age, phone, sex) VALUES 
	('customer', 'Puout', 46, '0903456879', 'male');

INSERT INTO drivers (username, name, age, phone, sex, license) VALUES
	('driver', 'Dump', 23, '0908321456', 'male', 'DSCKSAH'),
	('driverAlt', 'Zelenlandd', 32, '0928222333', 'male', 'UKREINE');
