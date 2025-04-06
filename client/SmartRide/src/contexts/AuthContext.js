import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectWebSocket, disconnectWebSocket, testConnection } from '../services/api';

// Create the auth context
const AuthContext = createContext();

// Storage keys
const AUTH_USER_KEY = '@SmartRide:user';
const AUTH_TYPE_KEY = '@SmartRide:userType';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stompClient, setStompClient] = useState(null);

  // Initialize state from storage on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        console.log('Loading stored auth data...');
        const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY);
        const storedType = await AsyncStorage.getItem(AUTH_TYPE_KEY);
        
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log('Stored user found:', userData);
            setUser(userData);
            setUserType(storedType);
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            // Invalid data - clear it
            AsyncStorage.removeItem(AUTH_USER_KEY);
            AsyncStorage.removeItem(AUTH_TYPE_KEY);
          }
        } else {
          console.log('No stored user found');
        }
      } catch (error) {
        console.error('Failed to load auth info from storage', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStoredAuth();
  }, []);

  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (stompClient) {
        console.log('Cleaning up WebSocket connection');
        try {
          disconnectWebSocket();
        } catch (error) {
          console.error('Error during WebSocket cleanup:', error);
        }
      }
    };
  }, [stompClient]);

  // Sign in function
  const signIn = async (username, password, type) => {
    console.log(`Attempting to sign in as ${type} with username: ${username}`);
    setIsLoading(true);
    
    // Hardcode customer credentials
    if (type === 'customer') {
      username = 'customer';
      password = 'customer';
    }
    
    return new Promise((resolve, reject) => {
      // Create connection timeout
      const connectionTimeout = setTimeout(() => {
        setIsLoading(false);
        reject(new Error('Connection timeout. Server might be unreachable.'));
      }, 15000);
      
      // First verify the server is available
      testConnection()
        .then(isAvailable => {
          if (!isAvailable) {
            clearTimeout(connectionTimeout);
            setIsLoading(false);
            reject(new Error('Server is not responding. Please try again later.'));
            return;
          }
          
          connectWebSocket(
            username,
            password,
            // Success callback
            (client) => {
              try {
                clearTimeout(connectionTimeout);
                console.log('WebSocket connected successfully');
                
                // Store the client
                setStompClient(client);
                
                // Set authenticated user
                const userData = { username };
                setUser(userData);
                setUserType(type);
                
                // Save to AsyncStorage
                Promise.all([
                  AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData)),
                  AsyncStorage.setItem(AUTH_TYPE_KEY, type)
                ]).then(() => {
                  console.log('Auth data saved to storage');
                  setIsLoading(false);
                  resolve(userData);
                }).catch(err => {
                  console.error('Error saving auth data:', err);
                  setIsLoading(false);
                  // Still resolve as authentication was successful
                  resolve(userData);
                });
              } catch (error) {
                clearTimeout(connectionTimeout);
                console.error('Error in connect success handler:', error);
                setIsLoading(false);
                reject(new Error('Error handling successful connection'));
              }
            },
            // Error callback
            (error) => {
              clearTimeout(connectionTimeout);
              console.error('WebSocket connection failed:', error);
              setIsLoading(false);
              
              // Make sure we have a valid Error object
              const errorObj = typeof error === 'string' 
                ? new Error(error)
                : (error instanceof Error ? error : new Error('Connection failed'));
                
              reject(errorObj);
            }
          );
        })
        .catch(error => {
          clearTimeout(connectionTimeout);
          console.error('Error testing connection:', error);
          setIsLoading(false);
          reject(new Error(`Cannot connect to server: ${error.message || 'Unknown error'}`));
        });
    });
  };

  // Sign out function
  const signOut = async () => {
    console.log('Signing out...');
    try {
      // Disconnect WebSocket
      if (stompClient) {
        disconnectWebSocket();
        setStompClient(null);
      }
      
      // Clear storage
      await Promise.all([
        AsyncStorage.removeItem(AUTH_USER_KEY),
        AsyncStorage.removeItem(AUTH_TYPE_KEY)
      ]);
      console.log('Auth data cleared from storage');
      
      // Clear state
      setUser(null);
      setUserType(null);
    } catch (error) {
      console.error('Error during sign out:', error);
      Alert.alert('Error', 'Failed to sign out properly');
    }
  };

  // Context value
  const authContext = {
    user,
    userType,
    isLoading,
    stompClient,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 