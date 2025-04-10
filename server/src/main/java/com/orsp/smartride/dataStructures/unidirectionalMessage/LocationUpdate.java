package com.orsp.smartride.dataStructures.unidirectionalMessage;

import com.orsp.smartride.dataStructures.UnidirectionalMessage;

public class LocationUpdate extends UnidirectionalMessage {
	private double latitude;
	private double longitude;
	private int rideID;
	
	public LocationUpdate() {
		super();
	}
	
	public LocationUpdate(double latitude, double longitude, int rideID) {
		super("locationChange", null);
		this.latitude = latitude;
		this.longitude = longitude;
		this.rideID = rideID;
	}
	
	public double getLatitude() {
		return latitude;
	}
	
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	
	public double getLongitude() {
		return longitude;
	}
	
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	
	public int getRideID() {
		return rideID;
	}
	
	public void setRideID(int rideID) {
		this.rideID = rideID;
	}
}
