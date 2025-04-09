import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../components/Header/Header';
import Icon from 'react-native-vector-icons/Feather';
import { getUserProfile } from '../../services/api';
import colors from '../../theme/colors';
import styles from './styles';

const DriverProfileScreen = () => {
  const route = useRoute();
  const { username, isAuthenticated } = route.params || {};
  
  // Profile state with default values
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    phone: '',
    sex: '',
    license: '',
    username: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  // Fetch user profile data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const fetchUserProfile = () => {
    setIsLoading(true);
    setError('');
    
    getUserProfile((userInfo) => {
      if (userInfo) {
        // Map fields directly from the server response to match data.sql structure
        setProfile({
          name: userInfo.name || '',
          age: userInfo.age ? `${userInfo.age}` : '',
          phone: userInfo.phone || '',
          sex: userInfo.sex || '',
          license: userInfo.license || '',
          username: userInfo.username || ''
        });
      }
      setIsLoading(false);
    }, (errorMsg) => {
      setError(errorMsg || 'Failed to load profile');
      setIsLoading(false);
    });
    
    // Handle timeout
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError('Failed to load profile. Please try again.');
      }
    }, 5000);
  };

  // Function to handle edit icon press
  const handleEditPress = (field) => {
    setEditingField(field);
    setTempValue(profile[field]);
  };

  // Function to save edited value
  const handleSave = () => {
    if (editingField) {
      setProfile({
        ...profile,
        [editingField]: tempValue
      });
      setEditingField(null);
      // Here you would typically send the updated profile to the backend
    }
  };

  // Function to cancel editing
  const handleCancel = () => {
    setEditingField(null);
  };

  // Render a profile field (either in view or edit mode)
  const renderProfileField = (label, field) => {
    const isEditing = editingField === field;
    
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        
        <View style={styles.fieldValueContainer}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempValue}
              onChangeText={setTempValue}
              autoFocus
            />
          ) : (
            <Text style={styles.fieldValue}>{profile[field]}</Text>
          )}
          
          {isEditing ? (
            <View style={styles.editActionsContainer}>
              <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
                <Icon name="check" size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.actionButton}>
                <Icon name="x" size={18} color="red" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => handleEditPress(field)} style={styles.editButton}>
              <Icon name="edit-2" size={18} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Profile" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      
      <View style={styles.profileContent}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.profileHeader}>
              <View style={styles.avatarPlaceholder}>
                <Icon name="user" size={60} color={colors.background} />
              </View>
              <Text style={styles.profileTitle}>Driver Profile</Text>
              <Text style={styles.username}>@{profile.username}</Text>
            </View>
            
            <View style={styles.profileCard}>
              {renderProfileField('Name', 'name')}
              {renderProfileField('Age', 'age')}
              {renderProfileField('Phone', 'phone')}
              {renderProfileField('Gender', 'sex')}
              {renderProfileField('License', 'license')}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DriverProfileScreen; 