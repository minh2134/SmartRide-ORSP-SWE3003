import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import styles from './styles';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import { 
  setDriverReady, 
  setDriverNotReady, 
  subscribeToDriverUpdates, 
  unsubscribeFromDriverUpdates, 
  confirmRidePickup,
  completeRide,
  sendLocationUpdate
} from '../../services/api';

const DriverScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRide, setActiveRide] = useState(null);
  const [completionModal, setCompletionModal] = useState(false);
  
  // Simulate location updates every 10 seconds when in a ride
  useEffect(() => {
    let locationInterval;
    
    if (activeRide) {
      // Start sending location updates
      locationInterval = setInterval(() => {
        // Simulate location change
        const latitude = 37.7749 + (Math.random() - 0.5) * 0.01;
        const longitude = -122.4194 + (Math.random() - 0.5) * 0.01;
        
        sendLocationUpdate(latitude, longitude, activeRide.id)
          .catch(error => console.error('Error sending location update:', error));
      }, 10000);
    }
    
    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, [activeRide]);
  
  // Subscribe to ride updates
  useEffect(() => {
    const handleRideUpdate = (ride) => {
      console.log('Driver received ride update:', ride);
      setActiveRide(ride);
      
      if (ride) {
        setIsReady(true);
      }
    };
    
    subscribeToDriverUpdates(handleRideUpdate);
    
    return () => {
      unsubscribeFromDriverUpdates(handleRideUpdate);
    };
  }, []);
  
  // Handle ready/not ready toggle
  const handleReadyToggle = async () => {
    setIsLoading(true);
    
    try {
      if (isReady) {
        // Only allow going not ready if no active ride
        if (activeRide) {
          Alert.alert(
            'Cannot Change Status', 
            'You have an active ride. You must complete or cancel it first.'
          );
          return;
        }
        
        await setDriverNotReady();
        setIsReady(false);
      } else {
        const result = await setDriverReady();
        setIsReady(true);
        
        // If a ride was immediately assigned
        if (result.rideAssigned) {
          setActiveRide(result.rideData);
          Alert.alert('New Ride', 'You have been assigned a new ride!');
        }
      }
    } catch (error) {
      console.error('Error toggling ready status:', error);
      Alert.alert('Error', `Failed to change status: ${error.toString()}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle confirming pickup
  const handleConfirmPickup = async () => {
    if (!activeRide) return;
    
    setIsLoading(true);
    
    try {
      await confirmRidePickup(activeRide.id);
      Alert.alert('Pickup Confirmed', 'You have picked up the passenger. Drive safely!');
      
      // Update local ride state
      setActiveRide({
        ...activeRide,
        status: 'in_progress'
      });
    } catch (error) {
      console.error('Error confirming pickup:', error);
      Alert.alert('Error', `Failed to confirm pickup: ${error.toString()}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle completing ride
  const handleCompleteRide = async () => {
    if (!activeRide) return;
    
    setIsLoading(true);
    
    try {
      await completeRide(activeRide.id);
      setCompletionModal(true);
      
      // Clear active ride after modal is shown
      setTimeout(() => {
        setActiveRide(null);
        setCompletionModal(false);
      }, 3000);
    } catch (error) {
      console.error('Error completing ride:', error);
      Alert.alert('Error', `Failed to complete ride: ${error.toString()}`);
      setIsLoading(false);
    }
  };
  
  // Render active ride card
  const renderActiveRide = () => {
    if (!activeRide) return null;
    
    const isPickedUp = activeRide.status === 'in_progress';
    
    return (
      <View style={driverScreenStyles.rideCard}>
        <View style={driverScreenStyles.rideHeader}>
          <Text style={driverScreenStyles.rideTitle}>Active Ride</Text>
          <View style={[
            driverScreenStyles.statusBadge, 
            {backgroundColor: isPickedUp ? colors.success : colors.warning}
          ]}>
            <Text style={driverScreenStyles.statusText}>
              {isPickedUp ? 'In Progress' : 'Pickup'}
            </Text>
          </View>
        </View>
        
        <View style={driverScreenStyles.rideInfo}>
          <View style={driverScreenStyles.infoRow}>
            <Icon name="user" size={16} color={colors.primary} />
            <Text style={driverScreenStyles.infoText}>
              {activeRide.customer || 'Customer'}
            </Text>
          </View>
          
          <View style={driverScreenStyles.infoRow}>
            <Icon name="map-pin" size={16} color={colors.primary} />
            <Text style={driverScreenStyles.infoText}>
              {activeRide.pickupLoc || 'Pickup location'}
            </Text>
          </View>
          
          <View style={driverScreenStyles.infoRow}>
            <Icon name="flag" size={16} color={colors.primary} />
            <Text style={driverScreenStyles.infoText}>
              {activeRide.dropoffLoc || 'Dropoff location'}
            </Text>
          </View>
          
          <View style={driverScreenStyles.infoRow}>
            <Icon name="dollar-sign" size={16} color={colors.primary} />
            <Text style={driverScreenStyles.infoText}>
              ${activeRide.estimatedFare?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            driverScreenStyles.actionButton,
            {backgroundColor: isPickedUp ? colors.success : colors.primary}
          ]}
          onPress={isPickedUp ? handleCompleteRide : handleConfirmPickup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Icon 
                name={isPickedUp ? "check-circle" : "user-check"} 
                size={18} 
                color="#fff" 
              />
              <Text style={driverScreenStyles.actionButtonText}>
                {isPickedUp ? 'Complete Ride' : 'Confirm Pickup'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Driver Dashboard" />
      
      <View style={styles.content}>
        {activeRide ? (
          renderActiveRide()
        ) : (
          <>
            <View style={driverScreenStyles.statusContainer}>
              <Text style={driverScreenStyles.statusLabel}>
                You are currently
              </Text>
              <Text style={[
                driverScreenStyles.statusValue,
                {color: isReady ? colors.success : colors.error}
              ]}>
                {isReady ? 'READY FOR RIDES' : 'NOT READY'}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[
                driverScreenStyles.readyButton,
                {backgroundColor: isReady ? colors.error : colors.success}
              ]}
              onPress={handleReadyToggle}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialIcons 
                    name={isReady ? "not-interested" : "play-circle-outline"} 
                    size={24} 
                    color="#fff" 
                  />
                  <Text style={driverScreenStyles.readyButtonText}>
                    {isReady ? 'Go Offline' : 'Go Online'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            
            <View style={driverScreenStyles.infoBox}>
              <Icon name="info" size={20} color={colors.primary} />
              <Text style={driverScreenStyles.infoText}>
                {isReady 
                  ? 'Waiting for ride requests. You will be notified when a ride is assigned to you.' 
                  : 'You must go online to receive ride requests.'}
              </Text>
            </View>
          </>
        )}
      </View>
      
      {/* Ride Completion Modal */}
      <Modal
        visible={completionModal}
        transparent={true}
        animationType="fade"
      >
        <View style={driverScreenStyles.modalContainer}>
          <View style={driverScreenStyles.modalContent}>
            <MaterialIcons name="check-circle" size={60} color={colors.success} />
            <Text style={driverScreenStyles.modalTitle}>
              Destination Reached!
            </Text>
            <Text style={driverScreenStyles.modalText}>
              You have arrived at your destination. The ride is now complete.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const driverScreenStyles = StyleSheet.create({
  statusContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  statusLabel: {
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 8,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  readyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
    elevation: 2,
  },
  readyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.lightGray,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    color: colors.textDark,
    marginLeft: 10,
    lineHeight: 20,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rideInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    color: colors.textDark,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textLight,
    marginBottom: 16,
  },
});

export default DriverScreen; 