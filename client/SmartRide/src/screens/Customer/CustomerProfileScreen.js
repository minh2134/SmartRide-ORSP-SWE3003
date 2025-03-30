import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import Header from '../../components/Header/Header';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../../theme/colors';
import styles from './styles';

// Use to display customer profile information
const CustomerProfileScreen = () => {
  // Initial profile data
  const [profile, setProfile] = useState({
    fullName: 'Lil Peter',
    dateOfBirth: '21/12/2012',
    phoneNumber: '0999 999 999',
    email: 'email@mail.com'
  });

  // Track which field is currently being edited
  const [editingField, setEditingField] = useState(null);
  
  // Hold temporary input value while editing
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      
      <View style={styles.profileContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <Icon name="user" size={60} color={colors.background} />
          </View>
          <Text style={styles.profileTitle}>Customer Profile</Text>
        </View>
        
        <View style={styles.profileCard}>
          {renderProfileField('Full Name', 'fullName')}
          {renderProfileField('Date of Birth', 'dateOfBirth')}
          {renderProfileField('Phone Number', 'phoneNumber')}
          {renderProfileField('Email', 'email')}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomerProfileScreen; 