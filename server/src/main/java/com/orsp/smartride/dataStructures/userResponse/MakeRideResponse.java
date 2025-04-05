package com.orsp.smartride.dataStructures.userResponse;

import com.orsp.smartride.coreLogic.ride.Ride;

public class MakeRideResponse extends UserResponse {
	
	String pickupLoc;
	String dropoffLoc;

	public MakeRideResponse() {}

	public MakeRideResponse(Ride ride) {
		this.pickupLoc = ride.getPickupLoc();
		this.dropoffLoc = ride.getDropoffLoc();
	}
	
	public String getPickupLoc() {
		return pickupLoc;
	}

	public String getDropoffLoc() {
		return dropoffLoc;
	}
}
