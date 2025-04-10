package com.orsp.smartride.implementations.driver;

import com.orsp.smartride.coreLogic.driver.Driver;
import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.dataStructures.Location;

/**
 * SRDriver
 */
public class SRDriver extends Driver {
	public DriverInfo driverInfo;
	private boolean isReady = false;
	public Location location;

	public SRDriver(String username, String license) {
		this.driverInfo = new DriverInfo(username, license);
	}

	public SRDriver(DriverInfo driverInfo) {
		this.driverInfo = driverInfo;
	}

	public String getUsername() {
		return driverInfo.getUsername();
	}

	public void setReady(boolean ready) {
		this.isReady = ready;
	}

	public boolean isReady() {
		return isReady;
	}

	public void setCurrentRide(Ride ride) {
		this.ride = ride;
	}

	public Ride getCurrentRide() {
		return this.ride;
	}
}
