import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const Header = ({ title }) => {
  const navigation = useNavigation();

  // Function renamed from handleLogoPress to handleHeaderDisplay
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
      
      <TouchableOpacity style={styles.themeToggle}>
        <Text style={styles.themeIcon}>☀️</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header; 