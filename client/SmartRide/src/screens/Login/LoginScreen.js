import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header/Header';
import TabSelector from '../../components/TabSelector/TabSelector';
import LoginForm from '../../components/LoginForm/LoginForm';
import SocialFooter from '../../components/SocialFooter/SocialFooter';
import colors from '../../theme/colors';
import styles from './styles';

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const navigation = useNavigation();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogin = (userType, username, client) => {
    console.log(`Handling login for ${userType} with username ${username}`);
    
    // Navigate to appropriate screen, passing the authenticated state
    try {
      if (userType === 'customer') {
        console.log('Navigating to Customer screen');
        navigation.navigate('Customer', { 
          username,
          isAuthenticated: true
        });
      } else {
        console.log('Navigating to Driver screen');
        navigation.navigate('Driver', { 
          username,
          isAuthenticated: true
        });
      }
    } catch (err) {
      console.error('Navigation error:', err);
      Alert.alert('Navigation Error', 'Failed to navigate to the next screen. Please try again.');
    }
  };

  return (
    <View style={styles.containerWithBackground}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
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
          
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subheading}>Please select your account type</Text>
          
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
        
        <SocialFooter />
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen; 