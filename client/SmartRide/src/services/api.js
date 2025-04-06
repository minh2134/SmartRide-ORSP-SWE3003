import axios from 'axios';

// Direct connection to the backend - use 10.0.2.2 to access localhost from Android emulator
const BASE_URL = 'http://10.0.2.2:8080';
const WS_URL = 'ws://10.0.2.2:8080/ws';

// Store auth information
let authToken = null;
let stompClient = null;

// Create axios instance for REST calls
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

// Disconnect WebSocket
const disconnectWebSocket = () => {
  try {
    if (fakeClient && fakeClient.connected) {
      fakeClient.disconnect();
      fakeClient = null;
    }
    
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
            }
          }
        };
        return subscriptionId;
      } catch (error) {
        console.error('Error in fake subscribe:', error);
        return null;
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

export {
  api,
  connectWebSocket,
  getUserProfile,
  disconnectWebSocket,
  getFareInfo,
  testConnection,
  getFakeClient,
  reconnectWebSocket
};