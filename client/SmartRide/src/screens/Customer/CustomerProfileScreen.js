import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import Header from '../../components/Header/Header';
import styles from './styles';

const CustomerProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      
      <View style={styles.content}>
        <Text style={styles.message}>
          Customer Profile
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CustomerProfileScreen; 