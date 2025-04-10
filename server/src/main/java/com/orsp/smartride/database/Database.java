package com.orsp.smartride.database;

import java.util.List;
import java.util.Map;

/**
 * Database - Interface for database operations
 */
public interface Database {
    
    /**
     * Mark a ride as complete in the database
     * @param rideID The ID of the ride to mark as complete
     * @return true if successful, false otherwise
     */
    boolean markRideComplete(int rideID);
    
    /**
     * Get ride history for a driver
     * @param username The driver's username
     * @return List of ride data as key-value maps
     */
    List<Map<String, Object>> getRideHistory(String username);
    
    /**
     * Get ride history for a customer
     * @param username The customer's username
     * @return List of ride data as key-value maps
     */
    List<Map<String, Object>> getRideHistoryForCustomer(String username);
    
    /**
     * Get ride history for a driver
     * @param username The driver's username
     * @return List of ride data as key-value maps
     */
    List<Map<String, Object>> getRideHistoryForDriver(String username);
    
    /**
     * Get active ride for a user (customer or driver)
     * @param username The username
     * @param isDriver Whether the user is a driver
     * @return Map containing ride details or null if no active ride
     */
    Map<String, Object> getActiveRideForUser(String username, boolean isDriver);
} 