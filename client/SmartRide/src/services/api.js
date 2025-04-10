import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use 10.0.2.2 to access localhost from Android emulator
const BASE_URL = 'http://10.0.2.2:8080';
const WS_URL = 'ws://10.0.2.2:8080/ws';

// Simple token storage (in-memory only)
let authToken = null;
let currentUser = null;
// Track active ride status
let activeRideRequest = null;
// Callbacks for ride status updates
let rideStatusCallbacks = [];

// Helper function to persist ride state to AsyncStorage
const _persistRideStateToStorage = () => {
  try {
    if (activeRideRequest) {
      // Store active ride data
      AsyncStorage.setItem('ACTIVE_RIDE', JSON.stringify(activeRideRequest))
        .catch(error => console.error('Error saving active ride to storage:', error));
      
      // Also store current user for validation during restore
      if (currentUser) {
        AsyncStorage.setItem('CURRENT_USER', currentUser)
          .catch(error => console.error('Error saving current user to storage:', error));
      }
    } else {
      // Remove active ride data when it's cleared
      AsyncStorage.removeItem('ACTIVE_RIDE')
        .catch(error => console.error('Error removing active ride from storage:', error));
    }
  } catch (e) {
    console.error('Error in _persistRideStateToStorage:', e);
  }
};

// Helper function to restore ride state from AsyncStorage
const _restoreRideStateFromStorage = async () => {
  try {
    // Get stored username for validation
    const storedUser = await AsyncStorage.getItem('CURRENT_USER');
    
    // Only restore ride state if the current user matches the stored user
    if (storedUser === currentUser) {
      const rideJson = await AsyncStorage.getItem('ACTIVE_RIDE');
      if (rideJson) {
        const storedRide = JSON.parse(rideJson);
        console.log('Restored ride state from storage:', storedRide);
        activeRideRequest = storedRide;
        return storedRide;
      }
    } else if (currentUser) {
      // Store the current user
      AsyncStorage.setItem('CURRENT_USER', currentUser)
        .catch(error => console.error('Error saving current user to storage:', error));
    }
    return null;
  } catch (e) {
    console.error('Error restoring ride state from storage:', e);
    return null;
  }
};

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

// Register a callback for ride status changes
const subscribeToRideUpdates = (callback) => {
  if (typeof callback !== 'function') {
    console.error('Invalid callback provided to subscribeToRideUpdates');
    return false;
  }
  
  // Don't add duplicate callbacks
  if (!rideStatusCallbacks.includes(callback)) {
    rideStatusCallbacks.push(callback);
    
    // Immediately notify with current state
    try {
      callback(activeRideRequest);
    } catch (e) {
      console.error('Error in ride status callback:', e);
    }
  }
  
  return true;
};

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
    
    // Check for any active rides from server after authentication
    checkActiveRides().then(() => {
      // Notify subscribers of potential state change
      notifyRideStatusChange();
    });
    
    // Subscribe to real-time updates if we're a customer
    if (!username.startsWith('driver')) {
      subscribeToRealTimeUpdates();
    }
    
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
        
        // Only handle responses for the info endpoint
        if (response.method === '/customer/info') {
          // Clear the timeout since we got a response
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          try {
            subscription.unsubscribe();
          } catch (e) {
            console.error('Error unsubscribing from customer info:', e);
          }
          
          if (response.status === 200 && response.result) {
            // Check if the customer is in a ride (Customer.isInARide())
            const customerInfo = response.result;
            const isInRide = customerInfo.isInARide === true; 
            
            if (isInRide) {
              // If they're in a ride, create an active ride object with available info
              console.log('Customer is in an active ride');
              
              activeRideRequest = {
                id: customerInfo.rideId || Date.now().toString(),
                pickupLoc: customerInfo.pickupLoc || 'Not specified',
                dropoffLoc: customerInfo.dropoffLoc || 'Not specified',
                status: 'pending',
                timestamp: Date.now(),
                vehicleType: customerInfo.vehicleType || 'standard',
                estimatedFare: customerInfo.fare || 0
              };
              
              console.log('Found active ride:', activeRideRequest);
              resolve(activeRideRequest);
            } else {
              // No active rides
              if (activeRideRequest) {
                activeRideRequest = null;
              }
              console.log('No active rides found for customer');
              resolve(null);
            }
          } else {
            console.log('Failed to get customer info or no result in response');
            resolve(null);
          }
        }
      } catch (e) {
        console.error('Error parsing customer info response:', e);
        resolve(null);
      }
    });

    // Request customer info to check for active rides
    console.log('Requesting customer info to check for active rides');
    stompClient.publish({
      destination: '/app/customer/info',
      body: JSON.stringify({}) // No payload needed
    });
    
    // Set a timeout in case the server doesn't respond
    timeoutId = setTimeout(() => {
      try {
        subscription.unsubscribe();
      } catch (e) {
        // Subscription might already be closed
      }
      console.log('Timeout while checking for active rides');
      resolve(null);
    }, 10000);
  });
};

