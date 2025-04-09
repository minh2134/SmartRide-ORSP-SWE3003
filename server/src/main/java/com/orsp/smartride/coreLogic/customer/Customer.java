package com.orsp.smartride.coreLogic.customer;

import com.orsp.smartride.coreLogic.ride.RideInfo;
import com.orsp.smartride.coreLogic.payment.Payment;
import com.orsp.smartride.coreLogic.ride.Ride;

abstract public class Customer {
	protected Ride ride;
	
	public Ride makeRide(RideInfo rideInfo) {
		ride = new Ride(this, rideInfo);
		boolean result = ride.findDriver();
		return ride;
	}
	
	public boolean pay(Payment paymentMethod) {
		return paymentMethod.pay();
	}

	public void markRideDone() {
		ride = null;
		return;
	}
}
