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
import colors from '../../theme/colors';
import styles from './styles';

const LoginForm = ({ userType, onLogin, isLoading: externalLoading, error: externalError, disabled }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  // Use external state if provided, otherwise use internal state
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;
  const error = externalError || internalError;
  const isDisabled = disabled || isLoading;

  const handleSubmit = () => {
    if (isDisabled) return;
    
    console.log(`Submitting login form for ${userType} with username: ${username}`);
    
    // Validate input
    if (!username.trim()) {
      setInternalError('Username is required');
      return;
    }
    
    if (!password.trim()) {
      setInternalError('Password is required');
      return;
    }
    
    setInternalError('');
    setInternalLoading(true);
    
    try {
      // Call the onLogin handler with username and password
      onLogin(userType, username, password);
    } catch (err) {
      console.error('Error in form submission:', err);
      setInternalError('An error occurred while processing your request');
      setInternalLoading(false);
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
        <Icon name="user" size={20} color={isDisabled ? colors.lightGray : colors.gray} style={styles.inputIcon} />
        <TextInput
          style={[
            styles.input,
            isDisabled && styles.disabledInput
          ]}
          placeholder="Username"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setInternalError('');
          }}
          autoCapitalize="none"
          placeholderTextColor={isDisabled ? colors.lightGray : colors.gray}
          editable={!isDisabled}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color={isDisabled ? colors.lightGray : colors.gray} style={styles.inputIcon} />
        <TextInput
          style={[
            styles.input,
            isDisabled && styles.disabledInput
          ]}
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setInternalError('');
          }}
          secureTextEntry={!isPasswordVisible}
          placeholderTextColor={isDisabled ? colors.lightGray : colors.gray}
          editable={!isDisabled}
        />
        <TouchableOpacity 
          onPress={togglePasswordVisibility}
          style={styles.visibilityToggle}
          disabled={isDisabled}
        >
          <Icon 
            name={isPasswordVisible ? "eye-off" : "eye"} 
            size={20} 
            color={isDisabled ? colors.lightGray : colors.gray}
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
          { backgroundColor: isDisabled ? colors.lightGray : colors.primary }
        ]} 
        onPress={handleSubmit}
        disabled={isDisabled}
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
        disabled={isDisabled}
      >
        <Text style={{ color: isDisabled ? colors.lightGray : colors.primary, fontSize: 14 }}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm; 