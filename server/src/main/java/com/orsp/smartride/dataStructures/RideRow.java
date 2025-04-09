package com.orsp.smartride.dataStructures;

/**
 * RideRow
 */
public class RideRow {

	public int rideID;
	public String customer;
	public String driver;
	public String pickupLoc;
	public String dropoffLoc;
	public String vehicleType;
	public int isDone;
	public long timeStamp;

	public RideRow(int rideID) {
		this.rideID = rideID;
	}

	public RideRow(String customer, RideRequest rrq) {
		this.customer = customer;
		this.pickupLoc = rrq.getPickupLoc();
		this.dropoffLoc = rrq.getDropoffLoc();
		this.vehicleType = rrq.getVehicleType();
		this.timeStamp = System.currentTimeMillis()/1000L;
	}
}