// Get user profile data via WebSocket
const getUserProfile = (callback, errorCallback) => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected when trying to get profile');
    if (errorCallback) errorCallback('WebSocket not connected');
    return;
  }

  // Determine the correct topic based on the current user type
  const userType = currentUser?.startsWith('driver') ? 'driver' : 'customer';
  const topic = `/user/topic/${userType}/response`;
  const destination = `/app/${userType}/info`;
  
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

  console.log(`Sending request to ${destination}`);
  // Request user info
  stompClient.publish({
    destination: destination,
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

// Check if user has an active ride request
const hasActiveRideRequest = () => {
  return !!activeRideRequest;
};

// Get active ride request details
const getActiveRideRequest = () => {
  return activeRideRequest;
};

// Clear active ride request (when ride is done or canceled)
const clearActiveRideRequest = () => {
  activeRideRequest = null;
  notifyRideStatusChange();
  return true;
};

// Disconnect WebSocket
const disconnectWebSocket = () => {
  if (stompClient && stompClient.connected) {
    // Clean up any active subscriptions
    if (window.activeSubscriptions) {
      window.activeSubscriptions.forEach(subscription => {
        try {
          subscription.unsubscribe();
        } catch (e) {
          console.error('Error unsubscribing:', e);
        }
      });
      window.activeSubscriptions = [];
    }
    
    stompClient.deactivate();
    stompClient = null;
    authToken = null;
    
    // Don't clear active ride when disconnecting, so it persists until explicitly cancelled
    // This allows remembering ride state across app restarts
    
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
            activeRideRequest = {
              ...rideDetails,
              id: response.result?.rideID || Date.now().toString(),
              status: 'pending', // pending = finding driver
              timestamp: Date.now()
            };
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

  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected when trying to cancel ride');
    return Promise.reject('WebSocket not connected');
  }

  // Save a copy of the active ride for history before cancellation
  const rideToCancel = {...activeRideRequest};

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
            // Save the cancelled ride to history
            saveCancelledRideToHistory(rideToCancel);
            
            // Clear the active ride request
            activeRideRequest = null;
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
      // Save the cancelled ride to history before clearing
      saveCancelledRideToHistory(rideToCancel);
      
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
    notifyRideStatusChange();
    throw error;
  });
};

// Function to save cancelled ride to history
const saveCancelledRideToHistory = (ride) => {
  console.log('Saving cancelled ride to history:', ride);
  
  if (!ride) return;
  
  const cancelledRide = {
    ...ride,
    id: ride.id || Date.now().toString(),
    status: 'cancelled',
    completedAt: Date.now()
  };
  
  // Save to local storage history
  AsyncStorage.getItem('RIDE_HISTORY')
    .then(historyJson => {
      let history = [];
      try {
        if (historyJson) {
          history = JSON.parse(historyJson);
          if (!Array.isArray(history)) {
            history = [];
          }
        }
      } catch (e) {
        console.error('Error parsing ride history:', e);
        history = [];
      }
      
      // Add the cancelled ride to history
      history.push(cancelledRide);
      
      // Save updated history
      return AsyncStorage.setItem('RIDE_HISTORY', JSON.stringify(history));
    })
    .then(() => {
      console.log('Cancelled ride saved to history successfully');
    })
    .catch(error => {
      console.error('Error saving cancelled ride to history:', error);
    });
};

