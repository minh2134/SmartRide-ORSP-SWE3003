import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';

const Header = ({ title, rightButton }) => {
  const navigation = useNavigation();

  // Implement Header Display on each screen
  const handleHeaderDisplay = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.logoContainer}
        onPress={handleHeaderDisplay}
      >
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {rightButton ? (
        <TouchableOpacity 
          style={styles.rightButtonContainer}
          onPress={rightButton.onPress}
        >
          <Icon name={rightButton.icon} size={20} color="#333" />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightButtonPlaceholder} />
      )}
    </View>
  );
};

export default Header; 