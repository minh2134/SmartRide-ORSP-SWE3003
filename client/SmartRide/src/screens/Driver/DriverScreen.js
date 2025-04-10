import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  ScrollView,
  RefreshControl
} from 'react-native';
import Header from '../../components/Header/Header';
import styles from './styles';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../../theme/colors';
import { 
  acceptRide, 
  subscribeToRideUpdates,
  completeRide,
  getActiveRideRequest,
  api
} from '../../services/api';

const DriverScreen = () => {
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Subscribe to ride updates and assignments
  useEffect(() => {
    // Check for any active ride on mount
    const ride = getActiveRideRequest();
    if (ride) {
      setActiveRide(ride);
    }
    
    // Handle ride updates (when ride status changes)
    const handleRideUpdate = (ride) => {
      setActiveRide(ride);
    };
    
    // Handle new ride assignments
    const handleRideAssignment = (assignment) => {
      if (activeRide) return; // Skip if driver already has an active ride
      
      Alert.alert(
        'New Ride Assigned',
        `You've been assigned a ride with ${assignment.customer || 'a customer'}`,
        [
          {
            text: 'Accept',
            onPress: () => {
              setLoading(true);
              acceptRide(assignment.rideID)
                .then(() => {
                  setLoading(false);
                  // The active ride will be updated via subscription
                })
                .catch(error => {
                  setLoading(false);
                  Alert.alert('Error', 'Failed to accept ride.');
                });
            }
          }
        ]
      );
    };
    
    // Subscribe to ride updates
    const rideUpdateSubscription = subscribeToRideUpdates(handleRideUpdate);
    
    // Subscribe to ride assignments
    let assignmentSubscription = null;
    if (api.stompClient && api.stompClient.connected) {
      assignmentSubscription = api.stompClient.subscribe('/user/topic/driver/assignment', (message) => {
        try {
          const assignment = JSON.parse(message.body);
          handleRideAssignment(assignment);
        } catch (e) {
          console.error('Error parsing assignment:', e);
        }
      });
    }
    
    return () => {
      // Cleanup subscriptions
      if (rideUpdateSubscription && typeof rideUpdateSubscription === 'function') {
        rideUpdateSubscription();
      }
      
      if (assignmentSubscription) {
        try {
          assignmentSubscription.unsubscribe();
        } catch (e) {
          console.error('Error unsubscribing:', e);
        }
      }
    };
  }, [activeRide]);

  // Complete the active ride
  const handleCompleteRide = () => {
    if (!activeRide) return;

    Alert.alert(
      'Complete Ride',
      'Are you sure you want to mark this ride as complete?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            setLoading(true);
            completeRide(activeRide.id)
              .then(() => {
                setLoading(false);
                setActiveRide(null);
                Alert.alert('Success', 'Ride completed successfully.');
              })
              .catch(error => {
                setLoading(false);
                Alert.alert('Error', 'Failed to complete ride.');
              });
          }
        }
      ]
    );
  };

  // Refresh handler for pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Render active ride card
  const renderActiveRideCard = () => {
    if (!activeRide) return null;

    return (
      <View style={styles.rideCard}>
        <View style={styles.rideCardHeader}>
          <Text style={styles.rideCardTitle}>Active Ride</Text>
          <View style={[styles.rideStatusBadge, styles.activeStatusBadge]}>
            <Text style={styles.activeStatusText}>In Progress</Text>
          </View>
        </View>
        
        <View style={styles.rideDetails}>
          <View style={styles.rideInfoRow}>
            <Icon name="user" size={18} color={colors.primary} />
            <Text style={styles.rideInfoText}>
              Customer: {activeRide.customer || 'Unknown'}
            </Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Icon name="map-pin" size={18} color={colors.primary} />
            <Text style={styles.locationText}>
              Pickup: {activeRide.pickupLoc || 'Not specified'}
            </Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Icon name="flag" size={18} color="red" />
            <Text style={styles.locationText}>
              Dropoff: {activeRide.dropoffLoc || 'Not specified'}
            </Text>
          </View>
          
          <View style={styles.rideInfoRow}>
            <Icon name="truck" size={18} color={colors.primary} />
            <Text style={styles.rideInfoText}>
              Vehicle Type: {activeRide.vehicleType || 'Standard'}
            </Text>
          </View>
          
          <View style={styles.rideInfoRow}>
            <Icon name="dollar-sign" size={18} color={colors.primary} />
            <Text style={styles.rideInfoText}>
              Fare: {activeRide.fare ? `${activeRide.fare.toLocaleString()} VND` : 'To be determined'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteRide}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Complete Ride</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Render waiting message when no rides are available
  const renderWaitingForRides = () => {
    return (
      <View style={styles.waitingContainer}>
        <Icon name="radio" size={50} color={colors.primary} />
        <Text style={styles.waitingTitle}>Ready for Ride Assignments</Text>
        <Text style={styles.waitingText}>
          Waiting for ride requests. You will be notified when a new ride is available.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Driver Dashboard" />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {activeRide ? renderActiveRideCard() : renderWaitingForRides()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverScreen; 