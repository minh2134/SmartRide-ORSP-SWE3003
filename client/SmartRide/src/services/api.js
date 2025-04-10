import axios from 'axios';
<<<<<<< Updated upstream
=======
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { API_BASE_URL } from '../config';
import { handleUnidirectionalMessage } from '../utils/messageHandlers';
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> Stashed changes

// Direct connection to the backend - use 10.0.2.2 to access localhost from Android emulator
const BASE_URL = 'http://10.0.2.2:8080';
const WS_URL = 'ws://10.0.2.2:8080/ws';

// Store auth information
let authToken = null;
let stompClient = null;

<<<<<<< Updated upstream
// Create axios instance for REST calls
=======
// Driver-related state
let activeDriverRide = null;
let driverRideCallbacks = [];

// Track active ride-specific subscriptions
let rideSpecificSubscriptions = {};

// Storage keys for persisting ride state
const STORAGE_KEYS = {
  ACTIVE_RIDE_REQUEST: 'activeRideRequest',
  ACTIVE_DRIVER_RIDE: 'activeDriverRide',
  DRIVER_READY_STATUS: 'driverReadyStatus',
  CURRENT_USER: 'currentUser'
};

// Add driver ready status tracking
let driverReadyStatus = false;

// Create axios instance with auth interceptors
>>>>>>> Stashed changes
const api = axios.create({
  baseURL: BASE_URL,
});

// Mock data for when the backend is not available
const MOCK_FARE_INFO = {
  baseFare: 5.00,
  perKilometerRate: 1.50,
  cancellationFee: 3.00,
  currency: 'USD'
};

const MOCK_CUSTOMER_PROFILE = {
  username: 'customer',
  name: 'John Doe',
  email: 'customer@example.com',
  phoneNumber: '123-456-7890',
  rating: 4.8,
  tripCount: 15
};

const MOCK_DRIVER_PROFILE = {
  username: 'driver',
  name: 'Jane Smith',
  email: 'driver@example.com',
  phoneNumber: '123-456-7890',
  rating: 4.9,
  tripCount: 102,
  vehicle: {
    model: 'Toyota Camry',
    color: 'Black',
    licensePlate: 'ABC123'
  }
};

// Fake client to use when real WebSocket fails
let fakeClient = null;
let subscriptions = {};
let nextSubscriptionId = 1;

// Test connection to verify server is available
const testConnection = async () => {
  console.log('Testing backend connectivity...');
  try {
    const response = await axios.get(`${BASE_URL}/rest/fare`, { timeout: 5000 });
    console.log('Server connection test successful:', response.status);
    return true;
  } catch (error) {
    console.error('Server connection test failed:', error.message || 'Unknown error');
    return false;
  }
};

