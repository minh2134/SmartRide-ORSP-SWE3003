package com.orsp.smartride.events.ride;

import org.springframework.context.ApplicationEvent;

import com.orsp.smartride.dataStructures.Location;

/**
 * RideLocationChange
 */
public class RideLocationChange extends ApplicationEvent{

	private String customerUsername;
	private Location location;
	private int rideID;

	public RideLocationChange(Object source, String customerUsername, Location location, int rideID) {
		super(source);
		this.customerUsername = customerUsername;
		this.location = location;
		this.rideID = rideID;
	}

	public String getCustomerUsername() {
		return customerUsername;
	}

	public Location getLocation() {
		return location;
	}

	public int getRideID() {
		return rideID;
	}
}
