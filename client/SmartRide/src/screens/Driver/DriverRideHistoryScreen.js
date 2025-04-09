import React, { useState, useEffect } from 'react';
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
import driverHistoryStyles from './driverHistoryStyles';

const DriverRideHistoryScreen = () => {
  const route = useRoute();
  const { username, isAuthenticated } = route.params || {};
  
  const [rideHistory, setRideHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);

  // Fetch ride history on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchRideHistory();
    } else {
      setIsLoading(false);
      setError('You need to be logged in to view ride history.');
    }
  }, [isAuthenticated]);

  // Fetch ride history from backend
  const fetchRideHistory = () => {
    setIsLoading(true);
    setError('');

    // Request ride history from backend (for driver)
    getRideHistory()
      .then(response => {
        console.log('Ride history fetched:', response);
        setRideHistory(response.rides || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch ride history:', error);
        setError(error || 'Failed to fetch ride history. Please try again.');
        setIsLoading(false);
      });
  };

  // Handle refreshing the ride history
  const handleRefresh = () => {
    fetchRideHistory();
  };

  // Render a ride history item
  const renderRideItem = ({ item }) => {
    const isSelected = selectedRide?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[driverHistoryStyles.rideItem, isSelected && driverHistoryStyles.selectedRideItem]}
        onPress={() => setSelectedRide(isSelected ? null : item)}
      >
        <View style={driverHistoryStyles.rideHeader}>
          <Text style={driverHistoryStyles.rideDate}>{item.date}</Text>
          <View style={driverHistoryStyles.rideStatusContainer}>
            <View style={[
              driverHistoryStyles.statusIndicator, 
              { backgroundColor: item.status === 'completed' ? colors.primary : colors.warning }
            ]} />
            <Text style={driverHistoryStyles.rideStatus}>{item.status}</Text>
          </View>
        </View>
        
        <View style={driverHistoryStyles.customerInfo}>
          <Icon name="user" size={16} color={colors.primary} />
          <Text style={driverHistoryStyles.customerName}>
            {item.customer || 'Unknown Customer'}
          </Text>
        </View>
        
        <View style={driverHistoryStyles.rideRoute}>
          <View style={driverHistoryStyles.locationContainer}>
            <Icon name="map-pin" size={16} color={colors.primary} />
            <Text style={driverHistoryStyles.locationText} numberOfLines={1}>
              {item.pickupLoc}
            </Text>
          </View>
          
          <View style={driverHistoryStyles.routeLine}>
            <View style={driverHistoryStyles.routeDot} />
            <View style={driverHistoryStyles.routeDash} />
            <View style={driverHistoryStyles.routeDot} />
          </View>
          
          <View style={driverHistoryStyles.locationContainer}>
            <Icon name="flag" size={16} color="red" />
            <Text style={driverHistoryStyles.locationText} numberOfLines={1}>
              {item.dropoffLoc}
            </Text>
          </View>
        </View>
        
        <View style={driverHistoryStyles.rideDetails}>
          <Text style={driverHistoryStyles.vehicleType}>
            {item.vehicleType === 'motorbike' ? 'Motorbike' : 
             item.vehicleType === '4seater' ? '4-Seat Car' : '7-Seat Car'}
          </Text>
          <Text style={driverHistoryStyles.fareAmount}>{item.fare.toLocaleString()} VND</Text>
        </View>
        
        {isSelected && (
          <View style={driverHistoryStyles.expandedSection}>
            <TouchableOpacity 
              style={driverHistoryStyles.actionButton}
              onPress={() => Alert.alert('Ride Details', 
                `Ride ID: ${item.id}\n` +
                `Customer: ${item.customer || 'Unknown'}\n` +
                `Date: ${item.date}\n` +
                `Status: ${item.status}\n` +
                `Earnings: ${item.fare.toLocaleString()} VND`
              )}
            >
              <Icon name="info" size={16} color={colors.primary} />
              <Text style={driverHistoryStyles.actionButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={driverHistoryStyles.emptyContainer}>
      <Icon name="calendar" size={60} color={colors.lightGray} />
      <Text style={driverHistoryStyles.emptyText}>No ride history found</Text>
      <Text style={driverHistoryStyles.emptySubtext}>
        You haven't completed any rides yet
      </Text>
      <TouchableOpacity 
        style={driverHistoryStyles.refreshButton}
        onPress={handleRefresh}
      >
        <Text style={driverHistoryStyles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Ride History" />
      
      <View style={styles.content}>
        {isLoading ? (
          <View style={driverHistoryStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={driverHistoryStyles.loadingText}>Loading ride history...</Text>
          </View>
        ) : error ? (
          <View style={driverHistoryStyles.errorContainer}>
            <Icon name="alert-circle" size={50} color={colors.error} />
            <Text style={driverHistoryStyles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={driverHistoryStyles.refreshButton}
              onPress={handleRefresh}
            >
              <Text style={driverHistoryStyles.refreshButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={rideHistory}
            renderItem={renderRideItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={driverHistoryStyles.listContainer}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            onRefresh={handleRefresh}
            refreshing={isLoading}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default DriverRideHistoryScreen; 