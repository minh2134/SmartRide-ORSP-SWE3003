import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Modal,
  Alert,
  Image,
  FlatList,
  PanResponder,
  Animated,
  ActivityIndicator
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { 
  makeRideRequest, 
  hasActiveRideRequest, 
  getActiveRideRequest, 
  cancelRideRequest, 
  clearActiveRideRequest, 
  getCurrentUser, 
  isAuthenticated,
  subscribeToRideUpdates,
  unsubscribeFromRideUpdates,
  customerCompleteRide
} from '../../services/api';
import styles from './customerStyles';
import colors from '../../theme/colors';

// Try to import Picker, fall back to custom dropdown if not available
let Picker;
try {
  Picker = require('@react-native-picker/picker').Picker;
} catch (error) {
  console.warn('Picker component not available, using custom dropdown');
  Picker = null;
}

// Simple map component that doesn't require Google Maps API
const SimpleMap = ({ initialRegion, onLocationSelect, markerPosition, setMarkerPosition }) => {
  const pan = useState(new Animated.ValueXY())[0];
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value
      });
    },
    onPanResponderMove: Animated.event(
      [
        null,
        { dx: pan.x, dy: pan.y }
      ],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (e, gesture) => {
      pan.flattenOffset();
      
      // Calculate new coordinates based on the pan gesture
      const newX = initialRegion.longitude + (gesture.dx / 5000);
      const newY = initialRegion.latitude - (gesture.dy / 5000);
      
      // Update marker position
      const newPosition = {
        latitude: newY,
        longitude: newX
      };
      
      setMarkerPosition(newPosition);
      
      if (onLocationSelect) {
        onLocationSelect({
          nativeEvent: {
            coordinate: newPosition
          }
        });
      }
    }
  });
  
  const gridLines = [];
  for (let i = 0; i < 10; i++) {
    gridLines.push(
      <View key={`h-${i}`} style={[styles.gridLine, { top: `${i * 10}%`, width: '100%', height: 1 }]} />,
      <View key={`v-${i}`} style={[styles.gridLine, { left: `${i * 10}%`, width: 1, height: '100%' }]} />
    );
  }

  return (
    <View style={styles.mapContainer}>
      <View
        style={styles.simpleMap}
        {...panResponder.panHandlers}
      >
        {gridLines}
        
        {/* Location labels */}
        <View style={[styles.mapLocation, { top: '20%', left: '15%' }]}>
          <Text style={styles.mapLocationText}>Ben Thanh Market</Text>
        </View>
        <View style={[styles.mapLocation, { top: '40%', left: '60%' }]}>
          <Text style={styles.mapLocationText}>Landmark 81</Text>
        </View>
        <View style={[styles.mapLocation, { top: '70%', left: '30%' }]}>
          <Text style={styles.mapLocationText}>Saigon Zoo</Text>
        </View>
        
        {/* Center marker */}
        <View style={[styles.centerMarker, { left: '50%', top: '50%' }]} />
        
        {/* Draggable marker */}
        <Animated.View 
          style={[
            styles.mapMarker,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y }
              ]
            }
          ]}
        >
          <Icon name="map-pin" size={30} color={colors.primary} />
        </Animated.View>
        
        <Text style={styles.mapInstructions}>
          Tap or drag to select location
        </Text>
        
        <Text style={styles.mapCoordinates}>
          {markerPosition.latitude.toFixed(6)}, {markerPosition.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
};

