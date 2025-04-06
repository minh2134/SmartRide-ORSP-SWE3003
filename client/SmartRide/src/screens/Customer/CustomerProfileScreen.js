import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getUserProfile } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles';

const CustomerProfileScreen = () => {
  const { user } = useAuth();
  
  // Profile state with default values
  const [profile, setProfile] = useState({
    fullName: 'Customer User',
    dateOfBirth: '25 years old',
    phoneNumber: '+1 (555) 123-4567',
    email: 'customer@smartride.com'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

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
  const renderProfileField = (label, field, icon) => {
    const isEditing = editingField === field;
    
    return (
      <View style={styles.infoRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={icon} size={20} color="#000000" style={{ marginRight: 10 }} />
          <Text style={styles.infoLabel}>{label}</Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {isEditing ? (
            <TextInput
              style={[styles.infoValue, { borderBottomWidth: 1, borderBottomColor: '#000000', paddingBottom: 2, minWidth: 150 }]}
              value={tempValue}
              onChangeText={setTempValue}
              autoFocus
            />
          ) : (
            <Text style={styles.infoValue}>{profile[field]}</Text>
          )}
          
          {isEditing ? (
            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
              <TouchableOpacity onPress={handleSave} style={{ padding: 5 }}>
                <Icon name="check" size={18} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={{ padding: 5, marginLeft: 5 }}>
                <Icon name="close" size={18} color="#000000" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => handleEditPress(field)} style={{ marginLeft: 10 }}>
              <Icon name="edit" size={16} color="#000000" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      
      <View style={styles.scrollContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="error" size={60} color="#000000" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => setIsLoading(true)}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.profileContainer}>
              <FontAwesome name="user-circle-o" size={80} color="#000000" />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.fullName}</Text>
                <Text style={styles.profileDetail}>Customer Account</Text>
              </View>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.infoCard}>
                {renderProfileField('Full Name', 'fullName', 'person')}
                {renderProfileField('Age', 'dateOfBirth', 'cake')}
                {renderProfileField('Phone', 'phoneNumber', 'phone')}
                {renderProfileField('Email', 'email', 'email')}
              </View>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="notifications" size={24} color="#000000" />
                <Text style={styles.actionButtonText}>Notification Preferences</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="lock" size={24} color="#000000" />
                <Text style={styles.actionButtonText}>Change Password</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="credit-card" size={24} color="#000000" />
                <Text style={styles.actionButtonText}>Payment Methods</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomerProfileScreen; 