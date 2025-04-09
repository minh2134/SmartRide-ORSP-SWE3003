import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Use 10.0.2.2 to access localhost from Android emulator
const BASE_URL = 'http://10.0.2.2:8080';
const WS_URL = 'ws://10.0.2.2:8080/ws';

// Simple token storage (in-memory only)
let authToken = null;
let currentUser = null;

// Create axios instance with auth interceptors
const api = axios.create({
  baseURL: BASE_URL,
});

// Add auth interceptor for REST requests
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Basic ${authToken}`;
  }
  return config;
});

// WebSocket client
let stompClient = null;

// Connect to WebSocket with authentication
const connectWebSocket = (username, password, onConnect, onError) => {
  console.log(`Connecting to WebSocket at ${WS_URL} with user ${username}`);
  
  // Store user info
  currentUser = username;
  
  // Create basic auth token for REST calls
  authToken = btoa(`${username}:${password}`);
  
  // Create STOMP client
  const client = new Client({
    webSocketFactory: () => {
      console.log('Creating direct WebSocket connection');
      const socket = new WebSocket(WS_URL);
      socket.onopen = () => console.log('WebSocket opened directly');
      socket.onclose = (e) => console.log('WebSocket closed', e);
      socket.onerror = (e) => console.error('WebSocket error', e);
      return socket;
    },
    // Use login/passcode headers as expected by the server
    connectHeaders: {
      login: username,
      passcode: password
    },
    debug: (str) => {
      console.log('STOMP: ' + str);
    },
    // No reconnection
    reconnectDelay: 0,
    // React Native workarounds from StompJS docs
    forceBinaryWSFrames: true,
    appendMissingNULLonIncoming: true
  });

  // Set a connection timeout
  const connectionTimeout = setTimeout(() => {
    if (!client.connected) {
      console.error('WebSocket connection timeout');
      if (onError) onError('Connection timeout. Server might be unreachable.');
    }
  }, 10000);

  // On successful connection
  client.onConnect = (frame) => {
    console.log('STOMP Connected successfully:', frame);
    clearTimeout(connectionTimeout);
    stompClient = client;
    if (onConnect) onConnect(client);
  };

  // Error handling
  client.onStompError = (frame) => {
    console.error('STOMP Error:', frame.headers['message'], frame.body);
    clearTimeout(connectionTimeout);
    if (onError) onError(frame.headers['message']);
  };

  client.onWebSocketError = (error) => {
    console.error('WebSocket error:', error);
    clearTimeout(connectionTimeout);
    if (onError) onError('Connection failed');
  };

  // Activate connection
  console.log('Activating STOMP client...');
  try {
    client.activate();
  } catch (e) {
    console.error('Error activating STOMP client:', e);
    if (onError) onError('Failed to start connection');
  }
  
  return client;
};

// Get user profile data via WebSocket
const getUserProfile = (callback, errorCallback) => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected when trying to get profile');
    if (errorCallback) errorCallback('WebSocket not connected');
    return;
  }

  console.log('Subscribing to /user/topic/customer/response');
  // Subscribe to receive user info as per the DOCS.md
  const subscription = stompClient.subscribe('/user/topic/customer/response', (message) => {
    console.log('Received message:', message);
    try {
      const response = JSON.parse(message.body);
      console.log('Received response:', response);
      
      // Check response structure based on API docs
      if (response.status === 200 && response.result) {
        callback(response.result);
        // Only unsubscribe if it's a response to the info request
        if (response.method === '/customer/info') {
          subscription.unsubscribe();
        }
      } else {
        console.error('Error in response:', response);
        if (errorCallback) errorCallback(response.result?.content || 'Unknown error');
      }
    } catch (e) {
      console.error('Error parsing message:', e);
      if (errorCallback) errorCallback('Error parsing server response');
    }
  });

  console.log('Sending request to /app/customer/info');
  // Request user info
  stompClient.publish({
    destination: '/app/customer/info',
    body: JSON.stringify({})
  });
};

// Get current authentication status
const isAuthenticated = () => {
  return !!stompClient && stompClient.connected;
};

// Get current user
const getCurrentUser = () => {
  return currentUser;
};

// Disconnect WebSocket
const disconnectWebSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
    stompClient = null;
    authToken = null;
    currentUser = null;
    console.log('Disconnected from WebSocket');
  }
};

// In api.js, update the testServerConnection function:
const testServerConnection = () => {
  // Create auth header with customer:'' (blank password)
  const authHeader = 'Basic ' + btoa('customer:');
  
  return fetch(`${BASE_URL}/`, {
    headers: {
      'Authorization': authHeader
    }
  })
    .then(response => ({ success: true, status: response.status }))
    .catch(error => ({ success: false, error: error.message }));
};

export {
  api,
  connectWebSocket,
  getUserProfile,
  disconnectWebSocket,
  isAuthenticated,
  getCurrentUser
};