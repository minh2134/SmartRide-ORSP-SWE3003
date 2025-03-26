import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import Header from '../../components/Header/Header';
import styles from './styles';

const CustomerScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Customer Dashboard" />
      
      <View style={styles.content}>
        <Text style={styles.message}>
          Customer Dashboard
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CustomerScreen; 