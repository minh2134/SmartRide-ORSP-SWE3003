package com.orsp.smartride.implementations.database;


// Separate sql statements to a new class to keep it clean from the logic
class SRSQLiteStatements {
	private String customers;

	public SRSQLiteStatements() {
		customers = "SELECT * FROM customers;";
<<<<<<< Updated upstream
=======
		drivers = "SELECT * FROM drivers;";
		maxRideID = "SELECT MAX(rideID) FROM rides;";
		insertRide = "INSERT INTO rides (customer, driver, pickupLoc, dropoffLoc, vehicleType, timeStamp, fare) VALUES (?, ?, ?, ?, ?, ?, ?);";
		lastInsertRowID = "SELECT last_insert_rowid();";

>>>>>>> Stashed changes
	}

	public String getCustomers() {
		return customers;
	}
}
