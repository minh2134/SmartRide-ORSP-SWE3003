import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import HomeIcon from '../../assets/icons/home.svg';
import DatabaseIcon from '../../assets/icons/database.svg';
import UserIcon from '../../assets/icons/user.svg';

import CustomerScreen from '../screens/Customer/CustomerScreen';
import CustomerRideHistoryScreen from '../screens/Customer/CustomerRideHistoryScreen';
import CustomerProfileScreen from '../screens/Customer/CustomerProfileScreen';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

// Custom Tab Bar that uses vector images
const TabBarIcon = ({ iconComponent: IconComponent, color, size, focused }) => {
  return (
    <View style={{ 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: focused ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
      padding: 5,
      borderRadius: 5
    }}>
      <IconComponent width={size} height={size} fill={color} stroke={color} />
    </View>
  );
};

const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.primary, // Black background
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: colors.background, // White for active tab
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white for inactive
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="CustomerMain" 
        component={CustomerScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon iconComponent={HomeIcon} color={color} size={size} focused={focused} />
          )
        }}
      />
      <Tab.Screen 
        name="CustomerRideHistory" 
        component={CustomerRideHistoryScreen}
        options={{
          tabBarLabel: 'Rides',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon iconComponent={DatabaseIcon} color={color} size={size} focused={focused} />
          )
        }}
      />
      <Tab.Screen 
        name="CustomerProfile" 
        component={CustomerProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon iconComponent={UserIcon} color={color} size={size} focused={focused} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default CustomerTabNavigator; 