package com.orsp.smartride.dataStructures;

public class RideRequest {
	public String dropoffLoc;
	public String pickupLoc;

	public RideRequest() {}

	public RideRequest(String dropoffLoc, String pickupLoc) {
		this.dropoffLoc = dropoffLoc;
		this.pickupLoc = pickupLoc;
	}
}
