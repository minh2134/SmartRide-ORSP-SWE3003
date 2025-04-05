package com.orsp.smartride.coreLogic.ride;

import com.orsp.smartride.coreLogic.customer.Customer;
import com.orsp.smartride.coreLogic.driver.Driver;

public class Ride {
	Customer customer;
	Driver driver;
	String pickupLoc;
	String dropoffLoc;

	public Ride(Customer customer, String pickupLoc, String dropoffLoc) {
		this.customer = customer;
		this.pickupLoc = pickupLoc;
		this.dropoffLoc = dropoffLoc;
	}

	public boolean findDriver() {
		// TODO: query database, find driver, associate, then return the status
		return true;
	}

	// TODO: returning driver location
	public void getDriverLoc() {}

	public Customer getCustomer() {
		return customer;
	}

	public Driver getDriver() {
		return driver;
	}

	public String getPickupLoc() {
		return pickupLoc;
	}

	public String getDropoffLoc() {
		return dropoffLoc;
	}
}
