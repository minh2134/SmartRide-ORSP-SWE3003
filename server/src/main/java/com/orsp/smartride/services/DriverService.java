package com.orsp.smartride.services;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.orsp.smartride.dataStructures.Location;
import com.orsp.smartride.events.driver.DriverLocationChangeEvent;
import com.orsp.smartride.implementations.driver.DriverInfo;
import com.orsp.smartride.implementations.driver.SRDriver;
import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.database.Database;
import com.orsp.smartride.dataStructures.userResponse.RideAssignmentResponse;

@Service
/**
 * DriverService
 *
 * Service to control SRDriver objects
 */
public class DriverService {
	
	@Autowired
	private ConcurrentHashMap<String, SRDriver> drivers;

	@Autowired
	private ApplicationEventPublisher applicationEventPublisher;

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@Autowired
	private Database db;

	public boolean exists(String username) {
		return !(drivers.get(username) == null);
	}

	public DriverInfo getDriverInfo(String username) {
		SRDriver driver = drivers.get(username);
		return driver.driverInfo;
	}

	public void changeLocation(String username, Location location) {
		SRDriver driver = drivers.get(username);
		driver.location = location;

		// publish the event
		DriverLocationChangeEvent event = new DriverLocationChangeEvent(this, driver.getRideID(), location);
		applicationEventPublisher.publishEvent(event);
	}
	
	public RideAssignmentResponse setDriverReady(String username) {
		SRDriver driver = drivers.get(username);
		if (driver == null) {
		    return new RideAssignmentResponse(false, null);
		}
		
		// Mark the driver as ready to accept rides
		driver.setReady(true);
		
		// Check if there's a waiting ride to assign
		// For now just return a response with no assigned ride
		return new RideAssignmentResponse(false, null);
	}
	
	public boolean setDriverNotReady(String username) {
		SRDriver driver = drivers.get(username);
		if (driver == null) {
		    return false;
		}
		
		// Only allow if driver doesn't have an active ride
		if (driver.getRide() != null) {
		    return false;
		}
		
		// Mark the driver as not ready to accept rides
		driver.setReady(false);
		return true;
	}
	
	public boolean confirmPickup(String username, int rideID) {
		SRDriver driver = drivers.get(username);
		if (driver == null) {
			return false;
		}
		
		// Verify this driver is assigned to this ride
		if (driver.getRideID() != rideID) {
			return false;
		}
		
		// Notify customer that the driver has confirmed pickup
		// This would normally update ride status in database to "in_progress"
		// For now, we'll just notify the customer through the WebSocket
		
		// Get the ride details
		Ride coreRide = driver.getRide();
		if (coreRide == null) {
			return false;
		}
		
		// Create a notification message
		Map<String, Object> notification = new HashMap<>();
		notification.put("type", "ride_update");
		notification.put("rideID", rideID);
		notification.put("status", "in_progress");
		notification.put("message", "Driver has picked you up");
		
		// Send to the customer
		simpMessagingTemplate.convertAndSendToUser(
			coreRide.getCustomer().toString(),  // username
			"/topic/customer/notification",  // destination
			notification  // payload
		);
		
		return true;
	}
	
	public boolean completeRide(String username, int rideID) {
		SRDriver driver = drivers.get(username);
		if (driver == null) {
			return false;
		}
		
		// Verify this driver is assigned to this ride
		if (driver.getRideID() != rideID) {
			return false;
		}
		
		// Get the ride before completing it (for notification)
		Ride coreRide = driver.getRide();
		if (coreRide == null) {
			return false;
		}
		
		String customerUsername = coreRide.getCustomer().toString();
		
		// Mark ride as complete in database
		db.markRideComplete(rideID);
		
		// Update driver state
		driver.setRide(null);
		
		// Create completion notification
		Map<String, Object> notification = new HashMap<>();
		notification.put("type", "ride_update");
		notification.put("rideID", rideID);
		notification.put("status", "completed");
		notification.put("message", "You have arrived at your destination!");
		
		// Send to the customer
		simpMessagingTemplate.convertAndSendToUser(
			customerUsername,  // username
			"/topic/customer/notification",  // destination
			notification  // payload
		);
		
		return true;
	}
	
	public List<Map<String, Object>> getRideHistory(String username) {
		// Get ride history from database
		return db.getRideHistoryForDriver(username);
	}
}
