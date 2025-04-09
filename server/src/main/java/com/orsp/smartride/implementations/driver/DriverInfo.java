package com.orsp.smartride.implementations.driver;

import com.orsp.smartride.dataStructures.UserInfo;

/**
 * DriverInfo
 */
public class DriverInfo extends UserInfo {
	private String license;

	public DriverInfo(String username, String license) {
		super(username);
		this.license = license;
	}

	public DriverInfo(DriverInfo target) {
		super(target);
		this.license = target.license;
	}
	
	public String getLicense() {
		return license;
	}
}
