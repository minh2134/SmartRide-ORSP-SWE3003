import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MapView, { Marker } from 'react-native-maps';
import { subscribeToLocationUpdates, unsubscribeFromLocationUpdates } from '../../utils/messageHandlers';
import { subscribeToRideSpecificUpdates } from '../../services/api';
import colors from '../../theme/colors';

/**
 * Component to track and display driver location updates during a ride
 */
const LocationTracker = ({ rideId, initialLocation, pickupLocation, dropoffLocation }) => {
  const [driverLocation, setDriverLocation] = useState(initialLocation || null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Handle incoming location updates
  const handleLocationUpdate = (location) => {
    if (!location) return;
    
    console.log('Received location update:', location);
    
    setDriverLocation({
      latitude: location.latitude || 0,
      longitude: location.longitude || 0
    });
    
    setLastUpdate(new Date());
  };
  
  // Subscribe to location updates when the component mounts
  useEffect(() => {
    if (!rideId) return;
    
    // Subscribe to ride-specific updates via WebSocket
    subscribeToRideSpecificUpdates(rideId);
    
    // Register our local handler for location updates
    subscribeToLocationUpdates(rideId, handleLocationUpdate);
    
    // Cleanup when the component unmounts
    return () => {
      unsubscribeFromLocationUpdates(rideId, handleLocationUpdate);
    };
  }, [rideId]);
  
  // Show a message if no location data is available
  if (!driverLocation && !pickupLocation) {
    return (
      <View style={styles.container}>
        <Text style={styles.waitingText}>Waiting for driver location...</Text>
      </View>
    );
  }
  
  // Calculate the initial region to show on the map based on available locations
  const getInitialRegion = () => {
    let region = {
      latitude: 10.762622,  // Default to a central location (Vietnam)
      longitude: 106.660172,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    };
    
    if (driverLocation) {
      region.latitude = driverLocation.latitude;
      region.longitude = driverLocation.longitude;
    } else if (pickupLocation) {
      // If we have pickup location coordinates, use them
      const pickupCoords = parseLocationString(pickupLocation);
      if (pickupCoords) {
        region.latitude = pickupCoords.latitude;
        region.longitude = pickupCoords.longitude;
      }
    }
    
    return region;
  };
  
  // Parse location strings like "10.762622,106.660172"
  const parseLocationString = (locationStr) => {
    if (!locationStr) return null;
    
    try {
      // Check if it's already an object with lat/lng
      if (typeof locationStr === 'object' && locationStr.latitude && locationStr.longitude) {
        return {
          latitude: parseFloat(locationStr.latitude),
          longitude: parseFloat(locationStr.longitude)
        };
      }
      
      // Try to parse from a string
      const parts = locationStr.split(',');
      if (parts.length === 2) {
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        
        if (!isNaN(lat) && !isNaN(lng)) {
          return {
            latitude: lat,
            longitude: lng
          };
        }
      }
    } catch (error) {
      console.error('Error parsing location string:', error);
    }
    
    return null;
  };
  
  // Get marker coordinates for pickup/dropoff if available
  const pickupCoords = parseLocationString(pickupLocation);
  const dropoffCoords = parseLocationString(dropoffLocation);
  
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={getInitialRegion()}
        region={driverLocation ? {
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0121
        } : undefined}
      >
        {/* Driver marker */}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Driver"
            description="Current driver location"
          >
            <View style={styles.driverMarker}>
              <Icon name="navigation" size={20} color="white" />
            </View>
          </Marker>
        )}
        
        {/* Pickup marker */}
        {pickupCoords && (
          <Marker
            coordinate={pickupCoords}
            title="Pickup"
            description="Pickup location"
          >
            <View style={styles.pickupMarker}>
              <Icon name="map-pin" size={20} color="white" />
            </View>
          </Marker>
        )}
        
        {/* Dropoff marker */}
        {dropoffCoords && (
          <Marker
            coordinate={dropoffCoords}
            title="Dropoff"
            description="Dropoff location"
          >
            <View style={styles.dropoffMarker}>
              <Icon name="flag" size={20} color="white" />
            </View>
          </Marker>
        )}
      </MapView>
      
      {lastUpdate && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Last update: {lastUpdate.toLocaleTimeString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  waitingText: {
    textAlign: 'center',
    padding: 20,
    color: colors.gray
  },
  driverMarker: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: 'white'
  },
  pickupMarker: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: 'white'
  },
  dropoffMarker: {
    backgroundColor: 'red',
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: 'white'
  },
  infoBox: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    padding: 5
  },
  infoText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 12
  }
});

export default LocationTracker; 