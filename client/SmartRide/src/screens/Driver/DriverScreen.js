import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  ScrollView,
  RefreshControl,
  Switch,
  FlatList
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

const generateRide = () => {
  return {
    rideID: Math.floor(Math.random() * 10000) + 1,
    customer: 'Pout',
    pickupLoc: '10.5, 105.0',
    dropoffLoc: '15.0, 120.0',
    vehicleType: 'Car',
    fare: (Math.floor(Math.random() * 50) + 1) * 2000, // Random fare 
    timeStamp: new Date().toISOString()
  };
};

// Sample ride history data
const initialRideHistory = [
  {
    id: 1001,
    customer: 'Pout',
    pickupLoc: '10.5, 105.0',
    dropoffLoc: '15.0, 120.0',
    fare: 65000,
    status: 'completed',
    date: '2023-05-15T14:30:00Z'
  },
  {
    id: 1002,
    customer: 'Pout',
    pickupLoc: '10.5, 105.0',
    dropoffLoc: '15.0, 120.0',
    fare: 42000,
    status: 'cancelled',
    date: '2023-05-14T10:15:00Z'
  }
];

const DriverScreen = () => {
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [rideStage, setRideStage] = useState('waiting');
  const [showHistory, setShowHistory] = useState(false);
  const [rideHistory, setRideHistory] = useState(initialRideHistory);
  
  const isReadyRef = useRef(isReady);
  const activeRideRef = useRef(activeRide);
  const timeoutRef = useRef(null);

  useEffect(() => {
    isReadyRef.current = isReady;
    activeRideRef.current = activeRide;
  }, [isReady, activeRide]);

  // Handle driver ready status change
  useEffect(() => {
    // Clean up any existing timeout when ready status changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Only schedule a new ride if the driver is ready and doesn't have an active ride
    if (isReady && !activeRide && rideStage === 'waiting') {
      timeoutRef.current = setTimeout(() => {
        // Double-check that the driver is still ready when the timeout fires
        if (isReadyRef.current && !activeRideRef.current) {
          const newRide = generateRide();
          assignRide(newRide);
        }
      }, 3000);
    }
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isReady, activeRide, rideStage]);

  // Assign a ride
  const assignRide = (ride) => {
    // Double-check that the driver is still ready
    if (!isReadyRef.current || activeRideRef.current) return;
    
    setRideStage('assigned');
    
    Alert.alert(
      'New Ride Request',
      `Ride request from ${ride.customer} at ${ride.pickupLoc}`,
      [
        {
          text: 'Decline',
          style: 'cancel',
          onPress: () => handleCancelRide(ride)
        },
        {
          text: 'Accept',
          onPress: () => handleAcceptRide(ride)
        }
      ],
      { cancelable: false }
    );
  };
  
  // Handle accepting a ride
  const handleAcceptRide = (ride) => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      const newRide = {
        ...ride,
        id: ride.rideID,
        isPickedUp: false
      };
      setActiveRide(newRide);
      setRideStage('pickup');
    }, 500);
  };
  
  // Handle cancelling the ride
  const handleCancelRide = (ride) => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setRideStage('waiting');
      
      // Add to ride history
      const cancelledRide = {
        id: ride.rideID,
        customer: ride.customer,
        pickupLoc: ride.pickupLoc,
        dropoffLoc: ride.dropoffLoc,
        fare: ride.fare,
        status: 'cancelled',
        date: new Date().toISOString()
      };
      
      setRideHistory(prevHistory => [cancelledRide, ...prevHistory]);
      
      Alert.alert(
        'Ride Cancelled',
        'The ride has been marked as cancelled and saved to ride history.',
        [{ text: 'OK' }]
      );
      
      // If driver is still ready, schedule another ride after a delay
      if (isReadyRef.current) {
        timeoutRef.current = setTimeout(() => {
          if (isReadyRef.current && !activeRideRef.current) {
            const randomRide = generateRide();
            assignRide(randomRide);
          }
        }, 5000);
      }
    }, 1000);
  };

  // Toggle driver ready status
  const toggleReadyStatus = (value) => {
    setIsReady(value);
    
    if (value) {
      Alert.alert('Ready for Rides', 'You are now available to receive ride requests.');
      
      // Immediately assign a ride when driver toggles ready
      if (!activeRide && rideStage === 'waiting') {
        const newRide = generateRide();
        // Use a shorter timeout to make it appear faster
        setTimeout(() => {
          if (isReadyRef.current && !activeRideRef.current) {
            assignRide(newRide);
          }
        }, 1000);
      }
    } else {
      Alert.alert('Not Ready', 'You will not receive new ride requests.');
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // If there's an assigned ride but not accepted yet, cancel it
      if (rideStage === 'assigned' && !activeRide) {
        setRideStage('waiting');
      }
    }
  };

  // Mark customer as picked up
  const handlePickupCustomer = () => {
    if (!activeRide) return;

    Alert.alert(
      'Confirm Pickup',
      'Have you picked up the customer?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            const updatedRide = { ...activeRide, isPickedUp: true };
            setActiveRide(updatedRide);
            setRideStage('inProgress');
            Alert.alert('Success', 'Customer pickup confirmed.');
          }
        }
      ]
    );
  };

  // Complete the active ride
  const handleCompleteRide = () => {
    if (!activeRide) return;

    Alert.alert(
      'Complete Ride',
      'Have you reached the destination?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            setLoading(true);
            
            // Simulate an API call
            setTimeout(() => {
              // Add to ride history
              const completedRide = {
                id: activeRide.id,
                customer: activeRide.customer,
                pickupLoc: activeRide.pickupLoc,
                dropoffLoc: activeRide.dropoffLoc,
                fare: activeRide.fare,
                status: 'completed',
                date: new Date().toISOString()
              };
              
              setRideHistory(prevHistory => [completedRide, ...prevHistory]);
              
              setLoading(false);
              setActiveRide(null);
              setRideStage('waiting');
              
              Alert.alert(
                'Ride Completed',
                'The ride has been completed and saved to ride history.',
                [{ text: 'OK' }]
              );
              
              // If driver is still ready, schedule another ride after a delay
              if (isReadyRef.current) {
                timeoutRef.current = setTimeout(() => {
                  if (isReadyRef.current && !activeRideRef.current) {
                    const randomRide = generateRide();
                    assignRide(randomRide);
                  }
                }, 5000);
              }
            }, 1000);
          }
        }
      ]
    );
  };

  // Toggle ride history view
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Render driver ready toggle
  const renderReadyToggle = () => {
    return (
      <View style={styles.readyToggleContainer}>
        <Icon name={isReady ? "radio" : "radio-off"} size={24} color={isReady ? colors.primary : colors.gray} />
        <Text style={styles.readyToggleText}>Ready for Rides</Text>
        <Switch
          value={isReady}
          onValueChange={toggleReadyStatus}
          trackColor={{ false: "#E0E0E0", true: "#A3E4D7" }}
          thumbColor={isReady ? colors.primary : "#F5F5F5"}
          disabled={loading || !!activeRide}
        />
      </View>
    );
  };

  // Render a ride history item
  const renderHistoryItem = ({ item }) => {
    return (
      <View style={styles.historyItem}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyCustomer}>{item.customer}</Text>
          <View style={[styles.historyStatus, item.status === 'completed' ? styles.historyCompleted : styles.historyCancelled]}>
            <Text style={styles.historyStatusText}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.historyDetails}>
          <View style={styles.locationContainer}>
            <Icon name="map-pin" size={16} color={colors.primary} style={{marginTop: 3}} />
            <Text style={styles.historyLocationText}>
              {item.pickupLoc}
            </Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Icon name="flag" size={16} color="red" style={{marginTop: 3}} />
            <Text style={styles.historyLocationText}>
              {item.dropoffLoc}
            </Text>
          </View>
          
          <View style={styles.historyFooter}>
            <Text style={styles.historyDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
            <Text style={styles.historyFare}>
              {item.fare.toLocaleString()} VND
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Render ride history
  const renderRideHistory = () => {
    return (
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Ride History</Text>
          <TouchableOpacity onPress={toggleHistory}>
            <Icon name="x" size={24} color={colors.gray} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={rideHistory}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.historyList}
          ListEmptyComponent={
            <Text style={styles.historyEmpty}>No ride history available</Text>
          }
        />
      </View>
    );
  };

  // Render active ride card
  const renderActiveRideCard = () => {
    if (!activeRide) return null;

    return (
      <View style={styles.rideCard}>
        <View style={styles.rideCardHeader}>
          <Text style={styles.rideCardTitle}>Active Ride</Text>
          <View style={[styles.rideStatusBadge, styles.activeStatusBadge]}>
            <Text style={styles.activeStatusText}>
              {rideStage === 'pickup' ? 'Pickup' : 'In Progress'}
            </Text>
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
          
          <View style={styles.rideStageContainer}>
            <View style={styles.rideStageItem}>
              <View style={[styles.rideStageCircle, styles.rideStageCompleted]}>
                <Icon name="check" size={12} color="white" />
              </View>
              <Text style={styles.rideStageText}>Assigned</Text>
            </View>
            <View style={styles.rideStageLine} />
            <View style={styles.rideStageItem}>
              <View style={[styles.rideStageCircle, rideStage === 'pickup' || rideStage === 'inProgress' ? styles.rideStageCompleted : styles.rideStageIncomplete]}>
                {rideStage === 'pickup' || rideStage === 'inProgress' ? <Icon name="check" size={12} color="white" /> : null}
              </View>
              <Text style={styles.rideStageText}>Pickup</Text>
            </View>
            <View style={styles.rideStageLine} />
            <View style={styles.rideStageItem}>
              <View style={[styles.rideStageCircle, rideStage === 'inProgress' ? styles.rideStageActive : styles.rideStageIncomplete]}>
                {rideStage === 'inProgress' ? <Icon name="check" size={12} color="white" /> : null}
              </View>
              <Text style={styles.rideStageText}>Complete</Text>
            </View>
          </View>
        </View>
        
        {rideStage === 'pickup' ? (
          <TouchableOpacity
            style={styles.pickupButton}
            onPress={handlePickupCustomer}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Confirm Pickup</Text>
            )}
          </TouchableOpacity>
        ) : (
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
        )}
      </View>
    );
  };

  // Render waiting message when no rides are available
  const renderWaitingForRides = () => {
    return (
      <View style={styles.waitingContainer}>
        {renderReadyToggle()}
        
        <Icon 
          name={isReady ? "activity" : "pause-circle"} 
          size={50} 
          color={isReady ? colors.primary : colors.gray} 
          style={{marginTop: 20}}
        />
        
        <Text style={styles.waitingTitle}>
          {isReady ? "Waiting for Ride Requests" : "Not Ready for Rides"}
        </Text>
        
        <Text style={styles.waitingText}>
          {isReady 
            ? loading 
              ? "Looking for available rides..." 
              : "You will receive ride requests shortly."
            : "Toggle the switch above to start receiving ride requests."}
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
        {showHistory ? (
          renderRideHistory()
        ) : activeRide ? (
          renderActiveRideCard()
        ) : (
          renderWaitingForRides()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverScreen; 