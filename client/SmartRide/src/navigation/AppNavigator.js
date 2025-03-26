import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/Login/LoginScreen';
import CustomerScreen from '../screens/Customer/CustomerScreen';
import DriverScreen from '../screens/Driver/DriverScreen';
import NotFoundScreen from '../screens/404/404Screen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Customer" component={CustomerScreen} />
      <Stack.Screen name="Driver" component={DriverScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 