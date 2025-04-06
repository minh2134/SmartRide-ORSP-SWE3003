import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  Image, 
  StatusBar, 
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import Header from '../../components/Header/Header';
import TabSelector from '../../components/TabSelector/TabSelector';
import LoginForm from '../../components/LoginForm/LoginForm';
import SocialFooter from '../../components/SocialFooter/SocialFooter';
import { useAuth } from '../../contexts/AuthContext';
import colors from '../../theme/colors';
import styles from './styles';

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const { signIn } = useAuth();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(''); // Clear any errors when changing tabs
  };

  const handleLogin = async (userType, username, password) => {
    console.log(`Handling login for ${userType} with username: ${username}`);
    
    // Clear previous errors
    setError('');
    setIsLoading(true);
    
    try {
      // Attempt to sign in using AuthContext
      await signIn(username, password, userType);
      
      // Navigate to appropriate screen based on user type
      if (userType === 'customer') {
        console.log('Navigating to Customer screen');
        navigation.navigate('Customer');
      } else {
        console.log('Navigating to Driver screen');
        navigation.navigate('Driver');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      
      // Determine error message based on error content
      let errorMessage = error.message || 'Failed to login. Please try again.';
      
      if (errorMessage.includes('401')) {
        errorMessage = 'Invalid username or password.';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'Connection timeout. Server might be unreachable.';
      } else if (errorMessage.includes('Cannot connect')) {
        errorMessage = 'Server is not responding. Please try again later.';
      }
      
      setError(errorMessage);
      Alert.alert('Login Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebugLogin = () => {
    console.log('Using debug login to bypass login screen');
    navigation.navigate('Customer');
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
          
          <View style={styles.loginContainer}>
            <TabSelector 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
            
            <LoginForm 
              userType={activeTab} 
              onLogin={handleLogin}
              isLoading={isLoading}
              error={error}
            />
            
            <TouchableOpacity
              style={styles.debugButton}
              onPress={handleDebugLogin}
            >
              <Text style={styles.debugButtonText}>DEBUG: Skip Login</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <SocialFooter />
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen; 