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
import historyStyles from './rideHistoryStyles';

// Use to display customer ride history
const CustomerRideHistoryScreen = () => {
  const route = useRoute();
  const { username, isAuthenticated: authenticated } = route.params || {};
  
  const [rideHistory, setRideHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);

  // Fetch ride history on component mount
  useEffect(() => {
    if (authenticated) {
      fetchRideHistory();
    } else {
      setIsLoading(false);
      setError('You need to be logged in to view ride history.');
    }
  }, [authenticated]);

  // Fetch ride history from backend
  const fetchRideHistory = () => {
    setIsLoading(true);
    setError('');

    // Request ride history from backend
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
          <FlatList
            data={rideHistory}
            renderItem={renderRideItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={historyStyles.listContainer}
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

export default CustomerRideHistoryScreen; 