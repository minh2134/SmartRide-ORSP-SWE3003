package com.orsp.smartride.coreLogic.driver;

import com.orsp.smartride.coreLogic.ride.Ride;

public class Driver{
	protected Ride ride;
	
	public void cancelRide() {
		if (ride != null) {
			ride.cancel();
		}
	}

	public void cancelRideHelper() {
		ride = null;
	}

	public void setRideHelper(Ride ride) {
		this.ride = ride;
	}

	public int getRideID() {
		return ride.getRideID();
	}

	public boolean isInARide() {
		return (ride == null);
	}

}

