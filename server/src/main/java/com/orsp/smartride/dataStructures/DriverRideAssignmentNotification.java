package com.orsp.smartride.dataStructures;

import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.implementations.customer.SRCustomer;

/**
 * DriverRideAssignmentNotification
 */
public class DriverRideAssignmentNotification {

	private int rideID;
	private long timeStamp;
	private String customerName;

	public DriverRideAssignmentNotification() {}

	public DriverRideAssignmentNotification(Ride ride) {
		SRCustomer customer = (SRCustomer)ride.getCustomer();
		this.customerName = customer.getName();
		this.rideID = ride.getRideID();
		this.timeStamp = ride.getTimeStamp();
	}

	public long getTimeStamp() {
		return timeStamp;
	}

	public int getRideID() {
		return rideID;
	}

	public String getCustomerName() {
		return customerName;
	}
}
