import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function CustomSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.switchButton, isOn ? styles.on : styles.off]}
        onPress={() => setIsOn(!isOn)}
      >
        {isOn ? (
          <MaterialIcons name="music-note" size={24} color="white" />
        ) : (
          <FontAwesome name="volume-off" size={24} color="white" />
        )}
        <Text style={styles.switchText}>{isOn ? 'On' : 'Off'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  on: {
    backgroundColor: '#8CC63E', // Green color when on
  },
  off: {
    backgroundColor: '#A52A2A', // Brownish color when off
  },
  switchText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
