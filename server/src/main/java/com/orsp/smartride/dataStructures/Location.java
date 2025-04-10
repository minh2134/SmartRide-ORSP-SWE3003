package com.orsp.smartride.dataStructures;

/**
 * Location - Represents a geographical location
 */
public class Location {
	private double latitude;
	private double longitude;
	
	public Location() {
		this.latitude = 0.0;
		this.longitude = 0.0;
	}
	
	public Location(double latitude, double longitude) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
	
	public double getLatitude() {
		return latitude;
	}
	
	public double getLongitude() {
		return longitude;
	}
	
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
}
