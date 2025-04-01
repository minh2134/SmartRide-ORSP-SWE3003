import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

// Use to display social media links and "copyright" *blink blink* :3
const SocialFooter = () => {
  const navigation = useNavigation();

  const handleSocialPress = () => {
    navigation.navigate('NotFound');
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerContent}>
        <Text style={styles.footerText}>© 2025 SmartRide</Text>
        
        <View style={styles.iconsContainer}>
          <TouchableOpacity 
            style={styles.socialIcon}
            onPress={handleSocialPress}
          >
            <Text style={styles.iconText}>f</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialIcon}
            onPress={handleSocialPress}
          >
            <Text style={styles.iconText}>in</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialIcon}
            onPress={handleSocialPress}
          >
            <Text style={styles.iconText}>t</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.socialIcon}
            onPress={handleSocialPress}
          >
            <Text style={styles.iconText}>ig</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SocialFooter; 