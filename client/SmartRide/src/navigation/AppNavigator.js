import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/Login/LoginScreen';
import CustomerTabNavigator from './CustomerTabNavigator';
import DriverScreen from '../screens/Driver/DriverScreen';
import NotFoundScreen from '../screens/404/404Screen';

const Stack = createStackNavigator();

// AppNavigator is the main navigator for the app. Just assign an ID to the screen and use Stack.Screen to add a new route.
const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Customer" component={CustomerTabNavigator} />
      <Stack.Screen name="Driver" component={DriverScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 