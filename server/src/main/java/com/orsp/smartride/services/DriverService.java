package com.orsp.smartride.services;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

	public boolean exists(String username) {
		return !(drivers.get(username) == null);
	}

	public DriverInfo getDriverInfo(String username) {
		SRDriver driver = drivers.get(username);
		return driver.driverInfo;
	}

	
}
