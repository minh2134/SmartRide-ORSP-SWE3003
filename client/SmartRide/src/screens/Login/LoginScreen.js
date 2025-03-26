import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header/Header';
import TabSelector from '../../components/TabSelector/TabSelector';
import LoginForm from '../../components/LoginForm/LoginForm';
import styles from './styles';

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const navigation = useNavigation();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogin = (userType) => {
    // For now, just navigate to the appropriate screen
    if (userType === 'customer') {
      navigation.navigate('Customer');
    } else {
      navigation.navigate('Driver');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Login" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/SmartRide-logo.png')}
            style={styles.bigLogo}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.heading}>Login As</Text>
        
        <View style={styles.loginContainer}>
          <TabSelector 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />
          
          <LoginForm 
            userType={activeTab} 
            onLogin={handleLogin} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen; 