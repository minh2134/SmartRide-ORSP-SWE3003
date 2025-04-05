import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// For Android emulator, use 10.0.2.2 instead of localhost
const SOCKET_URL = 'http://10.0.2.2:8080/ws';

// Basic WebSocket test function
export const testWebSocketConnection = () => {
  console.log('Testing WebSocket connection to:', SOCKET_URL);
  
  const client = new Client({
    // Using SockJS as the transport
    webSocketFactory: () => {
      console.log('Creating SockJS instance');
      const sockjs = new SockJS(SOCKET_URL);
      
      sockjs.onopen = () => console.log('SockJS raw socket opened');
      sockjs.onclose = (e) => console.log('SockJS raw socket closed', e);
      sockjs.onerror = (e) => console.error('SockJS raw socket error', e);
      
      return sockjs;
    },
    // Basic Authentication header
    connectHeaders: {
      'Authorization': 'Basic ' + btoa('customer:')
    },
    debug: (str) => {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  // On successful connection
  client.onConnect = (frame) => {
    console.log('Connected to WebSocket:', frame);
    
    // Subscribe to greetings topic
    const subscription = client.subscribe('/topic/greetings', (message) => {
      console.log('Received message:', message.body);
      try {
        const payload = JSON.parse(message.body);
        console.log('Parsed response:', payload);
        console.log('Greeting content:', payload.content);
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });
    
    // Send test message
    console.log('Sending test message...');
    client.publish({
      destination: '/app/hello',
      body: JSON.stringify({ name: 'React Native Tester' }),
    });
    
    // Disconnect after 5 seconds to complete the test
    setTimeout(() => {
      console.log('Test complete, disconnecting...');
      subscription.unsubscribe();
      client.deactivate();
    }, 5000);
  };

  // Error handling
  client.onStompError = (frame) => {
    console.error('STOMP Error:', frame.headers['message'], frame.body);
  };
  
  client.onWebSocketError = (error) => {
    console.error('WebSocket error:', error);
  };

  // Start the connection
  console.log('Activating STOMP client...');
  client.activate();
  
  return client; // Return the client if you need to manually disconnect
}; 