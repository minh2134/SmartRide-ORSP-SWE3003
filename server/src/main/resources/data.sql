INSERT INTO users (username, password) VALUES
	('customer', '$2a$10$Y5WKyjlIddvaNbyzVmIQs.ZuYEknDUmL3VEQkfB1oNeckhL9C5XeG'),
	('driver', '$2a$10$OZrrCIj61p9acbvhF2UY9elt5Wt/LK58CjkOAHuFg8H/C0yzO0FLC'),
	('driverAlt', '$2a$10$q6t0dbbcd2RJEaVXpPmgiehEhEWbZRmRUz/Zkh3FSBryltOXNE2w2'),
	('manager', '$2a$10$6M1wXlXzhJVmtNoAry9Tmub0vn9XhYRqwJnHsLkGThn2OpYhghQVm');

INSERT INTO authorities (username, authority) VALUES
	('customer', 'ROLE_USER'),
	('driver', 'ROLE_USER'),
	('driverAlt', 'ROLE_USER'),
	('manager', 'ROLE_ADMIN');

INSERT INTO customers (username, name, age, phone, sex) VALUES 
	('customer', 'Puout', 46, '0903456879', 'male');

INSERT INTO drivers (username, name, age, phone, sex, license) VALUES
	('driver', 'Dump', 23, '0908321456', 'male', 'DSCKSAH'),
	('driverAlt', 'Zelenlandd', 32, '0928222333', 'male', 'UKREINE');

INSERT INTO managers (username, name, age, phone, sex) VALUES
	('manager', 'Durett', 43, '090909090', 'male');

INSERT INTO rides (customer, driver, pickupLoc, dropoffLoc, vehicleType, isDone, timeStamp) VALUES
	('customer', 'driver', 'default', 'default', 'car', 1, 10000000000);
