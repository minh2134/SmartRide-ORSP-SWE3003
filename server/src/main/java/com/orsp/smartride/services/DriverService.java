package com.orsp.smartride.services;

import java.util.concurrent.ConcurrentHashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.orsp.smartride.dataStructures.Location;
import com.orsp.smartride.events.driver.DriverLocationChangeEvent;
import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.dataStructures.userResponse.RideAssignmentResponse;
import com.orsp.smartride.implementations.database.SRDatabase;
import com.orsp.smartride.implementations.driver.DriverInfo;
import com.orsp.smartride.implementations.driver.SRDriver;
import com.orsp.smartride.dataStructures.RideRow;
import com.orsp.smartride.implementations.customer.SRCustomer;
import com.orsp.smartride.services.NotificationService;

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
	private SRDatabase db;
	
	@Autowired
	private CustomerService customerService;
	
	@Autowired
	private ApplicationEventPublisher applicationEventPublisher;
	
	@Autowired
	private NotificationService notificationService;

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
		driver.setReady(true);
		
		Ride pendingRide = db.getNextPendingRide();
		
		if (pendingRide != null) {
			assignRideToDriver(driver, pendingRide);
			
			// Send notification to the driver about the ride assignment
			notificationService.sendRideAssignedNotification(
				username,
				pendingRide
			);
			
			SRCustomer customer = (SRCustomer) pendingRide.getCustomer();
			notificationService.sendRideStatusUpdate(
				customer.getUsername(),
				pendingRide,
				"Driver assigned"
			);
			
			return new RideAssignmentResponse(pendingRide);
		}
		
		return new RideAssignmentResponse();
	}
	
	private void assignRideToDriver(SRDriver driver, Ride ride) {
		driver.setCurrentRide(ride);
		db.updateRideDriver(ride.getRideID(), driver.getUsername());
	}
	
	public boolean completeRide(String username, int rideID) {
		SRDriver driver = drivers.get(username);
		
		if (driver.getCurrentRide() != null && driver.getCurrentRide().getRideID() == rideID) {
			Ride completedRide = driver.getCurrentRide();
			
			db.markRideComplete(rideID);
			SRCustomer customer = (SRCustomer) completedRide.getCustomer();
			notificationService.sendRideStatusUpdate(
				customer.getUsername(),
				completedRide,
				"Ride completed"
			);
			
			// Finally clear the driver's state
			driver.setCurrentRide(null);
			driver.setReady(false);
			
			return true;
		}
		
		return false;
	}
	
	public List<RideRow> getRideHistory(String username) {
		return db.getRideHistoryForDriver(username);
	}

	/**
	 * Sets the driver as not ready without canceling any active ride
	 * 
	 * @param username The driver's username
	 */
	public void setDriverNotReady(String username) {
		SRDriver driver = drivers.get(username);
		
		// Only set not ready if the driver doesn't have an active ride
		if (driver.getCurrentRide() == null) {
			driver.setReady(false);
			System.out.println("Driver " + username + " set to not ready");
		} else {
			System.out.println("Driver " + username + " has an active ride, cannot set to not ready");
		}
	}
}
