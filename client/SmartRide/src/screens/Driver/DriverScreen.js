import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Modal,
  ActivityIndicator
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';
import colors from '../../theme/colors';
import { 
  getUserProfile, 
  getCurrentUser,
  isAuthenticated,
  subscribeToDriverUpdates,
  unsubscribeFromDriverUpdates,
  setDriverReady,
  setDriverNotReady,
  completeRide,
  isDriverReady
} from '../../services/api';

const DriverScreen = () => {
  const route = useRoute();
  const { username } = route.params || {};
  
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [showRideInProgress, setShowRideInProgress] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  // Get user profile on mount and check driver ready status
  useEffect(() => {
    getUserProfile(
      (result) => setUserInfo(result),
      (error) => console.error('Error getting user profile:', error)
    );
    
    // Set initial ready state from API
    setIsReady(isDriverReady());
  }, []);

  // Subscribe to driver updates
  useEffect(() => {
    // Handle ride updates (assignment, completion, etc.)
    const handleRideUpdate = (rideData) => {
      if (rideData) {
        setCurrentRide(rideData);
      } else {
        setCurrentRide(null);
        setIsReady(false);
      }
    };

    subscribeToDriverUpdates(handleRideUpdate);
    
    return () => {
      unsubscribeFromDriverUpdates(handleRideUpdate);
    };
  }, []);

  // Handle setting driver as ready for rides
  const handleReadyPress = () => {
    if (!isAuthenticated()) {
      Alert.alert(
        "Authentication Error",
        "Your session has expired. Please log in again.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);
    
    // Tell the server this driver is ready to accept rides
    setDriverReady()
      .then((response) => {
        setIsReady(true);
        setIsLoading(false);
        
        if (response && response.rideAssigned) {
          // Driver was immediately assigned to a ride
          setCurrentRide(response.rideData);
        } else {
          Alert.alert(
            "Ready for Rides",
            "You are now available to receive ride requests.",
            [{ text: "OK" }]
          );
        }
      })
      .catch((error) => {
        console.error('Error setting driver ready:', error);
        setIsLoading(false);
        Alert.alert(
          "Error",
          "Failed to set you as available for rides. Please try again.",
          [{ text: "OK" }]
        );
      });
  };

  // Handle setting driver as not ready for rides
  const handleNotReadyPress = () => {
    if (!isAuthenticated()) {
      Alert.alert(
        "Authentication Error",
        "Your session has expired. Please log in again.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);
    
    // Tell the server this driver is no longer ready to accept rides
    setDriverNotReady()
      .then(() => {
        setIsReady(false);
        setIsLoading(false);
        Alert.alert(
          "Not Ready",
          "You will not receive any new ride requests.",
          [{ text: "OK" }]
        );
      })
      .catch((error) => {
        console.error('Error setting driver not ready:', error);
        setIsLoading(false);
        Alert.alert(
          "Error",
          "Failed to update your status. Please try again.",
          [{ text: "OK" }]
        );
      });
  };

  // Handle customer pickup
  const handlePickupCustomer = () => {
    if (!currentRide) return;
    
    // Show "Ride in process" popup
    setShowRideInProgress(true);
    
    // After a brief delay, complete the ride
    setTimeout(() => {
      setShowRideInProgress(false);
      
      // Mark ride as complete
      completeRide(currentRide.id)
        .then((response) => {
          Alert.alert(
            "Ride Completed",
            "The ride has been successfully completed.",
            [{ text: "OK" }]
          );
          setCurrentRide(null);
          setIsReady(false);
        })
        .catch((error) => {
          console.error('Error completing ride:', error);
          Alert.alert(
            "Error",
            "Failed to complete the ride. Please try again.",
            [{ text: "OK" }]
          );
        });
    }, 2000); // Show popup for 2 seconds
  };

  // Render the current ride card
  const renderCurrentRide = () => {
    if (!currentRide) return null;

    return (
      <View style={localStyles.rideCard}>
        <View style={localStyles.rideHeader}>
          <Text style={localStyles.rideTitle}>Current Ride</Text>
          <View style={localStyles.rideStatus}>
            <Text style={localStyles.rideStatusText}>Active</Text>
          </View>
        </View>

        <View style={localStyles.rideDetails}>
          <View style={localStyles.rideItem}>
            <Icon name="user" size={18} color={colors.primary} />
            <Text style={localStyles.rideItemText}>
              Customer: {currentRide.customer || 'Not specified'}
            </Text>
          </View>
          
          <View style={localStyles.rideItem}>
            <Icon name="map-pin" size={18} color={colors.primary} />
            <Text style={localStyles.rideItemText}>
              Pickup: {currentRide.pickupLoc || 'Not specified'}
            </Text>
          </View>
          
          <View style={localStyles.rideItem}>
            <Icon name="flag" size={18} color="red" />
            <Text style={localStyles.rideItemText}>
              Dropoff: {currentRide.dropoffLoc || 'Not specified'}
            </Text>
          </View>
          
          <View style={localStyles.rideItem}>
            <Icon name="truck" size={18} color={colors.text} />
            <Text style={localStyles.rideItemText}>
              Vehicle: {currentRide.vehicleType || 'Standard'}
            </Text>
          </View>
          
          <View style={localStyles.ridePrice}>
            <Text style={localStyles.ridePriceLabel}>Fare:</Text>
            <Text style={localStyles.ridePriceValue}>
              {(currentRide.estimatedFare || 0).toLocaleString()} VND
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={localStyles.pickupButton}
          onPress={handlePickupCustomer}
        >
          <Text style={localStyles.pickupButtonText}>Customer Picked Up</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Driver Dashboard" />
      
      <View style={styles.content}>
        {!currentRide ? (
          <View style={localStyles.readyContainer}>
            <Icon name="truck" size={80} color={colors.primary} style={localStyles.icon} />
            
            <Text style={localStyles.driverName}>
              {userInfo.name || getCurrentUser() || 'Driver'}
            </Text>
            
            <Text style={localStyles.readyText}>
              {isReady 
                ? 'You are ready to receive ride requests' 
                : 'Click the button below when you are ready to accept rides'}
            </Text>
            
            {isReady ? (
              <TouchableOpacity 
                style={[
                  localStyles.readyButton,
                  localStyles.notReadyButton,
                  isLoading && localStyles.disabledButton
                ]}
                onPress={handleNotReadyPress}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={localStyles.readyButtonText}>
                    Stop Accepting Rides
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[
                  localStyles.readyButton,
                  isLoading && localStyles.disabledButton
                ]}
                onPress={handleReadyPress}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={localStyles.readyButtonText}>
                    Ready for Rides
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : (
          renderCurrentRide()
        )}
      </View>
      
      {/* Ride in Progress Modal */}
      <Modal
        visible={showRideInProgress}
        transparent={true}
        animationType="fade"
      >
        <View style={localStyles.modalContainer}>
          <View style={localStyles.modalContent}>
            <Icon name="navigation" size={40} color={colors.primary} />
            <Text style={localStyles.modalTitle}>Ride in Progress</Text>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Additional styles for new components
const localStyles = StyleSheet.create({
  readyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  readyText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.gray,
    marginBottom: 30,
  },
  readyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  notReadyButton: {
    backgroundColor: colors.danger || '#dc3545',
  },
  activeButton: {
    backgroundColor: colors.success,
  },
  disabledButton: {
    backgroundColor: colors.gray,
  },
  readyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rideCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  rideStatus: {
    backgroundColor: '#E6FFF0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#99EEBB',
  },
  rideStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00AA55',
  },
  rideDetails: {
    marginBottom: 16,
  },
  rideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rideItemText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 10,
    flex: 1,
  },
  ridePrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.lighterGray,
    paddingTop: 10,
  },
  ridePriceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  ridePriceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pickupButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickupButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 20,
  },
});

export default DriverScreen; 