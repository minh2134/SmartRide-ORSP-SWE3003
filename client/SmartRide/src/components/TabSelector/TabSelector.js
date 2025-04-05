import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';


// Use for customer and driver tabs
const TabSelector = ({ activeTab, onTabChange }) => {
  // Create a single animated value for the sliding indicator
  const [animation] = React.useState(new Animated.Value(activeTab === 'customer' ? 0 : 1));

  React.useEffect(() => {
    // Animate the tab indicator when activeTab changes
    Animated.timing(animation, {
      toValue: activeTab === 'customer' ? 0 : 1,
      duration: 300,
      useNativeDriver: false, // We're animating layout properties
    }).start();
  }, [activeTab]);

  // Interpolate the animated value to translate the indicator
  const indicatorTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.indicator, 
          { 
            transform: [{ translateX: indicatorTranslate }],
            width: '50%' 
          }
        ]} 
      />
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'customer' && styles.activeTab]}
        onPress={() => onTabChange('customer')}
      >
        <Icon 
          name="users" 
          size={16} 
          color={activeTab === 'customer' ? '#4F6AFF' : '#6B7280'} 
          style={styles.tabIcon}
        />
        <Text style={[
          styles.tabText, 
          activeTab === 'customer' && styles.activeTabText
        ]}>
          Customer
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'driver' && styles.activeTab]}
        onPress={() => onTabChange('driver')}
      >
        <Icon 
          name="truck" 
          size={16} 
          color={activeTab === 'driver' ? '#4F6AFF' : '#6B7280'} 
          style={styles.tabIcon}
        />
        <Text style={[
          styles.tabText, 
          activeTab === 'driver' && styles.activeTabText
        ]}>
          Driver
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabSelector; 