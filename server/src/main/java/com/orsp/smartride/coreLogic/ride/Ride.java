package com.orsp.smartride.coreLogic.ride;

import com.orsp.smartride.coreLogic.customer.Customer;
import com.orsp.smartride.coreLogic.driver.Driver;

public class Ride {
	Customer customer;
	Driver driver;

	public Ride(Customer customer, Driver driver) {
		this.customer = customer;
		this.driver = driver;
	}

	// TODO: returning driver location
	public void getDriverLoc() {}
}
