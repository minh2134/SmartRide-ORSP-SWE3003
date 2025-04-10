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
import { useRoute, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import Icon from 'react-native-vector-icons/Feather';
import { getRideHistory } from '../../services/api';
import colors from '../../theme/colors';
import styles from './styles';
import historyStyles from './rideHistoryStyles';

// Use to display customer ride history
const CustomerRideHistoryScreen = () => {
  const route = useRoute();
  const { username, isAuthenticated: authenticated } = route.params || {};
  
  const [rideHistory, setRideHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Fetch ride history when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('CustomerRideHistoryScreen focused, fetching history');
      if (authenticated) {
        // Set a timeout to ensure we don't get stuck in loading state
        const loadingTimeout = setTimeout(() => {
          if (isLoading) {
            console.log('Loading timeout reached, showing empty state');
            setIsLoading(false);
            setError('Timeout reached while loading ride history. Please try again.');
          }
        }, 10000);
        
        fetchRideHistory();
        
        return () => {
          clearTimeout(loadingTimeout);
        };
      } else {
        setIsLoading(false);
        setError('You need to be logged in to view ride history.');
      }
    }, [authenticated])
  );

  // Fetch ride history from backend with retry logic
  const fetchRideHistory = (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError('');

    console.log('Fetching ride history...');

    // Request ride history from backend
    getRideHistory()
      .then(response => {
        console.log('Ride history fetched successfully:', JSON.stringify(response));
        const rides = response.rides || [];
        
        // Log all fares to help with debugging
        if (rides.length > 0) {
          rides.forEach(ride => {
            console.log(`Ride ID ${ride.id} has fare: ${ride.fare}, driver: ${ride.driver}`);
          });
          
          // Sort rides by newest first (assuming each ride has a timestamp or date property)
          rides.sort((a, b) => {
            // First try to parse as Date objects
            const dateA = a.timeStamp ? new Date(a.timeStamp) : new Date(a.date);
            const dateB = b.timeStamp ? new Date(b.timeStamp) : new Date(b.date);
            return dateB - dateA; // Newest first
          });
        } else {
          console.log('No rides found in response');
        }
        
        setRideHistory(rides);
        setIsLoading(false);
        setIsRefreshing(false);
        setRetryCount(0); // Reset retry count on success
      })
      .catch(error => {
        console.error('Failed to fetch ride history:', error);
        
        // Check if we should retry
        if (retryCount < 2) {
          console.log(`Retrying fetch ride history (${retryCount + 1}/3)...`);
          setRetryCount(retryCount + 1);
          
          // Retry after a short delay
          setTimeout(() => {
            fetchRideHistory(isRefresh);
          }, 1000);
          return;
        }
        
        setError(error || 'Failed to fetch ride history. Please try again.');
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  // Handle refreshing the ride history
  const handleRefresh = () => {
    setRetryCount(0); // Reset retry count on manual refresh
    fetchRideHistory(true);
  };

  // Generate a consistent key for each ride item
  const generateConsistentKey = (item, index) => {
    // Use a combination of ID (if available) and index to ensure uniqueness
    return `ride-${item.id || 'unknown'}-${index}`;
  };

  // Render a ride history item
  const renderRideItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={historyStyles.rideItem}
        onPress={() => {
          // Show receipt alert directly on tap
          Alert.alert('Receipt', 
            `Ride ID: ${item.id}\n` +
            `Date: ${item.date}\n` +
            `Status: ${item.status}\n` +
            `Driver: ${item.driver || 'Not assigned'}\n` +
            `Total Fare: ${typeof item.fare === 'number' ? item.fare.toLocaleString() : '0'} VND`
          );
        }}
      >
        <View style={historyStyles.rideHeader}>
          <Text style={historyStyles.rideDate}>{item.date}</Text>
          <View style={historyStyles.rideStatusContainer}>
            <View style={[
              historyStyles.statusIndicator, 
              { backgroundColor: 
                item.status === 'completed' ? colors.primary : 
                item.status === 'cancelled' ? '#FF3B30' : colors.warning 
              }
            ]} />
            <Text style={[
              historyStyles.rideStatus,
              { color: 
                item.status === 'completed' ? colors.primary : 
                item.status === 'cancelled' ? '#FF3B30' : colors.warning 
              }
            ]}>{item.status}</Text>
          </View>
        </View>
        
        <View style={historyStyles.driverInfo}>
          <Icon name="user" size={16} color={colors.primary} />
          <Text style={historyStyles.driverName}>
            Driver: {item.driver || 'Not assigned'}
          </Text>
        </View>
        
        <View style={historyStyles.rideRoute}>
          <View style={historyStyles.locationContainer}>
            <Icon name="map-pin" size={16} color={colors.primary} />
            <Text style={historyStyles.locationText} numberOfLines={2}>
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
            <Text style={historyStyles.locationText} numberOfLines={2}>
              {item.dropoffLoc}
            </Text>
          </View>
        </View>
        
        <View style={historyStyles.rideDetails}>
          <Text style={historyStyles.vehicleType}>
            {item.vehicleType === 'motorbike' ? 'Motorbike' : 
             item.vehicleType === '4seater' ? '4-Seat Car' : 
             item.vehicleType === '7seater' ? '7-Seat Car' : 
             item.vehicleType}
          </Text>
          <Text style={historyStyles.fareAmount}>
            {typeof item.fare === 'number' && item.fare > 0 
              ? item.fare.toLocaleString() 
              : '0'} VND
          </Text>
        </View>
        
        <View style={[historyStyles.actionButtonsRow, { justifyContent: 'center' }]}>
          <TouchableOpacity 
            style={historyStyles.actionButton}
            onPress={() => Alert.alert('Receipt', 
              `Ride ID: ${item.id}\n` +
              `Date: ${item.date}\n` +
              `Status: ${item.status}\n` +
              `Driver: ${item.driver || 'Not assigned'}\n` +
              `Total Fare: ${typeof item.fare === 'number' ? item.fare.toLocaleString() : '0'} VND`
            )}
          >
            <Icon name="file-text" size={16} color={colors.primary} />
            <Text style={historyStyles.actionButtonText}>View Receipt</Text>
          </TouchableOpacity>
        </View>
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Ride History" />
      
      <View style={styles.content}>
        {isLoading ? (
          <View style={historyStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={historyStyles.loadingText}>Loading ride history...</Text>
          </View>
        ) : error ? (
          <View style={historyStyles.errorContainer}>
            <Icon name="alert-circle" size={50} color={colors.error} />
            <Text style={historyStyles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={historyStyles.refreshButton}
              onPress={handleRefresh}
            >
              <Text style={historyStyles.refreshButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {rideHistory.length === 0 ? (
              renderEmptyState()
            ) : (
              <FlatList
                data={rideHistory}
                renderItem={renderRideItem}
                keyExtractor={(item, index) => generateConsistentKey(item, index)}
                contentContainerStyle={historyStyles.listContainer}
                showsVerticalScrollIndicator={false}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                maxToRenderPerBatch={5}
                initialNumToRender={10}
                windowSize={3}
                getItemLayout={(data, index) => ({
                  length: 180, // Approximate height of each item
                  offset: 180 * index,
                  index,
                })}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomerRideHistoryScreen; 