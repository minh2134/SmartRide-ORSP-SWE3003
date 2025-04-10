package com.orsp.smartride.events.driver;

import org.springframework.context.ApplicationEvent;

import com.orsp.smartride.coreLogic.ride.Ride;

/**
 * DriverAssignmentEvent
 */
public class DriverAssignmentEvent extends ApplicationEvent {
	
	private Ride ride;

	public DriverAssignmentEvent(Object source, Ride ride) {
		super(source);

		this.ride = ride;
	}

	public Ride getRide() {
		return ride;
	}
}
