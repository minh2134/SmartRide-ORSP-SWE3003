<<<<<<< Updated upstream
import React from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

const mockRideHistory = [
  {
    id: '1',
    date: '2023-11-15',
    time: '14:30',
    pickup: '123 Main St',
    dropoff: '456 Oak Ave',
    amount: '$12.50',
    status: 'completed'
  },
  {
    id: '2',
    date: '2023-11-12',
    time: '09:15',
    pickup: '789 Pine Rd',
    dropoff: '234 Elm St',
    amount: '$8.75',
    status: 'completed'
  },
  {
    id: '3',
    date: '2023-11-05',
    time: '18:45',
    pickup: '567 Cedar Ln',
    dropoff: '890 Maple Dr',
    amount: '$15.20',
    status: 'cancelled'
  },
  {
    id: '4',
    date: '2023-10-28',
    time: '11:20',
    pickup: '345 Birch St',
    dropoff: '678 Walnut Ave',
    amount: '$10.30',
    status: 'completed'
  },
  {
    id: '5',
    date: '2023-10-22',
    time: '20:05',
    pickup: '901 Cherry Ln',
    dropoff: '234 Apple Rd',
    amount: '$22.75',
    status: 'completed'
  }
];

const RideItem = ({ ride }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <Icon name="check-circle" size={18} color="#000000" />;
      case 'cancelled':
        return <Icon name="cancel" size={18} color="#000000" />;
      default:
        return <Icon name="schedule" size={18} color="#000000" />;
    }
  };
  
  return (
    <TouchableOpacity style={styles.rideItem}>
      <View style={styles.rideHeader}>
        <View style={styles.rideDate}>
          <Text style={styles.rideDateText}>{ride.date}</Text>
          <Text style={styles.rideTimeText}>{ride.time}</Text>
        </View>
        <View style={styles.rideStatus}>
          {getStatusIcon(ride.status)}
          <Text style={styles.rideStatusText}>
            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.rideDetails}>
        <View style={styles.rideLocation}>
          <Icon name="location-on" size={16} color="#000000" />
          <Text style={styles.rideAddressText}>{ride.pickup}</Text>
        </View>
        <View style={styles.rideLocation}>
          <Icon name="arrow-downward" size={16} color="#000000" />
          <Text style={styles.rideAddressText}>{ride.dropoff}</Text>
        </View>
      </View>
      
      <View style={styles.rideFooter}>
        <Text style={styles.rideAmount}>{ride.amount}</Text>
      </View>
    </TouchableOpacity>
  );
};
=======
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import Icon from 'react-native-vector-icons/Feather';
import { getRideHistory } from '../../services/api';
import colors from '../../theme/colors';
import styles from './styles';
import historyStyles from './rideHistoryStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
>>>>>>> Stashed changes

// Use to display customer ride history
const CustomerRideHistoryScreen = () => {
  const { user } = useAuth();
  
<<<<<<< Updated upstream
=======
  const [rideHistory, setRideHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);

  // Fetch ride history on component mount
  const fetchRideHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get username from AsyncStorage
      const username = await AsyncStorage.getItem('username');
      
      if (!username) {
        throw new Error('Username not found. Please log in again.');
      }
      
      // Call the API with username and userType as parameters
      const response = await api.getRideHistory(username, 'customer');
      
      if (response && response.rides) {
        setRideHistory(response.rides);
      } else {
        setRideHistory([]);
      }
    } catch (err) {
      console.error('Error fetching ride history:', err);
      setError('Failed to load ride history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load ride history when the component mounts
  useEffect(() => {
    fetchRideHistory();
  }, [fetchRideHistory]);

  // Handle refreshing the ride history
  const handleRefresh = () => {
    fetchRideHistory();
  };

  // Render a ride history item
  const renderRideItem = ({ item }) => {
    const isSelected = selectedRide?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[historyStyles.rideItem, isSelected && historyStyles.selectedRideItem]}
        onPress={() => setSelectedRide(isSelected ? null : item)}
      >
        <View style={historyStyles.rideHeader}>
          <Text style={historyStyles.rideDate}>{item.date}</Text>
          <View style={historyStyles.rideStatusContainer}>
            <View style={[
              historyStyles.statusIndicator, 
              { backgroundColor: item.status === 'completed' ? colors.primary : colors.warning }
            ]} />
            <Text style={historyStyles.rideStatus}>{item.status}</Text>
          </View>
        </View>
        
        {item.driver && (
          <View style={historyStyles.driverInfo}>
            <Icon name="user" size={16} color={colors.primary} />
            <Text style={historyStyles.driverName}>
              Driver: {item.driver}
            </Text>
          </View>
        )}
        
        <View style={historyStyles.rideRoute}>
          <View style={historyStyles.locationContainer}>
            <Icon name="map-pin" size={16} color={colors.primary} />
            <Text style={historyStyles.locationText} numberOfLines={1}>
              {item.pickupLoc}
            </Text>
          </View>
          
          <View style={historyStyles.routeLine}>
            <View style={historyStyles.routeDot} />
            <View style={historyStyles.routeDash} />
            <View style={historyStyles.routeDot} />
          </View>
          
          <View style={historyStyles.locationContainer}>
            <Icon name="flag" size={16} color="red" />
            <Text style={historyStyles.locationText} numberOfLines={1}>
              {item.dropoffLoc}
            </Text>
          </View>
        </View>
        
        <View style={historyStyles.rideDetails}>
          <Text style={historyStyles.vehicleType}>
            {item.vehicleType === 'motorbike' ? 'Motorbike' : 
             item.vehicleType === '4seater' ? '4-Seat Car' : '7-Seat Car'}
          </Text>
          <Text style={historyStyles.fareAmount}>{item.fare.toLocaleString()} VND</Text>
        </View>
        
        {isSelected && (
          <View style={historyStyles.expandedSection}>
            <TouchableOpacity 
              style={historyStyles.actionButton}
              onPress={() => Alert.alert('Info', 'You can book a similar ride from your history')}
            >
              <Icon name="repeat" size={16} color={colors.primary} />
              <Text style={historyStyles.actionButtonText}>Book Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={historyStyles.actionButton}
              onPress={() => Alert.alert('Receipt', 
                `Ride ID: ${item.id}\n` +
                `Date: ${item.date}\n` +
                `Status: ${item.status}\n` +
                `Driver: ${item.driver || 'Not assigned'}\n` +
                `Total Fare: ${item.fare.toLocaleString()} VND`
              )}
            >
              <Icon name="file-text" size={16} color={colors.primary} />
              <Text style={historyStyles.actionButtonText}>View Receipt</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={historyStyles.emptyContainer}>
      <Icon name="calendar" size={60} color={colors.lightGray} />
      <Text style={historyStyles.emptyText}>No ride history found</Text>
      <Text style={historyStyles.emptySubtext}>
        You don't have any past rides yet
      </Text>
      <TouchableOpacity 
        style={historyStyles.refreshButton}
        onPress={handleRefresh}
      >
        <Text style={historyStyles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

>>>>>>> Stashed changes
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ride History</Text>
      </View>
      
      <FlatList
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        data={mockRideHistory}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <RideItem ride={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="directions-car" size={60} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No ride history found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default CustomerRideHistoryScreen; 