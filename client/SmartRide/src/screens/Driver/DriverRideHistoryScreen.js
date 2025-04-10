import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../../theme/colors';
import styles from './styles';
import driverHistoryStyles from './driverHistoryStyles';

// Sample ride history data
const initialRideHistory = [
  {
    id: 1001,
    customer: 'Pout',
    pickupLoc: '10.5, 105.0',
    dropoffLoc: '15.0, 120.0',
    fare: 65000,
    status: 'completed',
    date: '2023-05-15T14:30:00Z',
    vehicleType: 'Car'
  },
  {
    id: 1002,
    customer: 'Pout',
    pickupLoc: '10.5, 105.0',
    dropoffLoc: '15.0, 120.0',
    fare: 42000,
    status: 'cancelled',
    date: '2023-05-14T10:15:00Z',
    vehicleType: 'Car'
  },
  {
    id: 1003,
    customer: 'Pout',
    pickupLoc: '10.5, 105.0',
    dropoffLoc: '15.0, 120.0',
    fare: 78000,
    status: 'completed',
    date: '2023-05-10T09:30:00Z',
    vehicleType: 'Car'
  },
  {
    id: 1004,
    customer: 'Pout',
    pickupLoc: '10.5, 105.0',
    dropoffLoc: '15.0, 120.0',
    fare: 52000,
    status: 'completed',
    date: '2023-04-28T16:45:00Z',
    vehicleType: 'Car'
  },
  {
    id: 1005,
    customer: 'Pout',
    pickupLoc: '10.5, 105.0',
    dropoffLoc: '15.0, 120.0',
    fare: 34000,
    status: 'cancelled',
    date: '2023-04-22T11:20:00Z',
    vehicleType: 'Car'
  }
];

const DriverRideHistoryScreen = () => {
  const navigation = useNavigation();
  const [rideHistory] = useState(initialRideHistory);
  const [selectedRide, setSelectedRide] = useState(null);

  // Render a ride history item
  const renderRideItem = ({ item }) => {
    const isSelected = selectedRide?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[driverHistoryStyles.rideItem, isSelected && driverHistoryStyles.selectedRideItem]}
        onPress={() => setSelectedRide(isSelected ? null : item)}
      >
        <View style={driverHistoryStyles.rideHeader}>
          <Text style={driverHistoryStyles.rideDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
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
            {item.vehicleType || 'Car'}
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
                `Date: ${new Date(item.date).toLocaleDateString()}\n` +
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Ride History" />
      
      <View style={styles.content}>
        <FlatList
          data={rideHistory}
          renderItem={renderRideItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={driverHistoryStyles.listContainer}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={18} color="white" style={{marginRight: 8}} />
          <Text style={styles.buttonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DriverRideHistoryScreen; 