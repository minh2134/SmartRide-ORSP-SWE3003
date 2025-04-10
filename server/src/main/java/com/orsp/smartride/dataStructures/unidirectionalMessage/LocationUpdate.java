package com.orsp.smartride.dataStructures.unidirectionalMessage;

import com.orsp.smartride.dataStructures.UnidirectionalMessage;

/**
 * LocationUpdate - Message sent to update driver/passenger location
 */
public class LocationUpdate extends UnidirectionalMessage {
    private double latitude;
    private double longitude;
    private String userType; // "driver" or "customer"
    private String username;
    private String rideID;

    public LocationUpdate() {
        super("location_update", null);
    }

    public LocationUpdate(double latitude, double longitude, String userType, String username, String rideID) {
        super("location_update", null);
        this.latitude = latitude;
        this.longitude = longitude;
        this.userType = userType;
        this.username = username;
        this.rideID = rideID;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getUserType() {
        return userType;
    }

    public String getUsername() {
        return username;
    }

    public String getRideID() {
        return rideID;
    }
}
