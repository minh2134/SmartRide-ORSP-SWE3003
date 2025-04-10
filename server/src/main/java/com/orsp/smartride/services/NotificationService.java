package com.orsp.smartride.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.orsp.smartride.coreLogic.ride.Ride;
import com.orsp.smartride.dataStructures.Location;
import com.orsp.smartride.dataStructures.unidirectionalMessage.LocationUpdate;

/**
 * Service for sending notifications to clients
 */
@Service
public class NotificationService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    /**
     * Send a driver location update to a customer for a specific ride
     * 
     * @param customerUsername The customer's username
     * @param rideId The ride ID
     * @param location The driver's location
     */
    public void sendLocationUpdate(String customerUsername, int rideId, Location location) {
        LocationUpdate update = new LocationUpdate(
            location.getLat(),
            location.getLon(),
            rideId
        );
        
        // Send to the customer's ride-specific topic
        String destination = "/user/" + customerUsername + "/topic/customer/ride/" + rideId;
        messagingTemplate.convertAndSend(destination, update);
        
        System.out.println("Sent location update to " + customerUsername + " for ride " + rideId);
    }
    
    /**
     * Send a ride status update to a customer
     * 
     * @param customerUsername The customer's username
     * @param ride The ride object
     * @param statusMessage The status message to send
     */
    public void sendRideStatusUpdate(String customerUsername, Ride ride, String statusMessage) {
        // Create a status update message
        // This would use another subclass of UnidirectionalMessage
        // For now, we'll just use a generic message with the LocationUpdate class
        LocationUpdate update = new LocationUpdate();
        update.setRideID(ride.getRideID());
        
        // Send to the customer's ride-specific topic
        String destination = "/user/" + customerUsername + "/topic/customer/ride/" + ride.getRideID();
        messagingTemplate.convertAndSend(destination, update);
        
        System.out.println("Sent ride status update to " + customerUsername + " for ride " + ride.getRideID() + ": " + statusMessage);
    }
    
    /**
     * Send a ride assigned notification to a driver
     * 
     * @param driverUsername The driver's username
     * @param ride The assigned ride
     */
    public void sendRideAssignedNotification(String driverUsername, Ride ride) {
        // Create a ride assignment notification
        // This would use another subclass of UnidirectionalMessage
        LocationUpdate update = new LocationUpdate();
        update.setRideID(ride.getRideID());
        
        // Send to the driver's ride-specific topic
        String destination = "/user/" + driverUsername + "/topic/driver/ride/" + ride.getRideID();
        messagingTemplate.convertAndSend(destination, update);
        
        System.out.println("Sent ride assignment notification to " + driverUsername + " for ride " + ride.getRideID());
    }
} 