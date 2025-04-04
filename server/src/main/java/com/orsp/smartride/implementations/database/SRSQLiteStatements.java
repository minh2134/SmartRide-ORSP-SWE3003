package com.orsp.smartride.implementations.database;


// Separate sql statements to a new class to keep it clean from the logic
class SRSQLiteStatements {
	private String customers;

	public SRSQLiteStatements() {
		customers = "SELECT * FROM customers;";
	}

	public String getCustomers() {
		return customers;
	}
}