// The main activity screen for the customer
const CustomerScreen = () => {
  const route = useRoute();
  const { username, isAuthenticated: routeIsAuthenticated } = route.params || {};

  // State variables for ride information
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [fare, setFare] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapType, setMapType] = useState(''); // 'pickup' or 'dropoff'
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [mapRegion] = useState({
    latitude: 10,
    longitude: 100,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 10.5,
    longitude: 105,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // New state for active ride
  const [activeRide, setActiveRide] = useState(null);
  // New state for completion confirmation modal
  const [showCompletionConfirmModal, setShowCompletionConfirmModal] = useState(false);
  // New state for ride completion success modal
  const [showCompletionSuccessModal, setShowCompletionSuccessModal] = useState(false);
  // New state for cancellation confirmation
  const [showCancellationConfirmModal, setShowCancellationConfirmModal] = useState(false);

  // Vehicle options
  const vehicleOptions = [
    { id: 'motorbike', name: 'Motorbike', image: require('../../../assets/images/motorbike.png'), baseFare: 2000},
    { id: '4seater', name: '4-Seat Car', image: require('../../../assets/images/car4.png'), baseFare: 2000 },
    { id: '7seater', name: '7-Seat Car', image: require('../../../assets/images/car7.png'), baseFare: 2000 },
  ];

  // Payment methods
  const paymentMethods = [
    { id: 'momo', name: 'Momo', icon: 'wallet' },
    { id: 'credit', name: 'Credit Card', icon: 'credit-card' },
    { id: 'debit', name: 'Debit Card', icon: 'credit-card' },
    { id: 'cash', name: 'Cash', icon: 'money' },
  ];

  // Define ride status update callback
  const handleRideStatusUpdate = useCallback((rideData) => {
    console.log('Ride status update received:', rideData);
    setActiveRide(rideData);
  }, []);

  // Subscribe to ride updates on mount
  useEffect(() => {
    // Subscribe to ride status updates
    subscribeToRideUpdates(handleRideStatusUpdate);
    
    // Cleanup on unmount
    return () => {
      unsubscribeFromRideUpdates(handleRideStatusUpdate);
    };
  }, [handleRideStatusUpdate]);

  // Calculate fare when pickup, dropoff, or vehicleType changes
  useEffect(() => {
    if (pickup && dropoff && vehicleType) {
      calculateFare();
    }
  }, [pickup, dropoff, vehicleType]);

  // Fixed fare calculation at 2000 VND/km
  const calculateFare = () => {
    const selectedVehicle = vehicleOptions.find(v => v.id === vehicleType);
    if (selectedVehicle) {
      // Simple distance-based calculation (in a real app, use Maps API for distance)
      const mockDistance = Math.floor(Math.random() * 15) + 1; // 1-15 km
      const distanceFare = mockDistance * 2000; // 2000 VND per km
      const totalFare = selectedVehicle.baseFare + distanceFare;
      setFare(totalFare);
    }
  };

  // Handle using current location for pickup
  const handleUseCurrentLocation = () => {
    // In a real app, use Geolocation API
    setPickup("Current Location");
  };

  // Handle opening map for pickup selection
  const handlePickupMapSelection = () => {
    setMapType('pickup');
    setShowMap(true);
  };

  // Handle opening map for dropoff selection
  const handleDropoffMapSelection = () => {
    setMapType('dropoff');
    setShowMap(true);
  };

  // Handle map marker selection
  const handleMapPress = (event) => {
    setMarkerPosition(event.nativeEvent.coordinate);
  };

  // Handle confirming the map selection
  const handleConfirmLocation = () => {
    const locationStr = `Selected from Map: ${markerPosition.latitude.toFixed(6)}, ${markerPosition.longitude.toFixed(6)}`;
    
    if (mapType === 'pickup') {
      setPickup(locationStr);
    } else {
      setDropoff(locationStr);
    }
    
    setShowMap(false);
  };

  // Validate all inputs and show confirmation
  const handleConfirmRide = () => {
    if (!pickup) {
      Alert.alert("Missing Information", "Please enter pickup location");
      return;
    }
    
    if (!dropoff) {
      Alert.alert("Missing Information", "Please enter dropoff location");
      return;
    }
    
    if (!vehicleType) {
      Alert.alert("Missing Information", "Please select a vehicle type");
      return;
    }
    
    if (!paymentMethod) {
      Alert.alert("Missing Information", "Please select a payment method");
      return;
    }

    // All fields are valid, show confirmation modal
    setModalVisible(true);
  };

  // Handle sending ride request to backend
  const handleSendRideRequest = () => {
    // Check if customer already has an active ride
    if (hasActiveRideRequest()) {
      Alert.alert(
        "Cannot Request Ride",
        "You already have an active ride request. Please cancel or complete it before requesting another.",
        [{ text: "OK" }]
      );
      setModalVisible(false);
      return;
    }

    // Verify user is authenticated
    if (!isAuthenticated()) {
      Alert.alert(
        "Authentication Error",
        "Your session has expired. Please log in again to request a ride.",
        [{ text: "OK" }]
      );
      setModalVisible(false);
      return;
    }

    // Close modal first
    setModalVisible(false);
    setIsSubmitting(true);

    // Create ride request object that matches RideInfo expected by server
    const rideRequest = {
      pickupLoc: pickup,
      dropoffLoc: dropoff,
      vehicleType: vehicleType,
      estimatedFare: fare
      // The server will create the timestamp and manage isDone status
    };

    console.log('Sending ride request to backend:', rideRequest);

    // Show loading state with "Finding driver" message
    setIsSubmitting(true);

    // Send to backend
    makeRideRequest(rideRequest)
      .then(response => {
        console.log('Ride request success:', response);
        setIsSubmitting(false);
        
        // Mock a small delay to simulate driver assignment
        setTimeout(() => {
          // Show driver assigned alert
          Alert.alert(
            "Driver Assigned",
            `${response.driverName || "A driver"} has been assigned to your ride!`,
            [{ text: "OK" }]
          );
          
          // Get the existing active ride data
          const activeRideData = getActiveRideRequest();
          
          // If the response doesn't include driver info but we know a driver was assigned,
          // add mock driver info based on the response
          if (activeRideData && (!activeRideData.driver || !activeRideData.status)) {
            const enhancedRideData = {
              ...activeRideData,
              status: 'accepted',
              driver: {
                name: response.driverName || "Driver Name",
                phone: "09xxxxxxxx"
              }
            };
            
            // Update active ride with driver information
            setActiveRide(enhancedRideData);
          } else {
            // Use the ride data as is
            setActiveRide(activeRideData);
          }
        }, 500); // Small delay for UX purposes
        
        // Reset form after submission
        resetForm();
      })
      .catch(error => {
        console.error('Ride request error:', error);
        setIsSubmitting(false);
        
        // Handle specific error cases
        let errorMessage = error;
        
        if (typeof error === 'string' && error.includes('timeout')) {
          errorMessage = "The server is taking too long to respond. Please check your connection and try again.";
        } else if (typeof error === 'string' && error.includes('Payment failed')) {
          errorMessage = "Payment failed. Please check your payment method and try again.";
        } else if (!isAuthenticated()) {
          errorMessage = "Your session has expired. Please log in again.";
        }
        
        // Show error message
        Alert.alert(
          "Request Failed",
          errorMessage || "Failed to request ride. Please try again.",
          [{ text: "OK" }]
        );
      });
  };

  // Reset all form fields
  const resetForm = () => {
    setPickup('');
    setDropoff('');
    setVehicleType('');
    setPaymentMethod('');
    setFare(0);
  };

  // Toggle payment dropdown
  const togglePaymentDropdown = () => {
    setShowPaymentDropdown(!showPaymentDropdown);
  };

  // Select payment method
  const selectPaymentMethod = (id) => {
    setPaymentMethod(id);
    setShowPaymentDropdown(false);
  };

  // Render vehicle option
  const renderVehicleOption = (vehicle) => {
    const isSelected = vehicleType === vehicle.id;
    
    return (
      <TouchableOpacity
        key={vehicle.id}
        style={[styles.vehicleOption, isSelected && styles.selectedOption]}
        onPress={() => setVehicleType(vehicle.id)}
      >
        <Image 
          source={vehicle.image}
          style={styles.vehicleImage}
          resizeMode="contain"
        />
        <Text style={[styles.vehicleName, isSelected && styles.selectedText]}>
          {vehicle.name}
        </Text>
        <Text style={[styles.vehiclePrice, isSelected && styles.selectedText]}>
          {vehicle.baseFare.toLocaleString()} VND base
        </Text>
      </TouchableOpacity>
    );
  };

  // Render payment method item for custom dropdown
  const renderPaymentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.dropdownItem} 
      onPress={() => selectPaymentMethod(item.id)}
    >
      <FontAwesome name={item.icon} size={18} color={colors.gray} style={styles.dropdownItemIcon} />
      <Text style={styles.dropdownItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Render custom payment dropdown or Picker based on availability
  const renderPaymentSelector = () => {
    if (Picker) {
      return (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={paymentMethod}
            style={styles.picker}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          >
            <Picker.Item label="Select payment method" value="" />
            {paymentMethods.map(method => (
              <Picker.Item 
                key={method.id} 
                label={method.name} 
                value={method.id} 
              />
            ))}
          </Picker>
        </View>
      );
    } else {
      // Fallback to custom dropdown
      return (
        <View>
          <TouchableOpacity 
            style={styles.customDropdownButton}
            onPress={togglePaymentDropdown}
          >
            <Text style={styles.customDropdownButtonText}>
              {paymentMethod ? paymentMethods.find(m => m.id === paymentMethod)?.name : 'Select payment method'}
            </Text>
            <Icon name={showPaymentDropdown ? 'chevron-up' : 'chevron-down'} size={20} color={colors.gray} />
          </TouchableOpacity>
          
          {showPaymentDropdown && (
            <View style={styles.dropdownList}>
              <FlatList
                data={paymentMethods}
                renderItem={renderPaymentItem}
                keyExtractor={item => item.id}
              />
            </View>
          )}
        </View>
      );
    }
  };

  // Function to handle ride cancellation
  const handleCancelRide = () => {
    Alert.alert(
      "Cancel Ride",
      "Are you sure you want to cancel your current ride request?",
      [
        { 
          text: "No", 
          style: "cancel" 
        },
        { 
          text: "Yes", 
          onPress: () => {
            setIsSubmitting(true);
            
            // Check if the active ride belongs to current user
            const currentUsername = getCurrentUser();
            if (!currentUsername) {
              // User may have logged out and back in, handle gracefully
              setActiveRide(null);
              clearActiveRideRequest(); // Clear any stale requests
              setIsSubmitting(false);
              Alert.alert("Ride Cancelled", "Your ride request has been reset.");
              return;
            }
            
            // Send cancellation request
            cancelRideRequest()
              .then(() => {
                setActiveRide(null);
                Alert.alert("Ride Cancelled", "Your ride request has been cancelled successfully.");
                setIsSubmitting(false);
              })
              .catch(error => {
                console.error('Cancel ride error:', error);
                setIsSubmitting(false);
                
                // Handle specific error cases
                if (typeof error === 'string' && error.includes('timeout')) {
                  // Handle the known server bug with driver being null during cancellation
                  setActiveRide(null);
                  clearActiveRideRequest();
                  Alert.alert(
                    "Ride Cancelled Locally",
                    "The server did not respond (likely due to a known server bug), but your ride has been cleared locally.",
                    [{ text: "OK" }]
                  );
                } else if (typeof error === 'string' && error.includes('Not in a ride')) {
                  // The server reported that there is no active ride for this user
                  setActiveRide(null);
                  clearActiveRideRequest();
                  Alert.alert("No Active Ride", "You don't currently have an active ride to cancel.");
                } else {
                  // For other errors, give option to clear locally
                  Alert.alert(
                    "Cancel Ride Error",
                    "Failed to cancel ride on server. Would you like to clear it locally?",
                    [
                      {
                        text: "No",
                        style: "cancel"
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          setActiveRide(null);
                          clearActiveRideRequest();
                          Alert.alert("Ride Cleared", "Your ride request has been cleared locally.");
                        }
                      }
                    ]
                  );
                }
              });
          } 
        }
      ]
    );
  };

  // Handle ride completion request
  const handleRideComplete = () => {
    // Show confirmation modal first
    setShowCompletionConfirmModal(true);
  };
  
  // Confirm and process ride completion
  const confirmRideComplete = () => {
    setShowCompletionConfirmModal(false);
    setIsSubmitting(true);
    
    // Use the customerCompleteRide API function
    customerCompleteRide(activeRide.id)
      .then(completedRide => {
        console.log('Ride completed successfully:', completedRide);
        setIsSubmitting(false);
        
        // Show success modal
        setShowCompletionSuccessModal(true);
        
        // Clear active ride after a delay
        setTimeout(() => {
          setShowCompletionSuccessModal(false);
          setActiveRide(null);
        }, 3000);
      })
      .catch(error => {
        console.error('Error completing ride:', error);
        setIsSubmitting(false);
        
        Alert.alert(
          'Error',
          'Failed to complete ride. Please try again.',
          [{ text: 'OK' }]
        );
      });
  };

  // Render the active ride card
  const renderActiveRideCard = () => {
    if (!activeRide) return null;

    // Determine ride status display text
    let statusText = 'Driver Assigned';
    let statusColor = '#00AA55';
    let statusBgColor = '#E6FFF0';
    let statusBorderColor = '#99EEBB';
    
    if (!activeRide.driver) {
      statusText = 'Finding Driver';
      statusColor = '#FF9900';
      statusBgColor = '#FFF7E6';
      statusBorderColor = '#FFD166';
    } else if (activeRide.status === 'in_progress') {
      statusText = 'In Progress';
      statusColor = '#00AA55';
      statusBgColor = '#E6FFF0';
      statusBorderColor = '#99EEBB';
    }

    return (
      <View style={styles.activeRideCard}>
        <View style={styles.activeRideHeader}>
          <Text style={styles.activeRideTitle}>Active Ride</Text>
          <View style={[
            styles.activeRideStatus, 
            { 
              backgroundColor: statusBgColor,
              borderColor: statusBorderColor 
            }
          ]}>
            <Text style={[styles.activeRideStatusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
        </View>

        <View style={styles.activeRideDetails}>
          <View style={styles.activeRideItem}>
            <Icon name="map-pin" size={18} color={colors.primary} />
            <Text style={styles.activeRideItemText}>{activeRide.pickupLoc}</Text>
          </View>
          
          <View style={styles.activeRideItem}>
            <Icon name="flag" size={18} color="red" />
            <Text style={styles.activeRideItemText}>{activeRide.dropoffLoc}</Text>
          </View>
          
          <View style={styles.activeRideItem}>
            <Icon name="truck" size={18} color={colors.text} />
            <Text style={styles.activeRideItemText}>
              {vehicleOptions.find(v => v.id === activeRide.vehicleType)?.name || activeRide.vehicleType}
            </Text>
          </View>
          
          <View style={styles.activeRideItem}>
            <Icon name="credit-card" size={18} color={colors.text} />
            <Text style={styles.activeRideItemText}>
              {paymentMethods.find(p => p.id === activeRide.paymentMethod)?.name || 'Cash'}
            </Text>
          </View>
          
          {/* Always show driver section, either with data or "Assigning driver" message */}
          <View style={styles.activeRideDriverSection}>
            <Text style={styles.activeRideDriverTitle}>Driver Information</Text>
            
            {activeRide.driver ? (
              <>
                <View style={styles.activeRideItem}>
                  <Icon name="user" size={18} color={colors.primary} />
                  <Text style={styles.activeRideItemText}>
                    {activeRide.driver.name || activeRide.driverName || 'Driver Name'}
                  </Text>
                </View>
                
                {activeRide.driver.phone && (
                  <View style={styles.activeRideItem}>
                    <Icon name="phone" size={18} color={colors.primary} />
                    <Text style={styles.activeRideItemText}>
                      {activeRide.driver.phone}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.activeRideItem}>
                <Icon name="user" size={18} color={colors.primary} />
                <Text style={styles.activeRideItemText}>
                  Driver assigned and on the way!
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.activeRidePrice}>
            <Text style={styles.activeRidePriceLabel}>Fare:</Text>
            <Text style={styles.activeRidePriceValue}>
              {activeRide.estimatedFare?.toLocaleString() || activeRide.fare?.toLocaleString() || '0'} VND
            </Text>
          </View>
        </View>
        
        {/* Action buttons based on ride state */}
        <View style={styles.rideActionButtonsContainer}>
          {/* Cancel button - show if ride is pending or finding driver */}
          {(!activeRide.driver || activeRide.status === 'pending') && (
            <TouchableOpacity 
              style={styles.cancelRideButton}
              onPress={handleCancelRide}
            >
              <Text style={styles.cancelRideButtonText}>Cancel Ride</Text>
            </TouchableOpacity>
          )}
          
          {/* Complete ride button - show when driver is assigned */}
          {activeRide.driver && (
            <TouchableOpacity 
              style={styles.cancelBookingButton}
              onPress={() => setShowCancellationConfirmModal(true)}
            >
              <Text style={styles.cancelBookingButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Add this new function to handle cancellation confirmation
  const confirmCancelBooking = () => {
    setShowCancellationConfirmModal(false);
    setIsSubmitting(true);
    
    // Use the existing cancelRideRequest function from api.js
    cancelRideRequest()
      .then(() => {
        console.log('Ride cancelled successfully');
        // Show success message if needed
        Alert.alert('Success', 'Your booking has been cancelled');
        setActiveRide(null);
      })
      .catch(error => {
        console.error('Error cancelling ride:', error);
        Alert.alert('Error', 'Failed to cancel booking. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Book a Ride" />
      
      <ScrollView style={styles.content}>
        {/* Active Ride Card (if there is an active ride) */}
        {renderActiveRideCard()}

        {/* Booking Form (hidden if there is an active ride) */}
        {!activeRide ? (
          <>
            {/* Pickup Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pickup Location</Text>
              <View style={styles.locationInputContainer}>
                <View style={styles.locationIconContainer}>
                  <Icon name="map-pin" size={20} color={colors.primary} />
                </View>
                <TextInput
                  style={styles.locationInput}
                  placeholder="Enter pickup location"
                  value={pickup}
                  onChangeText={setPickup}
                />
                <TouchableOpacity 
                  style={styles.locationAction}
                  onPress={handleUseCurrentLocation}
                >
                  <Text style={styles.currentLocationText}>C</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.locationAction}
                  onPress={handlePickupMapSelection}
                >
                  <Icon name="map" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Dropoff Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dropoff Location</Text>
              <View style={styles.locationInputContainer}>
                <View style={styles.locationIconContainer}>
                  <Icon name="flag" size={20} color="red" />
                </View>
                <TextInput
                  style={styles.locationInput}
                  placeholder="Enter destination"
                  value={dropoff}
                  onChangeText={setDropoff}
                />
                <TouchableOpacity 
                  style={styles.locationAction}
                  onPress={handleDropoffMapSelection}
                >
                  <Icon name="map" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Vehicle Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Type</Text>
              <View style={styles.vehicleOptionsContainer}>
                {vehicleOptions.map(renderVehicleOption)}
              </View>
            </View>

            {/* Payment Method Dropdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              {renderPaymentSelector()}
            </View>

            {/* Fare Estimate */}
            {fare > 0 && (
              <View style={styles.fareContainer}>
                <Text style={styles.fareLabel}>Estimated Fare:</Text>
                <Text style={styles.fareAmount}>{fare.toLocaleString()} VND</Text>
              </View>
            )}

            {/* Confirm Button */}
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleConfirmRide}
            >
              <Text style={styles.confirmButtonText}>Confirm Ride</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Display a message when there's an active ride
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              You have an active ride. You can request a new ride after your current ride is completed or cancelled.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Map Selection Modal */}
      <Modal
        visible={showMap}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowMap(false)}
      >
        <SafeAreaView style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>
              {mapType === 'pickup' ? 'Select Pickup Location' : 'Select Dropoff Location'}
            </Text>
            <TouchableOpacity 
              style={styles.mapCloseButton}
              onPress={() => setShowMap(false)}
            >
              <Icon name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <SimpleMap 
            initialRegion={mapRegion}
            onLocationSelect={handleMapPress}
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
          />
          
          <View style={styles.mapFooter}>
            <TouchableOpacity 
              style={styles.mapConfirmButton}
              onPress={handleConfirmLocation}
            >
              <Text style={styles.mapConfirmText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Your Ride</Text>
            
            <View style={styles.modalItem}>
              <Icon name="map-pin" size={20} color={colors.primary} />
              <View style={styles.modalItemContent}>
                <Text style={styles.modalItemLabel}>Pickup:</Text>
                <Text style={styles.modalItemValue}>{pickup}</Text>
              </View>
            </View>
            
            <View style={styles.modalItem}>
              <Icon name="flag" size={20} color="red" />
              <View style={styles.modalItemContent}>
                <Text style={styles.modalItemLabel}>Dropoff:</Text>
                <Text style={styles.modalItemValue}>{dropoff}</Text>
              </View>
            </View>
            
            <View style={styles.modalItem}>
              <Image 
                source={vehicleOptions.find(v => v.id === vehicleType)?.image}
                style={styles.modalVehicleImage}
                resizeMode="contain"
              />
              <View style={styles.modalItemContent}>
                <Text style={styles.modalItemLabel}>Vehicle:</Text>
                <Text style={styles.modalItemValue}>
                  {vehicleOptions.find(v => v.id === vehicleType)?.name}
                </Text>
              </View>
            </View>
            
            <View style={styles.modalItem}>
              <FontAwesome 
                name={paymentMethods.find(p => p.id === paymentMethod)?.icon || 'money'} 
                size={20} 
                color={colors.gray} 
              />
              <View style={styles.modalItemContent}>
                <Text style={styles.modalItemLabel}>Payment:</Text>
                <Text style={styles.modalItemValue}>
                  {paymentMethods.find(p => p.id === paymentMethod)?.name}
                </Text>
              </View>
            </View>
            
            <View style={styles.fareModalContainer}>
              <Text style={styles.fareModalLabel}>Estimated Fare:</Text>
              <Text style={styles.fareModalAmount}>{fare.toLocaleString()} VND</Text>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={handleSendRideRequest}
              >
                <Text style={styles.modalConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ride Completion Confirmation Modal */}
      <Modal
        visible={showCompletionConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCompletionConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete Ride?</Text>
            <Text style={styles.modalText}>
              Have you arrived at your destination? This will mark your ride as complete.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowCompletionConfirmModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Not Yet</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={confirmRideComplete}
              >
                <Text style={styles.modalConfirmButtonText}>Yes, Complete Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ride Completion Success Modal */}
      <Modal
        visible={showCompletionSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCompletionSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.successModalContent]}>
            <Icon name="check-circle" size={60} color="#00AA55" />
            <Text style={styles.successModalTitle}>
              You have arrived at your destination!
            </Text>
            <Text style={styles.successModalSubtitle}>
              Ride completed successfully.
            </Text>
            <Text style={styles.successModalText}>
              This ride will be saved to your ride history.
            </Text>
            <Text style={styles.successModalFare}>
              Total Fare: {activeRide?.fare?.toLocaleString() || activeRide?.estimatedFare?.toLocaleString() || '0'} VND
            </Text>
          </View>
        </View>
      </Modal>

      {/* Loading overlay when submitting */}
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {activeRide && activeRide.driver ? 'Completing your ride...' : 'Finding your driver...'}
          </Text>
          <Text style={[styles.loadingText, { fontSize: 14, marginTop: 5, opacity: 0.7 }]}>
            {activeRide && activeRide.driver ? 'Saving ride details to history' : 'Drivers are being notified about your request'}
          </Text>
        </View>
      )}

      {/* Cancellation Confirmation Modal */}
      <Modal
        visible={showCancellationConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancellationConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Booking?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowCancellationConfirmModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>No, Keep Booking</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={confirmCancelBooking}
              >
                <Text style={styles.modalConfirmButtonText}>Yes, Cancel Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Add these new styles
const additionalStyles = {
  rideActionButtonsContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  completeRideButton: {
    backgroundColor: '#00AA55',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%', 
    alignItems: 'center',
  },
  completeRideButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBookingButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%', 
    alignItems: 'center',
  },
  cancelBookingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successModalContent: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00AA55',
    marginTop: 20,
    textAlign: 'center',
  },
  successModalSubtitle: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  successModalText: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  successModalFare: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00AA55',
    marginTop: 20,
    textAlign: 'center',
  },
};

// Apply the new styles
Object.assign(styles, additionalStyles);

export default CustomerScreen; 