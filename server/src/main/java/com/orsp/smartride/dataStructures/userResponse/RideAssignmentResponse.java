package com.orsp.smartride.dataStructures.userResponse;

import com.orsp.smartride.coreLogic.ride.Ride;

public class RideAssignmentResponse extends UserResponse {
    private int rideID;
    private String customer;
    private String pickupLoc;
    private String dropoffLoc;
    private String vehicleType;
    private float fare;
    private long timeStamp;
    
    public RideAssignmentResponse() {}
    
    public RideAssignmentResponse(Ride ride) {
        if (ride != null) {
            this.rideID = ride.getRideID();
            this.customer = ride.getCustomer() != null ? ride.getCustomer().toString() : "";
            this.pickupLoc = ride.getPickupLoc();
            this.dropoffLoc = ride.getDropoffLoc();
            this.vehicleType = ride.getVehicleType();
            this.fare = ride.getFare();
            this.timeStamp = ride.getTimeStamp();
        }
    }
    
    public int getRideID() {
        return rideID;
    }
    
    public String getCustomer() {
        return customer;
    }
    
    public String getPickupLoc() {
        return pickupLoc;
    }
    
    public String getDropoffLoc() {
        return dropoffLoc;
    }
    
    public String getVehicleType() {
        return vehicleType;
    }
    
    public float getFare() {
        return fare;
    }
    
    public long getTimeStamp() {
        return timeStamp;
    }
} 