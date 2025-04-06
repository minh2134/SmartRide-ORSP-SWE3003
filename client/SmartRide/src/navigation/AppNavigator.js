import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import LoginScreen from '../screens/Login/LoginScreen';
import CustomerScreen from '../screens/Customer/CustomerScreen';
import CustomerProfileScreen from '../screens/Customer/CustomerProfileScreen';
import CustomerRideHistoryScreen from '../screens/Customer/CustomerRideHistoryScreen';
import DriverScreen from '../screens/Driver/DriverScreen';
import NotFoundScreen from '../screens/404/404Screen';
import { useAuth } from '../contexts/AuthContext';
import colors from '../theme/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Customer Tab Navigator as a nested component
const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#777777',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEEEEE',
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        }
      }}
    >
      <Tab.Screen
        name="CustomerDashboard"
        component={CustomerScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CustomerRideHistory"
        component={CustomerRideHistoryScreen}
        options={{
          tabBarLabel: 'Rides',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CustomerProfile"
        component={CustomerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// AppNavigator is the main navigator for the app
const AppNavigator = () => {
  const { isAuthenticated, isLoading, userType } = useAuth();

  if (isLoading) {
    // You could replace this with a splash screen component
    return null;
  }

  return (
    <Stack.Navigator 
      initialRouteName={isAuthenticated ? (userType === 'customer' ? 'Customer' : 'Driver') : 'Login'}
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        // Authenticated routes
        <>
          <Stack.Screen name="Customer" component={CustomerTabs} />
          <Stack.Screen name="Driver" component={DriverScreen} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} />
        </>
      ) : (
        // Non-authenticated routes
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 