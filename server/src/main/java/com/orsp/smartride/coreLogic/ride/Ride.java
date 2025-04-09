package com.orsp.smartride.coreLogic.ride;

import com.orsp.smartride.coreLogic.customer.Customer;
import com.orsp.smartride.coreLogic.driver.Driver;

public class Ride {
	Customer customer;
	Driver driver;

	private int rideID;
	private String pickupLoc;
	private String dropoffLoc;
	private float fare;
	private String vehicleType;
	private long timeStamp;

	private static long nextRideID = 1;

	public Ride(Customer customer, RideInfo rrq, int rideID, long timeStamp) {
		this.customer = customer;
		this.pickupLoc = rrq.getPickupLoc();
		this.dropoffLoc = rrq.getDropoffLoc();
		this.fare = rrq.getEstimatedFare();
		this.vehicleType = rrq.getVehicleType();
		this.rideID = rideID;
		this.timeStamp = timeStamp;
	}

	public boolean findDriver() {
		// TODO: query database, find driver, associate, then return the status
		return true;
	}

	public void cancel() {
		customer.cancelRideHelper();
		if (driver != null) {
			driver.cancelRideHelper();
		}
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

	public float getFare() {
		return fare;
	}

	public String getVehicleType() {
		return vehicleType;
	}


	public int getRideID() {
		return rideID;
	}

	public long getTimeStamp() {
		return timeStamp;
	}
}
