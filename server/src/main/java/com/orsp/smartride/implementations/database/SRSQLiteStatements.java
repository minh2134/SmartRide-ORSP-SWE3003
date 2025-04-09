package com.orsp.smartride.implementations.database;


// Separate sql statements to a new class to keep it clean from the logic
class SRSQLiteStatements {
	private String customers;
	private String drivers;

	public SRSQLiteStatements() {
		customers = "SELECT * FROM customers;";
		drivers = "SELECT * FROM drivers;";
	}

	public String getCustomers() {
		return customers;
	}

	public String getDrivers() {
		return drivers;
	}
}
