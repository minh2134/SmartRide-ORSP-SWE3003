import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { connectWebSocket } from '../../services/api';
import colors from '../../theme/colors';
import styles from './styles';

const LoginForm = ({ userType, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = () => {
    console.log(`Attempting login as ${userType} with username: ${username}`);
    setIsLoading(true);
    setError('');
    
    // Timeout safety net
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError('Connection timeout. Please try again.');
        Alert.alert('Login Timeout', 'Connection to server timed out. Please check if the server is running.');
      }
    }, 15000);
    
    // Connect to WebSocket with authentication
    try {
      connectWebSocket(
        username, 
        password,
        // Success callback 
        (client) => {
          console.log('Login successful, calling onLogin callback');
          clearTimeout(timeoutId);
          setIsLoading(false);
          
          // Force navigation even if callback fails
          try {
            onLogin(userType, username, client);
          } catch (err) {
            console.error('Error in onLogin callback:', err);
            // Fall back to direct navigation
            if (userType === 'customer') {
              navigation.navigate('Customer', { 
                username,
                isAuthenticated: true
              });
            } else {
              navigation.navigate('Driver', { 
                username,
                isAuthenticated: true
              });
            }
          }
        },
        // Error callback
        (errorMessage) => {
          console.error('Login error:', errorMessage);
          clearTimeout(timeoutId);
          setIsLoading(false);
          setError(errorMessage || 'Connection failed. Please try again.');
          Alert.alert('Login Error', errorMessage || 'Connection failed. Please try again.');
        }
      );
    } catch (err) {
      console.error('Exception during login:', err);
      clearTimeout(timeoutId);
      setIsLoading(false);
      setError('Error connecting to server');
      Alert.alert('Connection Error', 'Error connecting to server: ' + err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const handleForgotPassword = () => {
    // Redirect to 404 screen
    navigation.navigate('NotFound');
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color={colors.gray} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={userType === 'customer' ? "Customer Username" : "Driver Username"}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor={colors.lightGray}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color={colors.gray} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          placeholderTextColor={colors.lightGray}
        />
        <TouchableOpacity 
          onPress={togglePasswordVisibility}
          style={styles.visibilityToggle}
        >
          <Icon 
            name={isPasswordVisible ? "eye-off" : "eye"} 
            size={20} 
            color={colors.gray}
          />
        </TouchableOpacity>
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <TouchableOpacity 
        style={[
          styles.loginButton,
          { backgroundColor: isLoading ? colors.primaryLight : colors.primary }
        ]} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="log-in" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Login</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ alignItems: 'center', padding: 12, marginTop: 4 }}
        onPress={handleForgotPassword}
      >
        <Text style={{ color: colors.primary, fontSize: 14 }}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm; 