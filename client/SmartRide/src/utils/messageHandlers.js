/**
 * Message handlers for unidirectional messages from the server
 * 
 * This file contains handlers for different types of messages sent from the server
 * to the client without requiring a response, such as location updates.
 */

import { notifyDriverRideChange, notifyRideStatusChange } from '../services/api';

// Map of registered location update callbacks by ride ID
const locationUpdateCallbacks = new Map();

/**
 * Register a callback for location updates for a specific ride
 * @param {string|number} rideId - The ride ID to listen for updates
 * @param {function} callback - Function to call when location updates are received
 * @returns {boolean} - True if registered successfully
 */
export const subscribeToLocationUpdates = (rideId, callback) => {
  if (!rideId || typeof callback !== 'function') {
    console.error('Invalid parameters for location update subscription');
    return false;
  }
  
  const rideKey = rideId.toString();
  
  // Create a new set of callbacks for this ride if it doesn't exist
  if (!locationUpdateCallbacks.has(rideKey)) {
    locationUpdateCallbacks.set(rideKey, new Set());
  }
  
  // Add this callback to the set
  locationUpdateCallbacks.get(rideKey).add(callback);
  return true;
};

/**
 * Unregister a callback for location updates
 * @param {string|number} rideId - The ride ID to stop listening for
 * @param {function} callback - The callback function to remove
 * @returns {boolean} - True if unregistered successfully
 */
export const unsubscribeFromLocationUpdates = (rideId, callback) => {
  if (!rideId) return false;
  
  const rideKey = rideId.toString();
  
  if (locationUpdateCallbacks.has(rideKey)) {
    if (callback) {
      // Remove this specific callback
      return locationUpdateCallbacks.get(rideKey).delete(callback);
    } else {
      // Remove all callbacks for this ride
      return locationUpdateCallbacks.delete(rideKey);
    }
  }
  
  return false;
};

/**
 * Handle an incoming unidirectional message
 * @param {Object} message - The message received from the server
 * @param {string} rideId - The ride ID associated with this message
 */
export const handleUnidirectionalMessage = (message, rideId) => {
  console.log('Received unidirectional message:', message, 'for ride:', rideId);
  
  if (!message || !message.method) {
    console.error('Invalid unidirectional message format:', message);
    return;
  }
  
  switch (message.method) {
    case 'locationChange':
      handleLocationUpdate(message.content, rideId);
      break;
    case 'rideStatusChange':
      handleRideStatusChange(message.content, rideId);
      break;
    default:
      console.warn('Unknown unidirectional message type:', message.method);
  }
};

/**
 * Handle a location update message
 * @param {Object} locationData - The location data from the server
 * @param {string|number} rideId - The ride ID this update is for
 */
const handleLocationUpdate = (locationData, rideId) => {
  if (!locationData || !rideId) {
    console.error('Invalid location update data:', locationData);
    return;
  }
  
  const rideKey = rideId.toString();
  
  // Notify all registered callbacks for this ride
  if (locationUpdateCallbacks.has(rideKey)) {
    const callbacks = locationUpdateCallbacks.get(rideKey);
    
    callbacks.forEach(callback => {
      try {
        callback(locationData);
      } catch (error) {
        console.error('Error in location update callback:', error);
      }
    });
  }
};

/**
 * Handle a ride status change message
 * @param {Object} statusData - The status data from the server
 * @param {string|number} rideId - The ride ID this update is for
 */
const handleRideStatusChange = (statusData, rideId) => {
  // Update the ride state in the API service
  notifyRideStatusChange();
  
  // If this is a driver ride status change, also notify driver subscribers
  if (statusData && statusData.forDriver) {
    notifyDriverRideChange();
  }
}; 