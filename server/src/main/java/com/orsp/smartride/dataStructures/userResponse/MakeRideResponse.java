package com.orsp.smartride.dataStructures.userResponse;

import com.orsp.smartride.coreLogic.ride.Ride;

public class MakeRideResponse extends UserResponse {
	
	private String rideID;
	private long timeStamp;


	public MakeRideResponse() {}

	public MakeRideResponse(Ride ride) {
		
		this.rideID = "1"; //TODO: implement a ride ID system later
		this.timeStamp = ride.getTimeStamp();
	}
	
	public long getTimeStamp() {
		return timeStamp;
	}

	public String getRideID() {
		return rideID;
	}
}
