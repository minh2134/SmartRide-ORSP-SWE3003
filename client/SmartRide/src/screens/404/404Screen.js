import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Header from '../../components/Header/Header';
import styles from './styles';

const NotFoundScreen = ({ navigation }) => {
  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Social Media" />
      
      <View style={styles.content}>
        <Text style={styles.message}>
          NOTHING TO BE FOUND HERE HOMIE!
        </Text>
        <Text style={styles.subMessage}>
          We don't talk to our customers.{"\n"}No social media = no feedback = happy management team :)
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleBackToLogin}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NotFoundScreen; 