import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Use 10.0.2.2 to access localhost from Android emulator
const BASE_URL = 'http://10.0.2.2:8080';
const WS_URL = `${BASE_URL}/ws`

// Simple token storage (in-memory only)
let authToken = null;

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

// Add this flag
const USE_SOCKJS = false; // Set to false to use direct WebSocket

// Connect to WebSocket with authentication
const connectWebSocket = (username, password, onConnect, onError) => {
  console.log(`Connecting to WebSocket at ${WS_URL} with user ${username}`);
  
  // Basic auth token
  authToken = btoa(`${username}:${password}`);
  
  // Create STOMP client
  const client = new Client({
    webSocketFactory: () => {
      if (USE_SOCKJS) {
        console.log('Creating SockJS instance');
        const sockjs = new SockJS(WS_URL);
        sockjs.onopen = () => console.log('SockJS socket opened');
        sockjs.onclose = (e) => console.log('SockJS socket closed', e);
        sockjs.onerror = (e) => console.error('SockJS socket error', e);
        return sockjs;
      } else {
        // Try direct WebSocket connection instead
        console.log('Creating direct WebSocket connection');
        // Note: using ws:// protocol instead of http://
        const socket = new WebSocket('ws://10.0.2.2:8080/ws');
        socket.onopen = () => console.log('WebSocket opened directly');
        socket.onclose = (e) => console.log('WebSocket closed', e);
        socket.onerror = (e) => console.error('WebSocket error', e);
        return socket;
      }
    },
    connectHeaders: {
      'Authorization': 'Basic ' + authToken
    },
    debug: (str) => {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
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

  console.log('Subscribing to /user/topic/info');
  // Subscribe to receive user info
  const subscription = stompClient.subscribe('/user/topic/info', (message) => {
    console.log('Received message:', message);
    try {
      const userInfo = JSON.parse(message.body);
      console.log('Received user info:', userInfo);
      subscription.unsubscribe();
      callback(userInfo);
    } catch (e) {
      console.error('Error parsing user info:', e);
      if (errorCallback) errorCallback('Error parsing user data');
    }
  });

  console.log('Sending request to /app/customer/info');
  // Request user info - this is the correct endpoint from CustomerController
  stompClient.publish({
    destination: '/app/customer/info',
    body: JSON.stringify({})
  });
};

// Disconnect WebSocket
const disconnectWebSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
    stompClient = null;
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
  disconnectWebSocket
};