package com.orsp.smartride.dataStructures.userResponse;

import java.util.Map;

/**
 * RideAssignmentResponse - Response for driver ready status including potential ride assignment
 */
public class RideAssignmentResponse extends UserResponse {
    private boolean rideAssigned;
    private Map<String, Object> rideData;
    
    public RideAssignmentResponse() {
        this.rideAssigned = false;
        this.rideData = null;
    }
    
    public RideAssignmentResponse(boolean rideAssigned, Map<String, Object> rideData) {
        this.rideAssigned = rideAssigned;
        this.rideData = rideData;
    }
    
    public boolean isRideAssigned() {
        return rideAssigned;
    }
    
    public void setRideAssigned(boolean rideAssigned) {
        this.rideAssigned = rideAssigned;
    }
    
    public Map<String, Object> getRideData() {
        return rideData;
    }
    
    public void setRideData(Map<String, Object> rideData) {
        this.rideData = rideData;
    }
} 