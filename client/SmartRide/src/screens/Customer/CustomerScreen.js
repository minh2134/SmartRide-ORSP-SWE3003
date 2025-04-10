import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import { getUserProfile, getFareInfo } from '../../services/api';

const CustomerScreen = ({ navigation }) => {
  const { user, userType, stompClient, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [fareInfo, setFareInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load user data on initial render and when WebSocket connection changes
  useEffect(() => {
    loadData();
  }, [stompClient]);

  const loadData = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Always try to load fare information via REST API
      try {
        const fare = await getFareInfo();
        setFareInfo(fare);
      } catch (fareError) {
        console.error('Error fetching fare info:', fareError);
        // Don't set an error, we'll show what we can
      }

      // Load user profile if WebSocket is connected
      if (stompClient && stompClient.connected) {
        getUserProfile(
          stompClient,
          (profileData) => {
            setProfile(profileData);
            setIsLoading(false);
          },
          (profileError) => {
            console.error('Error fetching profile:', profileError);
            setError('Could not load your profile data. Please try again.');
            setIsLoading(false);
          }
        );
      } else {
        // No WebSocket connection
        setProfile({
          username: user?.username,
          limitedMode: true
        });
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Error in loadData:', e);
      setError('Failed to load your data. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSignOut = () => {
    signOut()
      .then(() => {
        console.log('Signed out successfully');
        // Navigation is handled by the AuthNavigator via isAuthenticated state
      })
      .catch(error => {
        console.error('Error signing out:', error);
        Alert.alert('Error', 'Failed to sign out. Please try again.');
      });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Icon name="error" size={60} color="#000000" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderProfile = () => {
    if (!profile) return null;

    if (profile.limitedMode) {
      return (
        <View style={styles.profileContainer}>
          <FontAwesome name="user-circle-o" size={80} color="#000000" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.username}</Text>
            <Text style={styles.profileDetail}>
              Customer
            </Text>
          </View>
        </View>
      );
    }
<<<<<<< Updated upstream
=======
  };

  // Function to handle ride cancellation
  const handleCancelRide = () => {
    Alert.alert(
      "Cancel Ride",
      "Are you sure you want to cancel your current ride request?",
      [
        { 
          text: "No", 
          style: "cancel" 
        },
        { 
          text: "Yes", 
          onPress: () => {
            setIsSubmitting(true);
            
            // Check if the active ride belongs to current user
            const currentUsername = getCurrentUser();
            if (!currentUsername) {
              // User may have logged out and back in, handle gracefully
              setActiveRide(null);
              clearActiveRideRequest(); // Clear any stale requests
              setIsSubmitting(false);
              Alert.alert("Ride Cancelled", "Your ride request has been reset.");
              return;
            }
            
            // Send cancellation request
            cancelRideRequest()
              .then(() => {
                setActiveRide(null);
                Alert.alert("Ride Cancelled", "Your ride request has been cancelled successfully.");
                setIsSubmitting(false);
              })
              .catch(error => {
                console.error('Cancel ride error:', error);
                setIsSubmitting(false);
                
                // Handle specific error cases
                if (typeof error === 'string' && error.includes('timeout')) {
                  // Handle the known server bug with driver being null during cancellation
                  setActiveRide(null);
                  clearActiveRideRequest();
                  Alert.alert(
                    "Ride Cancelled Locally",
                    "The server did not respond (likely due to a known server bug), but your ride has been cleared locally.",
                    [{ text: "OK" }]
                  );
                } else if (typeof error === 'string' && error.includes('Not in a ride')) {
                  // The server reported that there is no active ride for this user
                  setActiveRide(null);
                  clearActiveRideRequest();
                  Alert.alert("No Active Ride", "You don't currently have an active ride to cancel.");
                } else {
                  // For other errors, give option to clear locally
                  Alert.alert(
                    "Cancel Ride Error",
                    "Failed to cancel ride on server. Would you like to clear it locally?",
                    [
                      {
                        text: "No",
                        style: "cancel"
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          setActiveRide(null);
                          clearActiveRideRequest();
                          Alert.alert("Ride Cleared", "Your ride request has been cleared locally.");
                        }
                      }
                    ]
                  );
                }
              });
          } 
        }
      ]
    );
  };

  // Render the active ride card
  const renderActiveRideCard = () => {
    if (!activeRide) return null;

    // Determine ride status display text
    let statusText = 'Finding Driver';
    let statusColor = '#FF9900';
    let statusBgColor = '#FFF7E6';
    let statusBorderColor = '#FFD166';
    
    if (activeRide.driver) {
      if (activeRide.status === 'in_progress' || activeRide.status === 'accepted') {
        statusText = 'In Progress';
        statusColor = '#00AA55';
        statusBgColor = '#E6FFF0';
        statusBorderColor = '#99EEBB';
      } else if (activeRide.status === 'completed') {
        statusText = 'Completed';
        statusColor = '#007BFF';
        statusBgColor = '#E6F4FF';
        statusBorderColor = '#99CCFF';
      }
    }
>>>>>>> Stashed changes

    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <FontAwesome name="user-circle-o" size={80} color="#000000" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name || profile.username}</Text>
            {profile.email && <Text style={styles.profileDetail}>{profile.email}</Text>}
            {profile.phoneNumber && <Text style={styles.profileDetail}>{profile.phoneNumber}</Text>}
          </View>
        </View>

<<<<<<< Updated upstream
        {profile.rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rating:</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map(star => (
                <Icon 
                  key={star}
                  name="star" 
                  size={24} 
                  color={star <= Math.round(profile.rating) ? "#000000" : "#D3D3D3"} 
                />
              ))}
=======
        <View style={styles.activeRideDetails}>
          <View style={styles.activeRideItem}>
            <Icon name="map-pin" size={18} color={colors.primary} />
            <Text style={styles.activeRideItemText}>{activeRide.pickupLoc}</Text>
          </View>
          
          <View style={styles.activeRideItem}>
            <Icon name="flag" size={18} color="red" />
            <Text style={styles.activeRideItemText}>{activeRide.dropoffLoc}</Text>
          </View>
          
          <View style={styles.activeRideItem}>
            <Icon name="truck" size={18} color={colors.text} />
            <Text style={styles.activeRideItemText}>
              {vehicleOptions.find(v => v.id === activeRide.vehicleType)?.name || activeRide.vehicleType}
            </Text>
          </View>
          
          <View style={styles.activeRideItem}>
            <Icon name="credit-card" size={18} color={colors.text} />
            <Text style={styles.activeRideItemText}>
              {paymentMethods.find(p => p.id === activeRide.paymentMethod)?.name || activeRide.paymentMethod}
            </Text>
          </View>
          
          {activeRide.driver && (
            <View style={styles.activeRideDriverSection}>
              <Text style={styles.activeRideDriverTitle}>Driver Information</Text>
              
              <View style={styles.activeRideItem}>
                <Icon name="user" size={18} color={colors.primary} />
                <Text style={styles.activeRideItemText}>
                  {activeRide.driver.name || activeRide.driver}
                </Text>
              </View>
              
              {activeRide.driver.phone && (
                <View style={styles.activeRideItem}>
                  <Icon name="phone" size={18} color={colors.primary} />
                  <Text style={styles.activeRideItemText}>
                    {activeRide.driver.phone}
                  </Text>
                </View>
              )}
              
              {activeRide.status === 'completed' && (
                <View style={styles.completedMessage}>
                  <Icon name="check-circle" size={20} color="#00AA55" />
                  <Text style={styles.completedMessageText}>
                    This ride has been completed
                  </Text>
                </View>
              )}
>>>>>>> Stashed changes
            </View>
            <Text style={styles.ratingValue}>{profile.rating}</Text>
          </View>
        )}

        {profile.tripCount !== undefined && (
          <View style={styles.statContainer}>
            <Text style={styles.statLabel}>Total Trips:</Text>
            <Text style={styles.statValue}>{profile.tripCount}</Text>
          </View>
        )}
        
        {/* Show the "Request New Ride" button if the current ride is completed */}
        {activeRide.status === 'completed' && (
          <TouchableOpacity 
            style={styles.newRideButton}
            onPress={() => {
              setActiveRide(null);
              clearActiveRideRequest();
            }}
          >
            <Text style={styles.newRideButtonText}>Request New Ride</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Icon name="logout" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        {renderProfile()}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Fare Information</Text>
          
          {fareInfo ? (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Base Fare:</Text>
                <Text style={styles.infoValue}>
                  {fareInfo.currency || '$'} {fareInfo.baseFare?.toFixed(2) || fareInfo.fare?.toFixed(2) || '5.00'}
                </Text>
              </View>

              {fareInfo.perKilometerRate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Per Kilometer:</Text>
                  <Text style={styles.infoValue}>
                    {fareInfo.currency || '$'} {fareInfo.perKilometerRate.toFixed(2)}
                  </Text>
                </View>
              )}

              {fareInfo.cancellationFee && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cancellation Fee:</Text>
                  <Text style={styles.infoValue}>
                    {fareInfo.currency || '$'} {fareInfo.cancellationFee.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.noInfoText}>Fare information not available</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Book Ride', 'This feature is under development.')}
          >
            <Icon name="local-taxi" size={24} color="#000000" />
            <Text style={styles.actionButtonText}>Book a Ride</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Support', 'Contact customer support at support@smartride.com')}
          >
            <Icon name="support-agent" size={24} color="#000000" />
            <Text style={styles.actionButtonText}>Customer Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerScreen; 