package com.orsp.smartride.events.driver;

import org.springframework.context.ApplicationEvent;

import com.orsp.smartride.dataStructures.Location;

/**
 * DriverLocationChangeEvent
 */
public class DriverLocationChangeEvent extends ApplicationEvent {

	private int rideID;
	private Location location;

	public DriverLocationChangeEvent(Object source, int rideID, Location location) {
		super(source);
		this.rideID = rideID;
		this.location = location;
	}

	public int getRideID() {
		return rideID;
	}

	public Location getLocation() {
		return location;
	}
}
