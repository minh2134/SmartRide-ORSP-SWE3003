import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';


// Use for customer and driver tabs
const TabSelector = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'customer' && styles.activeTab
        ]}
        onPress={() => onTabChange('customer')}
      >
        <Text 
          style={[
            styles.tabText,
            activeTab === 'customer' && styles.activeTabText
          ]}
        >
          Customer
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'driver' && styles.activeTab
        ]}
        onPress={() => onTabChange('driver')}
      >
        <Text 
          style={[
            styles.tabText,
            activeTab === 'driver' && styles.activeTabText
          ]}
        >
          Driver
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabSelector; 