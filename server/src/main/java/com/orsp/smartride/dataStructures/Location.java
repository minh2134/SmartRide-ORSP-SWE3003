package com.orsp.smartride.dataStructures;

/**
 * Location
 */
public class Location {

	private float lat;
	private float lon;

	public Location() {}
	public Location(float lat, float lon) {
		this.lat = lat;
		this.lon = lon;
	}

	public float getLat() {
		return lat;
	}

	public float getLon() {
		return lon;
	}
}
