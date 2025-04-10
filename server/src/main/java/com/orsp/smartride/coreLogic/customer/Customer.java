package com.orsp.smartride.coreLogic.customer;

import com.orsp.smartride.coreLogic.ride.RideInfo;
import com.orsp.smartride.coreLogic.payment.Payment;
import com.orsp.smartride.coreLogic.ride.Ride;

abstract public class Customer {
	protected Ride ride;
	
	public Ride makeRide(RideInfo rideInfo, int rideID, long timeStamp) {
		if (ride == null) {
			ride = new Ride(this, rideInfo, rideID, timeStamp);
		}

		return ride;
	}

	public void setRideHelper(Ride ride) {
		this.ride = ride;
	}
	
	public boolean pay(Payment paymentMethod) {
		return paymentMethod.pay();
	}

	public void markRideDone() {
		ride = null;
		return;
	}

	public void cancelRide() {
		if (ride != null) {
			ride.cancel();
		}
	}

	public void cancelRideHelper() {
		ride = null;
	}

	public boolean isInARide() {
		return ride != null;
	}

	public Ride getRide() {
		return ride;
	}
}
