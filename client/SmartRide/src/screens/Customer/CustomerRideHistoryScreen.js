import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import Header from '../../components/Header/Header';
import styles from './styles';

const CustomerRideHistoryScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Ride History" />
      
      <View style={styles.content}>
        <Text style={styles.message}>
          Ride History
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CustomerRideHistoryScreen; 