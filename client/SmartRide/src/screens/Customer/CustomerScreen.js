import React, { useState, useEffect } from 'react';
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
  Animated
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
  const { username, isAuthenticated } = route.params || {};

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
    latitude: 10.762622,
    longitude: 106.660172,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 10.762622,
    longitude: 106.660172,
  });

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
    // Close modal first
    setModalVisible(false);

    // In a real implementation, send to backend:
    // 1. Pickup location (coordinates + readable address)
    // 2. Dropoff location (coordinates + readable address)
    // 3. Vehicle type
    // 4. Payment method
    // 5. Estimated fare

    const rideRequest = {
      pickupLoc: pickup,
      dropoffLoc: dropoff,
      vehicleType: vehicleType,
      paymentMethod: paymentMethod,
      estimatedFare: fare
    };

    console.log('Ride request to send:', rideRequest);

    // Show confirmation to user
    Alert.alert(
      "Ride Requested",
      "Your ride has been requested. Finding a driver for you...",
      [{ text: "OK" }]
    );

    // Reset form after submission
    resetForm();
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Book a Ride" />
      
      <ScrollView style={styles.content}>
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
    </SafeAreaView>
  );
};

export default CustomerScreen; 