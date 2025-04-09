package com.orsp.smartride.services;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.orsp.smartride.dataStructures.Location;
import com.orsp.smartride.events.driver.DriverLocationChangeEvent;
import com.orsp.smartride.implementations.driver.DriverInfo;
import com.orsp.smartride.implementations.driver.SRDriver;

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
}
