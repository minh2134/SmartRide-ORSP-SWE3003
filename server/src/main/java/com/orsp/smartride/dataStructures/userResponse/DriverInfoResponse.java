package com.orsp.smartride.dataStructures.userResponse;

import com.orsp.smartride.implementations.driver.DriverInfo;

/**
 * DriverInfoResponse
 */
public class DriverInfoResponse extends UserInfoResponse {

	private String license;

	public DriverInfoResponse(DriverInfo that) {
		super(that);
		this.license = that.getLicense();
	}

	public String getLicense() {
		return license;
	}
}
