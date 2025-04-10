import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LocationTracker } from '../Location';
import colors from '../../theme/colors';

/**
 * Displays details of an active ride with real-time location tracking
 */
const ActiveRideCard = ({ ride, onCancel, onComplete, isDriver }) => {
  if (!ride) return null;
  
  const { id, pickupLoc, dropoffLoc, customer, driver, vehicleType, estimatedFare, status } = ride;
  
  // Format fare for display
  const formattedFare = typeof estimatedFare === 'number' 
    ? estimatedFare.toLocaleString() 
    : '0';
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isDriver ? 'Current Ride' : 'Your Ride'}
        </Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: 
              status === 'completed' ? colors.success :
              status === 'pending' ? colors.warning : colors.primary 
            }
          ]} />
          <Text style={styles.statusText}>
            {status === 'pending' ? 'Finding Driver' :
             status === 'assigned' ? 'Driver En Route' :
             status === 'active' ? 'In Progress' : 'Completed'}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        {/* User details */}
        <View style={styles.userInfo}>
          <Icon name="user" size={16} color={colors.primary} />
          <Text style={styles.userText}>
            {isDriver ? `Customer: ${customer || 'Unknown'}` : `Driver: ${driver || 'Assigning...'}`}
          </Text>
        </View>
        
        {/* Route information */}
        <View style={styles.routeContainer}>
          <View style={styles.locationContainer}>
            <Icon name="map-pin" size={16} color={colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {pickupLoc || 'Pickup location not specified'}
            </Text>
          </View>
          
          <View style={styles.routeLine}>
            <View style={styles.routeDot} />
            <View style={styles.routeDash} />
            <View style={styles.routeDot} />
          </View>
          
          <View style={styles.locationContainer}>
            <Icon name="flag" size={16} color="red" />
            <Text style={styles.locationText} numberOfLines={1}>
              {dropoffLoc || 'Dropoff location not specified'}
            </Text>
          </View>
        </View>
        
        {/* Vehicle type and fare */}
        <View style={styles.rideDetails}>
          <Text style={styles.vehicleType}>
            {vehicleType === 'motorbike' ? 'Motorbike' : 
             vehicleType === '4seater' ? '4-Seat Car' : '7-Seat Car'}
          </Text>
          <Text style={styles.fareAmount}>{formattedFare} VND</Text>
        </View>
      </View>
      
      {/* Location tracker map */}
      {(status === 'assigned' || status === 'active') && (
        <LocationTracker 
          rideId={id}
          pickupLocation={pickupLoc}
          dropoffLocation={dropoffLoc}
        />
      )}
      
      {/* Action buttons */}
      <View style={styles.actions}>
        {!isDriver && status !== 'completed' && (
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Icon name="x" size={16} color="white" />
            <Text style={styles.buttonText}>Cancel Ride</Text>
          </TouchableOpacity>
        )}
        
        {isDriver && status === 'active' && (
          <TouchableOpacity 
            style={[styles.button, styles.completeButton]}
            onPress={onComplete}
          >
            <Icon name="check" size={16} color="white" />
            <Text style={styles.buttonText}>Complete Ride</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    color: colors.gray,
  },
  details: {
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  userText: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.text,
  },
  routeContainer: {
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    marginVertical: 2,
  },
  routeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray,
  },
  routeDash: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray,
    marginHorizontal: 2,
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  vehicleType: {
    fontSize: 14,
    color: colors.text,
  },
  fareAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 150,
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default ActiveRideCard; 