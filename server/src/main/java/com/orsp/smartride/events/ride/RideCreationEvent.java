package com.orsp.smartride.events.ride;

import org.springframework.context.ApplicationEvent;

import com.orsp.smartride.coreLogic.ride.Ride;

/**
 * RideCreationEvent
 */
public class RideCreationEvent extends ApplicationEvent {
	
	private Ride ride;

	public RideCreationEvent(Object source, Ride ride) {
		super(source);
		this.ride = ride;
	}

	public Ride getRide() {
		return ride;
	}
}
