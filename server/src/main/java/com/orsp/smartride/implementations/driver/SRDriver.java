package com.orsp.smartride.implementations.driver;

import com.orsp.smartride.coreLogic.driver.Driver;
import com.orsp.smartride.dataStructures.Location;

/**
 * SRDriver - Implementation of Driver for SmartRide
 */
public class SRDriver extends Driver {
	public DriverInfo driverInfo;
	public Location location;
	private boolean isReady;

	public SRDriver() {
		this.driverInfo = new DriverInfo();
		this.location = new Location(0, 0);
		this.isReady = false;
	}

	public SRDriver(DriverInfo driverInfo) {
		this.driverInfo = driverInfo;
		this.location = new Location(0, 0);
		this.isReady = false;
	}

	public String getUsername() {
		return driverInfo.getUsername();
	}

	public boolean isReady() {
		return isReady;
	}

	public void setReady(boolean ready) {
		isReady = ready;
	}
}
