package com.orsp.smartride.dataStructures;

/**
 * RideIDRequest - A data structure for ride identification requests
 */
public class RideIDRequest {
    private int rideID;

    // Default constructor for JSON deserialization
    public RideIDRequest() {
    }

    public RideIDRequest(int rideID) {
        this.rideID = rideID;
    }

    public int getRideID() {
        return rideID;
    }

    public void setRideID(int rideID) {
        this.rideID = rideID;
    }
} 