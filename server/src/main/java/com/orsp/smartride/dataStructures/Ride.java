package com.orsp.smartride.dataStructures;

/**
 * Ride - Data structure for ride information
 */
public class Ride {
    private int rideID;
    private Object customer; // Using Object for flexibility
    private String pickupLoc;
    private String dropoffLoc;
    private String vehicleType;
    private float fare;
    private long timeStamp;
    
    public Ride() {
    }
    
    public Ride(int rideID, Object customer, String pickupLoc, String dropoffLoc, 
                String vehicleType, float fare, long timeStamp) {
        this.rideID = rideID;
        this.customer = customer;
        this.pickupLoc = pickupLoc;
        this.dropoffLoc = dropoffLoc;
        this.vehicleType = vehicleType;
        this.fare = fare;
        this.timeStamp = timeStamp;
    }
    
    public int getRideID() {
        return rideID;
    }
    
    public Object getCustomer() {
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
    
    public void setRideID(int rideID) {
        this.rideID = rideID;
    }
    
    public void setCustomer(Object customer) {
        this.customer = customer;
    }
    
    public void setPickupLoc(String pickupLoc) {
        this.pickupLoc = pickupLoc;
    }
    
    public void setDropoffLoc(String dropoffLoc) {
        this.dropoffLoc = dropoffLoc;
    }
    
    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }
    
    public void setFare(float fare) {
        this.fare = fare;
    }
    
    public void setTimeStamp(long timeStamp) {
        this.timeStamp = timeStamp;
    }
    
    public void cancel() {
        // Implementation for canceling a ride
    }
} 