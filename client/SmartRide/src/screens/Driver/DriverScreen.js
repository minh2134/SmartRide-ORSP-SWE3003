import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import Header from '../../components/Header/Header';
import styles from './styles';

const DriverScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Driver Dashboard" />
      
      <View style={styles.content}>
        <Text style={styles.message}>
          Driver Dashboard
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default DriverScreen; 