// Format the ride data to match the UI needs
const formatRideData = (rides) => {
  return rides.map(ride => {
    console.log("Formatting ride data:", JSON.stringify(ride));
    
    // Convert timestamp to readable date
    const date = new Date(ride.timeStamp * 1000);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Extract driver name properly - try different possible formats
    let driverName = 'Not assigned';
    if (typeof ride.driver === 'object' && ride.driver !== null) {
      driverName = ride.driver.name || ride.driver.username || JSON.stringify(ride.driver);
    } else if (typeof ride.driver === 'string' && ride.driver) {
      driverName = ride.driver;
    } else if (ride.driverName) {
      driverName = ride.driverName;
    }
    
    console.log(`Ride ${ride.rideID}: Extracted driver name: ${driverName}`);
    
    // Determine ride status
    let status = 'in progress';
    if (ride.isDone === 1) {
      status = 'completed';
    } else if (ride.status === 'cancelled') {
      status = 'cancelled';
    }
    
    return {
      id: ride.rideID,
      date: formattedDate,
      customer: ride.customer,
      driver: driverName,
      status: status,
      pickupLoc: ride.pickupLoc || 'Not specified',
      dropoffLoc: ride.dropoffLoc || 'Not specified',
      vehicleType: ride.vehicleType || 'standard',
      fare: ride.fare || 0,
      timeStamp: ride.timeStamp
    };
  });
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
const getRideHistory = () => {
  // Determine user type and call appropriate function
  const isDriver = currentUser?.startsWith('driver');
  
  if (isDriver) {
    return getDriverRideHistory();
  } else {
    // Original function for customer with local storage fallback
    if (!stompClient || !stompClient.connected) {
      console.log('WebSocket not connected, using local storage for history');
      return getLocalRideHistory();
    }

    return new Promise((resolve, reject) => {
      let responded = false;
      let timeoutId;
      
      // Set timeout for server response
      timeoutId = setTimeout(() => {
        if (!responded) {
          console.log('Server response timed out, falling back to local storage');
          responded = true;
          try {
            subscription.unsubscribe();
          } catch (e) {
            // Subscription might already be closed
          }
          getLocalRideHistory()
            .then(resolve)
            .catch(() => reject('Failed to fetch ride history'));
        }
      }, 5000);
      
      // Subscribe to receive response
      const subscription = stompClient.subscribe('/user/topic/customer/response', (message) => {
        console.log('Received ride history response:', message);
        try {
          const response = JSON.parse(message.body);
          
          // Only handle responses for the ride history endpoint
          if (response.method === '/customer/ridehistory' && !responded) {
            responded = true;
            clearTimeout(timeoutId);
            
            try {
              subscription.unsubscribe();
            } catch (e) {
              console.error('Error unsubscribing from ride history response:', e);
            }
            
            if (response.status === 200) {
              // Format the ride data to match UI needs
              const serverRides = formatRideData(response.result.rides || []);
              
              // Get local history as well and merge them
              getLocalRideHistory().then(localResult => {
                const localRides = localResult.rides || [];
                
                // Combine and remove duplicates based on ID
                const allRides = [...serverRides];
                
                // Add local rides that aren't in server response
                localRides.forEach(localRide => {
                  const duplicateIndex = allRides.findIndex(r => r.id === localRide.id);
                  if (duplicateIndex === -1) {
                    allRides.push(localRide);
                  }
                });
                
                // Sort by date (newest first)
                allRides.sort((a, b) => {
                  const aTime = a.timeStamp || new Date(a.date).getTime();
                  const bTime = b.timeStamp || new Date(b.date).getTime();
                  return bTime - aTime;
                });
                
                resolve({ rides: allRides });
              }).catch(error => {
                console.error('Error merging local history:', error);
                resolve({ rides: serverRides });
              });
            } else {
              // Try local storage on server error
              getLocalRideHistory()
                .then(resolve)
                .catch(() => reject(response.result?.content || 'Failed to fetch ride history'));
            }
          }
        } catch (e) {
          if (!responded) {
            responded = true;
            clearTimeout(timeoutId);
            console.error('Error parsing response:', e);
            getLocalRideHistory()
              .then(resolve)
              .catch(() => reject('Error parsing server response'));
          }
        }
      });

      // Request ride history
      console.log('Requesting ride history');
      stompClient.publish({
        destination: '/app/customer/ridehistory',
        body: JSON.stringify({})
      });
    });
  }
};

// Get ride history from local storage
const getLocalRideHistory = () => {
  return AsyncStorage.getItem('RIDE_HISTORY')
    .then(historyJson => {
      if (!historyJson) {
        console.log('No ride history found in AsyncStorage');
        return { rides: [] };
      }
      
      try {
        console.log('Retrieved ride history data:', historyJson);
        let rides = JSON.parse(historyJson);
        
        // Ensure rides is always an array
        if (!Array.isArray(rides)) {
          console.warn('Ride history is not an array, using empty array instead');
          rides = [];
        }
        
        // Format the data to match UI expectations
        const formattedRides = rides.map((ride, index) => {
          console.log(`Processing local ride: ${JSON.stringify(ride)}`);
          
          // Ensure each ride has a unique ID
          const rideId = ride.id || ride.rideID || (Date.now() + index);
          
          // Make sure date is properly formatted
          let dateObj;
          if (ride.completedAt) {
            dateObj = new Date(ride.completedAt);
          } else if (ride.timeStamp) {
            dateObj = new Date(typeof ride.timeStamp === 'number' ? ride.timeStamp * 1000 : ride.timeStamp);
          } else {
            dateObj = new Date();
          }
          
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          
          // Ensure fare is a number and use the correct fare field
          let fare = 0;
          if (typeof ride.fare === 'number' && ride.fare > 0) {
            fare = ride.fare;
          } else if (typeof ride.estimatedFare === 'number' && ride.estimatedFare > 0) {
            fare = ride.estimatedFare;
          }
          
          // Extract driver information properly
          let driverName = 'Not assigned';
          if (typeof ride.driver === 'object' && ride.driver !== null) {
            driverName = ride.driver.name || ride.driver.username || JSON.stringify(ride.driver);
          } else if (typeof ride.driver === 'string' && ride.driver) {
            driverName = ride.driver;
          } else if (ride.driverName) {
            driverName = ride.driverName;
          }
          
          // Determine ride status (support cancelled rides)
          let status = 'completed';
          if (ride.status === 'cancelled') {
            status = 'cancelled';
          }
          
          console.log(`Formatting local ride ${rideId} with fare: ${fare}, driver: ${driverName}, status: ${status}`);
          
          return {
            id: rideId,
            date: formattedDate,
            customer: ride.customer || currentUser,
            driver: driverName,
            status: status,
            pickupLoc: ride.pickupLoc || 'Unknown pickup',
            dropoffLoc: ride.dropoffLoc || 'Unknown destination',
            vehicleType: ride.vehicleType || 'car',
            fare: fare,
            timeStamp: ride.completedAt || (typeof ride.timeStamp === 'number' ? ride.timeStamp * 1000 : ride.timeStamp) || Date.now()
          };
        });
        
        console.log(`Formatted ${formattedRides.length} ride history entries`);
        return { rides: formattedRides };
      } catch (e) {
        console.error('Error parsing local ride history:', e);
        return { rides: [] };
      }
    })
    .catch(error => {
      console.error('Error getting local ride history:', error);
      return { rides: [] };
    });
};

// Subscribe to real-time ride updates from the server
const subscribeToRealTimeUpdates = () => {
  if (!stompClient || !stompClient.connected || !currentUser) {
    console.error('Cannot subscribe to updates: WebSocket not connected');
    return;
  }
  
  // Only for customers
  if (currentUser.startsWith('driver')) {
    return;
  }
  
  console.log('Subscribing to real-time ride updates');
  
  // Subscribe to notifications topic
  const notificationSubscription = stompClient.subscribe('/user/topic/customer/notification', (message) => {
    try {
      console.log('Received notification:', message);
      const notification = JSON.parse(message.body);
      
      // Handle ride status updates
      if (notification.type === 'ride_update' && notification.rideID) {
        console.log('Ride update notification:', notification);
        
        // If this is for our active ride, update it
        if (activeRideRequest && activeRideRequest.id === notification.rideID) {
          if (notification.status === 'accepted' || notification.status === 'in_progress') {
            // Update our active ride with the driver info
            activeRideRequest = {
              ...activeRideRequest,
              status: notification.status,
              driver: notification.driver
            };
            
            // Notify subscribers
            notifyRideStatusChange();
          } else if (notification.status === 'completed') {
            // Ride is done, clear active ride
            activeRideRequest = null;
            notifyRideStatusChange();
          } else if (notification.status === 'cancelled') {
            // Ride was cancelled, clear active ride
            activeRideRequest = null;
            notifyRideStatusChange();
          }
        }
      }
    } catch (e) {
      console.error('Error handling notification:', e);
    }
  });
  
  // Save subscription to unsubscribe when disconnecting
  if (!window.activeSubscriptions) {
    window.activeSubscriptions = [];
  }
  window.activeSubscriptions.push(notificationSubscription);
  
  return notificationSubscription;
};

// Driver completes a ride
const completeRide = (rideId) => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected when trying to complete ride');
    return Promise.reject('WebSocket not connected');
  }

  if (!activeRideRequest) {
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
        
        // Only handle responses for the completeride endpoint
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
            // Clear active ride since it's completed
            activeRideRequest = null;
            
            // Persist state change to storage
            _persistRideStateToStorage();
            
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

    // Send the ride completion request
    console.log(`Sending completion request for ride ${rideId}`);
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
      reject('Server timeout while completing ride');
    }, 10000);
  }).then(result => {
    // Notify subscribers of ride status change
    notifyRideStatusChange();
    return result;
  });
};

