package com.orsp.smartride.coreLogic.customer;

import com.orsp.smartride.coreLogic.ride.Ride;

abstract public class Customer {
	Ride ride;
	
	// TODO: implementing making a ride
	public void makeRide() {
		// TODO: make a Ride class, then associate with it
	}
	
	// TODO: implementing (a mock-up version of) payment
	public void pay() {}

	// TODO: implementing getting driver's location and handle it
	public void requestLoc() {}

	public boolean isRideDone() {
		// TODO: query the associated Ride class to get its status
		return false;
	}
}
