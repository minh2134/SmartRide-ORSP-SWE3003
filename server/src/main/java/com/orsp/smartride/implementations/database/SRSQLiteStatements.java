package com.orsp.smartride.implementations.database;


// Separate sql statements to a new class to keep it clean from the logic
class SRSQLiteStatements {
	private String customers;
	private String drivers;
	private String maxRideID;
	private String insertRide;
	private String lastInsertRowID;
	private String removeRide;
	private String getRides;

	public SRSQLiteStatements() {
		customers = "SELECT * FROM customers;";
		drivers = "SELECT * FROM drivers;";
		maxRideID = "SELECT MAX(rideID) FROM rides;";
		insertRide = "INSERT INTO rides (customer, driver, pickupLoc, dropoffLoc, vehicleType, timeStamp) VALUES (?, ?, ?, ?, ?, ?);";
		lastInsertRowID = "SELECT last_insert_rowid();";
		removeRide = "DELETE FROM rides WHERE rideID = ?;";
		getRides = "SELECT * FROM rides;";

	}

	public String getCustomers() {
		return customers;
	}

	public String getDrivers() {
		return drivers;
	}

	public String getMaxRideID() {
		return maxRideID;
	}

	public String getInsertRide() {
		return insertRide;
	}

	public String getLastInsertRowID() {
		return lastInsertRowID;
	}

	public String getRemoveRide() {
		return removeRide;
	}

	public String getGetRides() {
		return getRides;
	}
}
