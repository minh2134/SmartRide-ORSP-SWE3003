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