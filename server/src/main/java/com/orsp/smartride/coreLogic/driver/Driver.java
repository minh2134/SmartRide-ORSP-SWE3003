package com.orsp.smartride.coreLogic.driver;

import com.orsp.smartride.coreLogic.ride.Ride;

// TODO: implement Driver class
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
}