<<<<<<< Updated upstream
// Extremely simple WebSocket connection function
const connectWebSocket = (username, password, onConnect, onError) => {
  console.log(`Attempting to connect to WebSocket as ${username}...`);
  
  // First verify the credentials via REST API
  axios.post(`${BASE_URL}/auth/login`, { username, password })
    .then(response => {
      console.log('Authentication successful, proceeding with fake WebSocket client');
      
      // Create a fake client instead of real WebSocket
      fakeClient = {
        connected: true,
        subscriptions: {},
=======
// Remove a callback subscription
const unsubscribeFromRideUpdates = (callback) => {
  const index = rideStatusCallbacks.indexOf(callback);
  if (index !== -1) {
    rideStatusCallbacks.splice(index, 1);
    return true;
  }
  return false;
};

// Notify all subscribers of ride status changes
const notifyRideStatusChange = () => {
  rideStatusCallbacks.forEach(callback => {
    try {
      callback(activeRideRequest);
    } catch (e) {
      console.error('Error in ride status callback:', e);
    }
  });
};

// Subscribe to driver ride updates
const subscribeToDriverUpdates = (callback) => {
  if (typeof callback !== 'function') {
    console.error('Invalid callback provided to subscribeToDriverUpdates');
    return false;
  }
  
  // Don't add duplicate callbacks
  if (!driverRideCallbacks.includes(callback)) {
    driverRideCallbacks.push(callback);
    
    // Immediately notify with current state
    try {
      callback(activeDriverRide);
    } catch (e) {
      console.error('Error in driver ride status callback:', e);
    }
  }
  
  return true;
};

// Remove a driver callback subscription
const unsubscribeFromDriverUpdates = (callback) => {
  const index = driverRideCallbacks.indexOf(callback);
  if (index !== -1) {
    driverRideCallbacks.splice(index, 1);
    return true;
  }
  return false;
};

// Notify all subscribers of driver ride status changes
const notifyDriverRideChange = () => {
  driverRideCallbacks.forEach(callback => {
    try {
      callback(activeDriverRide);
    } catch (e) {
      console.error('Error in driver ride status callback:', e);
    }
  });
};

// Enhanced connect function but with simpler flow to avoid login loops
const connectWebSocket = (username, password, onConnect, onError) => {
  // Clear state if switching between user types
  const previousUser = currentUser;
  currentUser = username;
  
  // Check if we're switching between customer and driver accounts
  const wasCustomer = previousUser && !previousUser.startsWith('driver');
  const wasDriver = previousUser && previousUser.startsWith('driver');
  const isDriver = username.startsWith('driver');
  
  // If switching between customer and driver, clear all state
  if ((wasCustomer && isDriver) || (wasDriver && !isDriver)) {
    console.log(`Switching from ${wasCustomer ? 'customer' : 'driver'} to ${isDriver ? 'driver' : 'customer'}, clearing state`);
    activeRideRequest = null;
    activeDriverRide = null;
    driverReadyStatus = false;
    
    // Also clear from storage
    AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_RIDE_REQUEST);
    AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_DRIVER_RIDE);
    AsyncStorage.removeItem(STORAGE_KEYS.DRIVER_READY_STATUS);
  }
  
  if (stompClient && stompClient.connected) {
    console.log('WebSocket already connected, but user changed - reconnecting');
    disconnectWebSocket();
  }
  
  console.log(`Connecting to WebSocket at ${WS_URL} with user ${username}`);
  
  // Store current user in AsyncStorage
  AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, username);
  
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
  
  // Set up a connection timeout
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
    authToken = stompClient.connectHeaders['Authorization'];
    
    // Restore ride state from storage asynchronously - don't block the login
    _restoreRideStateFromStorage().then(() => {
      // After restoring state, check for active rides
      return checkActiveRides();
    }).then(() => {
      // Attempt to resubscribe to any active rides
      return _resubscribeToActiveRides();
    }).then(() => {
      // Finally notify about ride state changes
      notifyRideStatusChange();
      
      if (onConnect) onConnect(client);
    }).catch(error => {
      console.error('Error during post-connection setup:', error);
      // Still proceed with connection even if restoration fails
    if (onConnect) onConnect(client);
    });
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

  try {
    client.activate();
  } catch (e) {
    console.error('Error activating STOMP client:', e);
    if (onError) onError('Failed to start connection');
  }
  
  return client;
};

// Check for any active rides from server
const checkActiveRides = () => {
  if (!stompClient || !stompClient.connected || !currentUser) {
    return Promise.resolve(null);
  }
  
  // Only check for customers (drivers don't request rides)
  if (currentUser.startsWith('driver')) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    // We'll use the customer info endpoint to check if customer is in a ride
    console.log('Checking for active rides after login');
    
    let timeoutId;
    
    // Subscribe to receive response
    const subscription = stompClient.subscribe('/user/topic/customer/response', (message) => {
      console.log('Received customer info response for active ride check:', message);
      try {
        const response = JSON.parse(message.body);
>>>>>>> Stashed changes
        
        // Simulated subscribe method
        subscribe: (destination, callback) => {
          try {
            const subscriptionId = `sub-${nextSubscriptionId++}`;
            
            // Store the callback with the subscription ID
            subscriptions[subscriptionId] = {
              destination,
              callback: (message) => {
                try {
                  callback(message);
                } catch (callbackError) {
                  console.error(`Error in subscription callback for ${destination}:`, callbackError);
                }
              }
            };
            
            console.log(`Fake subscription created for ${destination} with ID ${subscriptionId}`);
            return subscriptionId;
          } catch (error) {
            console.error('Error in fake subscribe:', error);
            return null;
          }
        },
        
        // Simulated send method
        send: (destination, headers, body) => {
          try {
            console.log(`Fake send to ${destination} with body:`, body);
            
            // Parse the body if it's a string
            let messageBody;
            try {
              messageBody = typeof body === 'string' ? JSON.parse(body) : body;
            } catch (parseError) {
              console.error('Error parsing message body:', parseError);
              messageBody = body;
            }
            
            // Simulate a response based on the destination
            setTimeout(() => {
              // Find subscriptions for this destination pattern
              Object.keys(subscriptions).forEach(subId => {
                const subscription = subscriptions[subId];
                
                // Check if this is a reply destination
                if (destination.includes('/app/')) {
                  const replyDestination = destination.replace('/app/', '/user/queue/');
                  
                  if (subscription.destination === replyDestination || 
                      subscription.destination.startsWith('/user/')) {
                    
                    // Simulate different responses based on the destination
                    let response;
                    if (destination === '/app/profile') {
                      response = username === 'driver' ? MOCK_DRIVER_PROFILE : MOCK_CUSTOMER_PROFILE;
                    } else {
                      response = { success: true, message: 'Operation completed successfully' };
                    }
                    
                    try {
                      subscription.callback({ body: JSON.stringify(response) });
                    } catch (callbackError) {
                      console.error('Error executing subscription callback:', callbackError);
                    }
                  }
                }
              });
            }, 300); // Simulate network delay
            
            return true;
          } catch (error) {
            console.error('Error in fake send:', error);
            return false;
          }
        },
        
        // Simulated disconnect
        disconnect: () => {
          console.log('Fake WebSocket disconnected');
          fakeClient.connected = false;
        }
      };
      
      // Call the success callback
      if (typeof onConnect === 'function') {
        onConnect(fakeClient);
      }
    })
    .catch(error => {
      console.error('Authentication failed:', error.message || 'Unknown error');
      
      // Call the error callback with proper error object
      if (typeof onError === 'function') {
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Authentication failed';
        onError(new Error(errorMessage));
      }
    });
};

// Get user profile data
const getUserProfile = (client, onSuccess, onError) => {
  if (!client || !client.connected) {
    console.error('Cannot get user profile: WebSocket not connected');
    if (typeof onError === 'function') {
      onError(new Error('WebSocket not connected'));
    }
    return;
  }
  
<<<<<<< Updated upstream
  try {
    // Subscribe to receive the response
    const subId = client.subscribe('/user/queue/profile', (message) => {
      try {
        const profile = JSON.parse(message.body);
        if (typeof onSuccess === 'function') {
          onSuccess(profile);
        }
      } catch (parseError) {
        console.error('Error parsing profile response:', parseError);
        if (typeof onError === 'function') {
          onError(new Error('Invalid profile data received'));
=======
  console.log(`Subscribing to ${topic}`);
  // Subscribe to receive user info
  const subscription = stompClient.subscribe(topic, (message) => {
    console.log('Received message:', message);
    try {
      const response = JSON.parse(message.body);
      console.log('Received response:', response);
      
      if (response.status === 200 && response.result) {
        callback(response.result);
        // Only unsubscribe if it's a response to the info request
        if (response.method === `/${userType}/info`) {
      subscription.unsubscribe();
>>>>>>> Stashed changes
        }
      }
    });
    
    // Send the request
    client.send('/app/profile', {}, JSON.stringify({ requestTime: new Date().toISOString() }));
  } catch (error) {
    console.error('Error requesting user profile:', error);
    if (typeof onError === 'function') {
      onError(new Error(`Failed to request profile: ${error.message || 'Unknown error'}`));
    }
  }
};

// Disconnect but maintain ride state
const disconnectWebSocket = () => {
  try {
    if (fakeClient && fakeClient.connected) {
      fakeClient.disconnect();
      fakeClient = null;
    }
    
<<<<<<< Updated upstream
    // Clear all subscriptions
    subscriptions = {};
    console.log('WebSocket disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting WebSocket:', error);
  }
};

// Get fare information from REST API
const getFareInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/rest/fare`, { timeout: 5000 });
    console.log('Fare info retrieved:', response.data);
    
    try {
      // Ensure we have a properly formatted object
      const fareInfo = typeof response.data === 'string' 
        ? JSON.parse(response.data) 
        : response.data;
        
      return fareInfo;
    } catch (parseError) {
      console.error('Error parsing fare info:', parseError);
      return MOCK_FARE_INFO;
    }
  } catch (error) {
    console.error('Failed to get fare info:', error.message || 'Unknown error');
    // Return mock data as fallback
    return MOCK_FARE_INFO;
  }
};

// Export the fake client for testing
const getFakeClient = () => fakeClient;

// Reconnect WebSocket (simplified for now)
const reconnectWebSocket = (onConnect, onError) => {
  // This is simplified to just create a new fake client
  console.log('Attempting to reconnect WebSocket...');
  
  if (fakeClient) {
    disconnectWebSocket();
  }
  
  // Create a new fake client and immediately consider it connected
  fakeClient = {
    connected: true,
    // Same implementation as in connectWebSocket
    subscribe: (destination, callback) => {
      try {
        const subscriptionId = `sub-${nextSubscriptionId++}`;
        subscriptions[subscriptionId] = {
          destination,
          callback: (message) => {
            try {
              callback(message);
            } catch (callbackError) {
              console.error(`Error in subscription callback for ${destination}:`, callbackError);
=======
    // Clean up ride-specific subscriptions
    Object.values(rideSpecificSubscriptions).forEach(subscription => {
      try {
        if (subscription && typeof subscription.unsubscribe === 'function') {
          subscription.unsubscribe();
        }
      } catch (e) {
        console.error('Error unsubscribing from ride-specific topic:', e);
      }
    });
    rideSpecificSubscriptions = {};
    
    // Persist state before disconnecting
    _persistRideStateToStorage();
    
    stompClient.deactivate();
    stompClient = null;
    authToken = null;
    
    // Don't clear currentUser yet - we'll check if it changed on next connect
    
    console.log('Disconnected from WebSocket, but ride state is preserved');
  }
};

// Persist current ride state to AsyncStorage
const _persistRideStateToStorage = async () => {
  try {
    if (activeRideRequest) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_RIDE_REQUEST, JSON.stringify(activeRideRequest));
      console.log('Active ride request saved to storage');
    }
    
    if (activeDriverRide) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_DRIVER_RIDE, JSON.stringify(activeDriverRide));
      console.log('Active driver ride saved to storage');
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.DRIVER_READY_STATUS, JSON.stringify(driverReadyStatus));
    console.log('Driver ready status saved:', driverReadyStatus);
  } catch (error) {
    console.error('Error persisting ride state:', error);
  }
};

// Restore ride state from AsyncStorage - modified to return a Promise
const _restoreRideStateFromStorage = () => {
  return new Promise((resolve) => {
    // First check if the current user matches the stored state
    AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER).then(storedUser => {
      // If no stored user or different user type, don't restore state
      if (!storedUser || (storedUser.startsWith('driver') !== currentUser.startsWith('driver'))) {
        console.log('User type changed or no stored user, not restoring state');
        resolve();
        return;
      }
      
      // Use Promise.all to handle all async operations together
      Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_RIDE_REQUEST),
        AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_DRIVER_RIDE),
        AsyncStorage.getItem(STORAGE_KEYS.DRIVER_READY_STATUS)
      ]).then(([savedRideRequest, savedDriverRide, savedDriverReadyStatus]) => {
        try {
          const isDriver = currentUser.startsWith('driver');
          
          // Only restore customer state for customer users
          if (!isDriver && savedRideRequest) {
            activeRideRequest = JSON.parse(savedRideRequest);
            console.log('Restored active ride request from storage:', activeRideRequest);
          }
          
          // Only restore driver state for driver users
          if (isDriver) {
            if (savedDriverRide) {
              activeDriverRide = JSON.parse(savedDriverRide);
              console.log('Restored active driver ride from storage:', activeDriverRide);
            }
            
            if (savedDriverReadyStatus) {
              driverReadyStatus = JSON.parse(savedDriverReadyStatus);
              console.log('Restored driver ready status:', driverReadyStatus);
            }
          }
          
          resolve();
        } catch (error) {
          console.error('Error parsing stored ride state:', error);
          // Even if there's an error, resolve so we don't block login
          resolve();
        }
      }).catch(error => {
        console.error('Error accessing AsyncStorage:', error);
        resolve();
      });
    }).catch(error => {
      console.error('Error checking stored user:', error);
      resolve();
    });
  });
};

// Resubscribe to active ride topics after reconnection - modified to return a Promise
const _resubscribeToActiveRides = () => {
  return new Promise((resolve) => {
    if (!stompClient || !stompClient.connected) {
      console.log('Cannot resubscribe: WebSocket not connected');
      resolve(false);
      return;
    }
    
    try {
      // Resubscribe to customer ride if exists
      if (activeRideRequest && activeRideRequest.id) {
        console.log('Resubscribing to customer ride:', activeRideRequest.id);
        subscribeToRideSpecificUpdates(activeRideRequest.id);
      }
      
      // Resubscribe to driver ride if exists
      if (activeDriverRide && activeDriverRide.id) {
        console.log('Resubscribing to driver ride:', activeDriverRide.id);
        subscribeToRideSpecificUpdates(activeDriverRide.id);
      }
      
      // If driver was ready before, asynchronously set ready again
      const isDriver = currentUser?.startsWith('driver');
      if (isDriver && driverReadyStatus && stompClient) {
        console.log('Driver was ready before, will try to set ready again');
        // Don't await this - just let it happen in the background
        setDriverReady().catch(error => {
          console.error('Error re-establishing driver ready status:', error);
        });
      }
      
      resolve(true);
    } catch (error) {
      console.error('Error during resubscription:', error);
      resolve(false);
    }
  });
};

// Send ride request to backend
const makeRideRequest = (rideDetails) => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected when trying to make ride request');
    return Promise.reject('WebSocket not connected');
  }

  // Check if customer already has an active ride request
  if (activeRideRequest && !currentUser?.startsWith('driver')) {
    console.error('Customer already has an active ride request');
    return Promise.reject('You already have an active ride. Please cancel or complete it before requesting another.');
  }

  return new Promise((resolve, reject) => {
    let timeoutId;
    
    // Subscribe to receive response
    const subscription = stompClient.subscribe('/user/topic/customer/response', (message) => {
      console.log('Received ride request response:', message);
      try {
        const response = JSON.parse(message.body);
        
        // Only handle responses for the makeride endpoint
        if (response.method === '/customer/makeride') {
          // Clear the timeout since we got a response
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          try {
            subscription.unsubscribe();
          } catch (e) {
            console.error('Error unsubscribing from make ride response:', e);
          }
          
          if (response.status === 200) {
            // Store the active ride request
            const rideId = response.result?.rideID || Date.now().toString();
            activeRideRequest = {
              ...rideDetails,
              id: rideId,
              status: 'pending', // pending = finding driver
              timestamp: Date.now()
            };
            
            // Subscribe to ride-specific updates
            subscribeToRideSpecificUpdates(rideId);
            
            // Persist to storage
            _persistRideStateToStorage();
            
            resolve(response.result);
          } else {
            reject(response.result?.content || 'Failed to create ride');
          }
        }
      } catch (e) {
        console.error('Error parsing response:', e);
        reject('Error parsing server response');
      }
    });

    // Format request to match RideInfo expected by the server
    // See Ride.java constructor which uses Customer and RideInfo
    const rideRequestPayload = {
      // Only send the fields expected by the server:
      // The RideInfo object in the backend expects these fields
      pickupLoc: rideDetails.pickupLoc,
      dropoffLoc: rideDetails.dropoffLoc,
      estimatedFare: rideDetails.estimatedFare,
      vehicleType: rideDetails.vehicleType
      // Note: server will set the timestamp itself with System.currentTimeMillis()
    };

    console.log('Sending ride request:', rideRequestPayload);
    stompClient.publish({
      destination: '/app/customer/makeride',
      body: JSON.stringify(rideRequestPayload)
    });
    
    // Set a timeout in case the server doesn't respond
    timeoutId = setTimeout(() => {
      try {
        subscription.unsubscribe();
      } catch (e) {
        // Subscription might already be closed
      }
      reject('Server timeout while requesting ride');
    }, 15000);
  }).then(result => {
    // Notify subscribers after updating state
    notifyRideStatusChange();
    return result;
  });
};

// Cancel an active ride request
const cancelRideRequest = () => {
  if (!activeRideRequest) {
    return Promise.reject('No active ride to cancel');
  }

  const rideId = activeRideRequest.id;
  
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected when trying to cancel ride');
    return Promise.reject('WebSocket not connected');
  }

  return new Promise((resolve, reject) => {
    let timeoutId;
    
    // Subscribe to receive response
    const subscription = stompClient.subscribe('/user/topic/customer/response', (message) => {
      console.log('Received cancel request response:', message);
      try {
        const response = JSON.parse(message.body);
        
        // Only handle responses for the cancelride endpoint
        if (response.method === '/customer/cancelride') {
          // Clear the timeout since we got a response
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          try {
            subscription.unsubscribe();
          } catch (e) {
            console.error('Error unsubscribing from cancel ride response:', e);
          }
          
          if (response.status === 200) {
            // Unsubscribe from ride-specific updates
            unsubscribeFromRideSpecificUpdates(rideId);
            
            // Clear the active ride request
            activeRideRequest = null;
            
            // Remove from storage
            AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_RIDE_REQUEST);
            
            resolve(response.result);
          } else {
            reject(response.result?.content || 'Failed to cancel ride');
          }
        }
      } catch (e) {
        console.error('Error parsing response:', e);
        reject('Error parsing server response');
      }
    });

    // Based on CustomerController.cancelRide, we don't need to send any payload
    // The server identifies the customer from the Principal and checks if they're in a ride
    console.log('Sending cancel request for ride');
    stompClient.publish({
      destination: '/app/customer/cancelride',
      body: JSON.stringify({}) // Empty payload as server doesn't need ride details
    });
    
    // Set a shorter timeout because of the known server bug with null driver
    // If the driver is null, the server will crash and never respond
    timeoutId = setTimeout(() => {
      try {
        subscription.unsubscribe();
      } catch (e) {
        // Subscription might already be closed
      }
      console.log('Server timeout - likely due to null driver bug in Ride.cancel()');
      
      // Since we know about the server-side bug, we'll handle it client-side
      // Clear the ride locally, since the server probably crashed
      activeRideRequest = null;
      notifyRideStatusChange();
      
      reject('Server timeout while cancelling ride. The ride has been cleared locally.');
    }, 5000); // Reduced from 10000 to 5000 ms
  }).then(result => {
    // Notify subscribers after updating state
    notifyRideStatusChange();
    return result;
  }).catch(error => {
    // Still notify in case of error as we may have updated the state
    unsubscribeFromRideSpecificUpdates(rideId);
    notifyRideStatusChange();
    throw error;
  });
};

// Format the ride data to match the UI needs
const formatRideData = (rides) => {
  if (!rides || !Array.isArray(rides)) {
    console.warn('Invalid ride data received:', rides);
    return [];
  }
  
  return rides.map(ride => {
    if (!ride) {
      console.warn('Invalid ride entry:', ride);
      return null;
    }
    
    // Convert timestamp to readable date
    let formattedDate = 'Unknown date';
    try {
      if (ride.timeStamp) {
        const date = new Date(ride.timeStamp * 1000);
        formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (e) {
      console.error('Error formatting date:', e);
    }
    
    return {
      id: ride.rideID || Math.random().toString(36).substring(2, 10),
      date: formattedDate,
      customer: ride.customer || 'Unknown Customer',
      driver: ride.driver || 'Unknown Driver',
      status: (ride.isDone === 1 || ride.isDone === true) ? 'completed' : 'in progress',
      pickupLoc: ride.pickupLoc || 'Not specified',
      dropoffLoc: ride.dropoffLoc || 'Not specified',
      vehicleType: ride.vehicleType || 'standard',
      fare: ride.fare || 0,
      timeStamp: ride.timeStamp || Date.now()
    };
  }).filter(Boolean); // Remove any null entries
};

// Fetch ride history for the current driver
const getDriverRideHistory = () => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected when trying to get driver ride history');
    return Promise.reject('WebSocket not connected');
  }

  return new Promise((resolve, reject) => {
    // Subscribe to receive response
    const subscription = stompClient.subscribe('/user/topic/driver/response', (message) => {
      console.log('Received driver ride history response:', message);
      try {
        const response = JSON.parse(message.body);
        
        // Only handle responses for the driver ride history endpoint
        if (response.method === '/driver/ridehistory') {
          subscription.unsubscribe();
          
          if (response.status === 200) {
            // Format the ride data to match UI needs
            const formattedRides = formatRideData(response.result.rides || []);
            resolve({ rides: formattedRides });
          } else {
            reject(response.result?.content || 'Failed to fetch driver ride history');
          }
        }
      } catch (e) {
        console.error('Error parsing response:', e);
        reject('Error parsing server response');
      }
    });

    // Request ride history
    console.log('Requesting driver ride history');
    stompClient.publish({
      destination: '/app/driver/ridehistory',
      body: JSON.stringify({})
    });
  });
};

// Fetch ride history (works for both customer and driver)
const getRideHistory = async (username, userType) => {
  // If no parameters provided, use the WebSocket connection method
  if (!username || !userType) {
    const isDriver = currentUser?.startsWith('driver');
    
    if (isDriver) {
      return getDriverRideHistory();
    } else {
      // Original function for customer
      if (!stompClient || !stompClient.connected) {
        console.error('WebSocket not connected when trying to get ride history');
        return Promise.reject('WebSocket not connected');
      }

      return new Promise((resolve, reject) => {
        // Subscribe to receive response
        const subscription = stompClient.subscribe('/user/topic/customer/response', (message) => {
          console.log('Received ride history response:', message);
          try {
            const response = JSON.parse(message.body);
            
            // Only handle responses for the ride history endpoint
            if (response.method === '/customer/ridehistory') {
              subscription.unsubscribe();
              
              if (response.status === 200) {
                // Format the ride data to match UI needs
                const formattedRides = formatRideData(response.result.rides || []);
                resolve({ rides: formattedRides });
              } else {
                reject(response.result?.content || 'Failed to fetch ride history');
              }
>>>>>>> Stashed changes
            }
          } catch (e) {
            console.error('Error parsing response:', e);
            reject('Error parsing server response');
          }
<<<<<<< Updated upstream
        };
        return subscriptionId;
      } catch (error) {
        console.error('Error in fake subscribe:', error);
        return null;
=======
        });

        // Request ride history
        console.log('Requesting ride history');
        stompClient.publish({
          destination: '/app/customer/ridehistory',
          body: JSON.stringify({})
        });
      });
    }
  }
  
  // If username and userType are provided, use REST API method
  try {
    console.log(`Fetching ride history for ${userType} ${username} via REST API`);
    const response = await getUserRideHistory(username, userType);
    
    if (response && response.data) {
      // Format the rides data to match the UI needs
      const formattedRides = formatRideData(response.data);
      return { rides: formattedRides };
    } else {
      console.warn('Invalid response format:', response);
      return { rides: [] };
    }
  } catch (error) {
    console.error(`Error in getRideHistory for ${userType}:`, error);
    throw error;
  }
};

// Set driver as ready to accept rides
const setDriverReady = () => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected when trying to set driver ready');
    return Promise.reject('WebSocket not connected');
  }

  return new Promise((resolve, reject) => {
    let timeoutId;
    
    // Subscribe to receive response
    const subscription = stompClient.subscribe('/user/topic/driver/response', (message) => {
      console.log('Received driver ready response:', message);
      try {
        const response = JSON.parse(message.body);
        
        // Only handle responses for the ready endpoint
        if (response.method === '/driver/ready') {
          // Clear the timeout since we got a response
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          try {
            subscription.unsubscribe();
          } catch (e) {
            console.error('Error unsubscribing from driver ready response:', e);
          }
          
          if (response.status === 200) {
            // Update driver ready status
            driverReadyStatus = true;
            
            // Persist to storage
            AsyncStorage.setItem(STORAGE_KEYS.DRIVER_READY_STATUS, JSON.stringify(true));
            
            // Check if a ride was assigned immediately
            const rideAssigned = !!response.result?.rideID;
            
            if (rideAssigned) {
              const rideId = response.result.rideID;
              // Store the assigned ride
              activeDriverRide = {
                id: rideId,
                customer: response.result.customer,
                pickupLoc: response.result.pickupLoc,
                dropoffLoc: response.result.dropoffLoc,
                vehicleType: response.result.vehicleType,
                estimatedFare: response.result.fare || 0,
                timestamp: response.result.timeStamp || Date.now()
              };
              
              // Persist driver ride to storage
              AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_DRIVER_RIDE, JSON.stringify(activeDriverRide));
              
              // Subscribe to ride-specific updates
              subscribeToRideSpecificUpdates(rideId);
              
              // Notify subscribers
              notifyDriverRideChange();
              
              resolve({
                rideAssigned: true,
                rideData: activeDriverRide
              });
            } else {
              resolve({
                rideAssigned: false
              });
            }
          } else {
            reject(response.result?.content || 'Failed to set driver as ready');
          }
        }
      } catch (e) {
        console.error('Error parsing response:', e);
        reject('Error parsing server response');
      }
    });

    // Send the ready request
    console.log('Setting driver as ready to accept rides');
    stompClient.publish({
      destination: '/app/driver/ready',
      body: JSON.stringify({}) // Empty payload
    });
    
    // Set a timeout in case the server doesn't respond
    timeoutId = setTimeout(() => {
      try {
        subscription.unsubscribe();
      } catch (e) {
        // Subscription might already be closed
      }
      reject('Server timeout while setting driver ready');
    }, 10000);
  });
};

// Complete a ride
const completeRide = (rideId) => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected when trying to complete ride');
    return Promise.reject('WebSocket not connected');
  }

  if (!activeDriverRide) {
    console.error('No active ride to complete');
    return Promise.reject('No active ride to complete');
  }

  return new Promise((resolve, reject) => {
    let timeoutId;
    
    // Subscribe to receive response
    const subscription = stompClient.subscribe('/user/topic/driver/response', (message) => {
      console.log('Received complete ride response:', message);
      try {
        const response = JSON.parse(message.body);
        
        // Only handle responses for the complete ride endpoint
        if (response.method === '/driver/completeride') {
          // Clear the timeout since we got a response
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          try {
            subscription.unsubscribe();
          } catch (e) {
            console.error('Error unsubscribing from complete ride response:', e);
          }
          
          if (response.status === 200) {
            // Unsubscribe from ride-specific updates
            unsubscribeFromRideSpecificUpdates(rideId);
            
            // Clear the active driver ride
            activeDriverRide = null;
            
            // Remove from storage
            AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_DRIVER_RIDE);
            
            // Reset driver ready status after completing ride
            driverReadyStatus = false;
            AsyncStorage.setItem(STORAGE_KEYS.DRIVER_READY_STATUS, JSON.stringify(false));
            
            // Notify subscribers
            notifyDriverRideChange();
            
            resolve(response.result);
          } else {
            reject(response.result?.content || 'Failed to complete ride');
          }
        }
      } catch (e) {
        console.error('Error parsing response:', e);
        reject('Error parsing server response');
      }
    });

    // Send the complete ride request
    console.log('Completing ride:', rideId);
    stompClient.publish({
      destination: '/app/driver/completeride',
      body: JSON.stringify({
        rideID: rideId
      })
    });
    
    // Set a timeout in case the server doesn't respond
    timeoutId = setTimeout(() => {
      try {
        subscription.unsubscribe();
      } catch (e) {
        // Subscription might already be closed
      }
      
      // Even if the server times out, we'll clear the ride locally
      activeDriverRide = null;
      notifyDriverRideChange();
      
      reject('Server timeout while completing ride');
    }, 10000);
  });
};

// Subscribe to real-time ride updates from the server
const subscribeToRealTimeUpdates = () => {
  if (!stompClient || !stompClient.connected || !currentUser) {
    console.error('Cannot subscribe to updates: WebSocket not connected');
    return;
  }
  
  console.log('Subscribing to real-time ride updates');
  
  // Determine the correct topic based on the user type
  const topicPath = currentUser.startsWith('driver') 
    ? '/user/topic/driver/notification' 
    : '/user/topic/customer/notification';
  
  // Subscribe to notifications topic
  const notificationSubscription = stompClient.subscribe(topicPath, (message) => {
    try {
      console.log('Received notification:', message);
      const notification = JSON.parse(message.body);
      
      // Handle ride status updates
      if (notification.type === 'ride_update' && notification.rideID) {
        console.log('Ride update notification:', notification);
        
        // If this is for our active ride, update it
        if (activeRideRequest && activeRideRequest.id === notification.rideID) {
          // Update active ride with the new status and driver info
          activeRideRequest = {
            ...activeRideRequest,
            status: notification.status,
            driver: notification.driver
          };
          
          // Notify subscribers
          notifyRideStatusChange();
        } else if (notification.status === 'assigned' && currentUser.startsWith('driver')) {
          // This is a new ride assigned to the driver
          activeRideRequest = {
            id: notification.rideID,
            customer: notification.customer,
            pickupLoc: notification.pickupLoc,
            dropoffLoc: notification.dropoffLoc,
            estimatedFare: notification.fare,
            status: 'assigned',
            timestamp: Date.now(),
            vehicleType: notification.vehicleType
          };
          
          // Notify subscribers
          notifyRideStatusChange();
        } else if (notification.status === 'completed') {
          // Ride is done, clear active ride
          activeRideRequest = null;
          notifyRideStatusChange();
        } else if (notification.status === 'receipt') {
          // Show the receipt but keep the activeRideRequest until dismissed
          // The receipt will be in notification.receipt
          notifyRideStatusChange();
        }
>>>>>>> Stashed changes
      }
    },
    send: (destination, headers, body) => {
      try {
        console.log(`Fake send to ${destination}`);
        
        // Parse the body if it's a string
        let messageBody;
        try {
          messageBody = typeof body === 'string' ? JSON.parse(body) : body;
        } catch (parseError) {
          console.error('Error parsing message body:', parseError);
          messageBody = body;
        }
        
        // Simulate a response
        setTimeout(() => {
          Object.keys(subscriptions).forEach(subId => {
            const subscription = subscriptions[subId];
            if (destination.includes('/app/') && 
                (subscription.destination === destination.replace('/app/', '/user/queue/') || 
                 subscription.destination.startsWith('/user/'))) {
              
              let response;
              if (destination === '/app/profile') {
                // Use mock profiles for the response
                response = MOCK_CUSTOMER_PROFILE; // Default to customer profile
              } else {
                response = { success: true, message: 'Operation completed' };
              }
              
              try {
                subscription.callback({ body: JSON.stringify(response) });
              } catch (callbackError) {
                console.error('Error executing subscription callback:', callbackError);
              }
            }
          });
        }, 300);
        
        return true;
      } catch (error) {
        console.error('Error in fake send:', error);
        return false;
      }
    },
    disconnect: () => {
      console.log('Fake WebSocket disconnected');
      fakeClient.connected = false;
    }
  };
  
  // Call the connect callback with the new client
  if (typeof onConnect === 'function') {
    onConnect(fakeClient);
  }
};

// Get ride history for a user (customer or driver)
const getUserRideHistory = async (username, userType) => {
  try {
    const endpoint = userType === 'driver' 
      ? `${API_BASE_URL}/api/driver/${username}/rides`
      : `${API_BASE_URL}/api/customer/${username}/rides`;
    
    const response = await axios.get(endpoint);
    return response;
  } catch (error) {
    console.error(`Error fetching ${userType} ride history:`, error);
    throw error;
  }
};

// Subscribe to a ride-specific topic to receive unidirectional messages like location updates
const subscribeToRideSpecificUpdates = (rideId) => {
  if (!stompClient || !stompClient.connected || !currentUser || !rideId) {
    console.error('Cannot subscribe to ride updates: Missing connection or ride ID');
    return false;
  }
  
  // Check if we're already subscribed to this ride
  if (rideSpecificSubscriptions[rideId]) {
    console.log(`Already subscribed to updates for ride ${rideId}`);
    return true;
  }
  
  const isDriver = currentUser?.startsWith('driver');
  const userType = isDriver ? 'driver' : 'customer';
  
  // Determine the correct topic based on the user type
  const topicPath = `/user/topic/${userType}/ride/${rideId}`;
  
  console.log(`Subscribing to ride-specific updates for ${rideId} at ${topicPath}`);
  
  try {
    // Subscribe to the ride-specific topic
    const subscription = stompClient.subscribe(topicPath, (message) => {
      try {
        console.log(`Received message for ride ${rideId}:`, message);
        const messageData = JSON.parse(message.body);
        
        // Pass to the message handler
        handleUnidirectionalMessage(messageData, rideId);
      } catch (e) {
        console.error(`Error handling message for ride ${rideId}:`, e);
      }
    });
    
    // Save the subscription
    rideSpecificSubscriptions[rideId] = subscription;
    
    console.log(`Successfully subscribed to updates for ride ${rideId}`);
    return true;
  } catch (e) {
    console.error(`Error subscribing to updates for ride ${rideId}:`, e);
    return false;
  }
};

// Unsubscribe from a ride-specific topic
const unsubscribeFromRideSpecificUpdates = (rideId) => {
  if (!rideId || !rideSpecificSubscriptions[rideId]) {
    return false;
  }
  
  try {
    rideSpecificSubscriptions[rideId].unsubscribe();
    delete rideSpecificSubscriptions[rideId];
    console.log(`Unsubscribed from updates for ride ${rideId}`);
    return true;
  } catch (e) {
    console.error(`Error unsubscribing from updates for ride ${rideId}:`, e);
    return false;
  }
};

// Add function to set driver as not ready
const setDriverNotReady = () => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected when trying to set driver not ready');
    return Promise.reject('WebSocket not connected');
  }
  
  return new Promise((resolve, reject) => {
    let timeoutId;
    
    // Subscribe to receive response
    const subscription = stompClient.subscribe('/user/topic/driver/response', (message) => {
      console.log('Received driver not ready response:', message);
      try {
        const response = JSON.parse(message.body);
        
        // Only handle responses for the not ready endpoint
        if (response.method === '/driver/notready') {
          // Clear the timeout since we got a response
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          try {
            subscription.unsubscribe();
          } catch (e) {
            console.error('Error unsubscribing from driver not ready response:', e);
          }
          
          if (response.status === 200) {
            // Update driver ready status
            driverReadyStatus = false;
            
            // Update in storage
            AsyncStorage.setItem(STORAGE_KEYS.DRIVER_READY_STATUS, JSON.stringify(false));
            
            resolve(response.result);
          } else {
            reject(response.result?.content || 'Failed to set driver as not ready');
          }
        }
      } catch (e) {
        console.error('Error parsing response:', e);
        reject('Error parsing server response');
      }
    });
    
    // Send the not ready request
    console.log('Setting driver as not ready');
    stompClient.publish({
      destination: '/app/driver/notready',
      body: JSON.stringify({}) // Empty payload
    });
    
    // Set a timeout in case the server doesn't respond
    timeoutId = setTimeout(() => {
      try {
        subscription.unsubscribe();
      } catch (e) {
        // Subscription might already be closed
      }
      reject('Server timeout while setting driver not ready');
    }, 10000);
  });
};

// Add function to check driver ready status
const isDriverReady = () => {
  return driverReadyStatus;
};

// Add function to check if user is in an active ride
const isInActiveRide = () => {
  return !!activeRideRequest || !!activeDriverRide;
};

export {
  api,
  connectWebSocket,
  getUserProfile,
  disconnectWebSocket,
<<<<<<< Updated upstream
  getFareInfo,
  testConnection,
  getFakeClient,
  reconnectWebSocket
=======
  isAuthenticated,
  getCurrentUser,
  makeRideRequest,
  getRideHistory,
  getDriverRideHistory,
  hasActiveRideRequest,
  getActiveRideRequest,
  clearActiveRideRequest,
  cancelRideRequest,
  subscribeToRideUpdates,
  unsubscribeFromRideUpdates,
  subscribeToDriverUpdates,
  unsubscribeFromDriverUpdates,
  notifyDriverRideChange,
  setDriverReady,
  completeRide,
  getUserRideHistory,
  subscribeToRideSpecificUpdates,
  unsubscribeFromRideSpecificUpdates,
  isDriverReady,
  isInActiveRide,
  setDriverNotReady
>>>>>>> Stashed changes
};