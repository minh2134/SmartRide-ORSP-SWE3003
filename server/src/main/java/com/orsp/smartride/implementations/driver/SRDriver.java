package com.orsp.smartride.implementations.driver;

import com.orsp.smartride.coreLogic.driver.Driver;

/**
 * SRDriver
 */
public class SRDriver extends Driver {
	public DriverInfo driverInfo;

	public SRDriver(String username, String license) {
		this.driverInfo = new DriverInfo(username, license);
	}

	public SRDriver(DriverInfo driverInfo) {
		this.driverInfo = new DriverInfo(driverInfo);
	}

	public String getUsername() {
		return driverInfo.getUsername();
	}

}
