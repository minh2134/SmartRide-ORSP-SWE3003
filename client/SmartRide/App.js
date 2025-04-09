import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { testWebSocketConnection } from './src/utils/webSocketUtils';
import * as encoding from "text-encoding";

const App = () => {
  useEffect(() => {
    // Test the WebSocket connection when the app loads
    const client = testWebSocketConnection();
    
    // Cleanup on unmount
    return () => {
      if (client && client.connected) {
        client.deactivate();
      }
    };
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App; 