import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import LoginScreen from '../screens/Login/LoginScreen';
import CustomerScreen from '../screens/Customer/CustomerScreen';
import CustomerProfileScreen from '../screens/Customer/CustomerProfileScreen';
import CustomerRideHistoryScreen from '../screens/Customer/CustomerRideHistoryScreen';
import DriverScreen from '../screens/Driver/DriverScreen';
import DriverProfileScreen from '../screens/Driver/DriverProfileScreen';
import DriverRideHistoryScreen from '../screens/Driver/DriverRideHistoryScreen';
import NotFoundScreen from '../screens/404/404Screen';
import colors from '../theme/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Customer Tab Navigator as a nested component
const CustomerTabs = ({ route }) => {
  const { username, isAuthenticated } = route.params || {};
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
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
        initialParams={{ username, isAuthenticated }}
      />
      <Tab.Screen
        name="CustomerRideHistory"
        component={CustomerRideHistoryScreen}
        options={{
          tabBarLabel: 'Rides',
          tabBarIcon: ({ color, size }) => (
            <Icon name="clock" color={color} size={size} />
          ),
        }}
        initialParams={{ username, isAuthenticated }}
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
        initialParams={{ username, isAuthenticated }}
      />
    </Tab.Navigator>
  );
};

// Driver Tab Navigator as a nested component
const DriverTabs = ({ route }) => {
  const { username, isAuthenticated } = route.params || {};
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
      }}
    >
      <Tab.Screen
        name="DriverDashboard"
        component={DriverScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
        initialParams={{ username, isAuthenticated }}
      />
      <Tab.Screen
        name="DriverRideHistory"
        component={DriverRideHistoryScreen}
        options={{
          tabBarLabel: 'Rides',
          tabBarIcon: ({ color, size }) => (
            <Icon name="clock" color={color} size={size} />
          ),
        }}
        initialParams={{ username, isAuthenticated }}
      />
      <Tab.Screen
        name="DriverProfile"
        component={DriverProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
        initialParams={{ username, isAuthenticated }}
      />
    </Tab.Navigator>
  );
};

// AppNavigator is the main navigator for the app
const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Customer" component={CustomerTabs} />
      <Stack.Screen name="Driver" component={DriverTabs} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 