// Customer completes a ride (frontend only implementation)
const customerCompleteRide = (rideId) => {
  if (!activeRideRequest) {
    console.error('No active ride to complete');
    return Promise.reject('No active ride to complete');
  }

  return new Promise((resolve, reject) => {
    try {
      console.log(`Customer completing ride ${rideId}`, activeRideRequest);
      
      // Determine the correct fare value
      let rideCompleteTime = new Date().getTime();
      let fare = 0;
      
      // Try different fare sources
      if (typeof activeRideRequest.fare === 'number' && activeRideRequest.fare > 0) {
        console.log('Using activeRideRequest.fare:', activeRideRequest.fare);
        fare = activeRideRequest.fare;
      } else if (typeof activeRideRequest.estimatedFare === 'number' && activeRideRequest.estimatedFare > 0) {
        console.log('Using activeRideRequest.estimatedFare:', activeRideRequest.estimatedFare);
        fare = activeRideRequest.estimatedFare;
      } else {
        // If all else fails, generate a reasonable fare
        const pickupLoc = activeRideRequest.pickupLoc || '';
        const dropoffLoc = activeRideRequest.dropoffLoc || '';
        const randomDistance = Math.floor(Math.random() * 10) + 5; // 5-15 km
        fare = randomDistance * 2000; // 2000 VND per km
        console.log('Generated fare based on distance:', fare);
      }
      
      // Create a completed ride record with proper fare
      const completedRide = {
        ...activeRideRequest,
        id: rideId || activeRideRequest.id,
        isDone: 1,
        status: 'completed',
        completedAt: rideCompleteTime,
        fare: fare,
        timeStamp: activeRideRequest.timestamp || Math.floor(rideCompleteTime / 1000)
      };
      
      console.log('Created completed ride record:', JSON.stringify(completedRide));
      
      // Save completed ride to local storage for history
      AsyncStorage.getItem('RIDE_HISTORY')
        .then(historyJson => {
          let history = [];
          try {
            if (historyJson) {
              history = JSON.parse(historyJson);
              if (!Array.isArray(history)) {
                console.log('History was not an array, resetting');
                history = [];
              }
            }
          } catch (e) {
            console.error('Error parsing ride history:', e);
            history = [];
          }
          
          // Add the completed ride to history
          history.push(completedRide);
          
          console.log(`Saving history with ${history.length} rides`);
          
          // Save updated history
          return AsyncStorage.setItem('RIDE_HISTORY', JSON.stringify(history));
        })
        .then(() => {
          console.log('Ride saved to history successfully');
          
          // Clear active ride since it's completed
          activeRideRequest = null;
          
          // Persist state change to storage
          try {
            AsyncStorage.removeItem('ACTIVE_RIDE')
              .catch(error => console.error('Error removing active ride from storage:', error));
          } catch (e) {
            console.error('Error persisting ride state:', e);
          }
          
          // Notify subscribers of ride status change
          notifyRideStatusChange();
          
          resolve(completedRide);
        })
        .catch(error => {
          console.error('Error saving ride to history:', error);
          reject('Failed to save ride to history');
        });
    } catch (e) {
      console.error('Error completing ride:', e);
      reject('Error completing ride');
    }
  });
};

export {
  api,
  connectWebSocket,
  getUserProfile,
  disconnectWebSocket,
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
  completeRide,
  customerCompleteRide
};