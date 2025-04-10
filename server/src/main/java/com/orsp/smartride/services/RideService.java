package com.orsp.smartride.services;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.dataStructures.Location;
import com.orsp.smartride.events.driver.DriverLocationChangeEvent;
import com.orsp.smartride.events.ride.RideCreationEvent;
import com.orsp.smartride.events.ride.RideLocationChange;
import com.orsp.smartride.implementations.customer.SRCustomer;

@Service
/**
 * RideService
 */
public class RideService {

	@Autowired
	private ConcurrentHashMap<Integer, Ride> rides;

	@Autowired
	private ApplicationEventPublisher applicationEventPublisher;
	
	@Autowired
	private NotificationService notificationService;

	@EventListener
	public void handleRideCreationEvent(RideCreationEvent event) {
		Ride ride = event.getRide();
		int rideID = ride.getRideID();
		System.out.println("A ride just created, ID: " + rideID);

		rides.put(rideID, ride);
		
		// Send notification to customer about ride status
		SRCustomer customer = (SRCustomer) ride.getCustomer();
		notificationService.sendRideStatusUpdate(
			customer.getUsername(),
			ride,
			"Ride created, finding driver"
		);

		return;
	}

	@EventListener
	public void handleDriverLocationChangeEvent(DriverLocationChangeEvent event) {
		if (!exists(event.getRideID())) {
			return;
		}

		Ride ride = rides.get(event.getRideID());
		SRCustomer customer = (SRCustomer) ride.getCustomer();
		
		// Send location update directly to the customer
		notificationService.sendLocationUpdate(
			customer.getUsername(), 
			event.getRideID(),
			event.getLocation()
		);
		
		// Also publish as an event for other services that might need it
		RideLocationChange newEvent = new RideLocationChange(
			this, 
			customer.getUsername(), 
			event.getLocation(), 
			event.getRideID()
		);
		applicationEventPublisher.publishEvent(newEvent);
	}

	public boolean exists(int rideID) {
		return rides.get(rideID) != null;
	}
	

	public Ride getRide(int rideID) {
		return rides.get(rideID);
	}
}
