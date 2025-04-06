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

// Use to display customer ride history
const CustomerRideHistoryScreen = () => {
  const { user } = useAuth();
  
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