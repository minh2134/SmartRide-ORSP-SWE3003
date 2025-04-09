package com.orsp.smartride.coreLogic.ride;

/**
 * RideInfo
 */
abstract public class RideInfo {

	private String dropoffLoc;
	private String pickupLoc;
	private String vehicleType;
	private String paymentMethod;
	private float estimatedFare;

	public String getDropoffLoc() {
		return dropoffLoc;
	}

	public String getPickupLoc() {
		return pickupLoc;
	}

	public String getVehicleType() {
		return vehicleType;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public float getEstimatedFare() {
		return estimatedFare;
	}


}
