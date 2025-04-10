package com.orsp.smartride.dataStructures.userResponse;

import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.implementations.driver.SRDriver;

public class MakeRideResponse extends UserResponse {
	
	private int rideID;
	private long timeStamp;
	private String driverName;


	public MakeRideResponse() {}

	public MakeRideResponse(Ride ride) {
		this.rideID = ride.getRideID();
		this.timeStamp = ride.getTimeStamp();
		
		SRDriver driver = (SRDriver)ride.getDriver();
		this.driverName = driver.getName();
	}
	
	public long getTimeStamp() {
		return timeStamp;
	}

	public int getRideID() {
		return rideID;
	}

	public String getDriverName() {
		return driverName;
	}
}
