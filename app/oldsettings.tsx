import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [bingoMode, setBingoMode] = useState('Classic Bingo');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedMode = await AsyncStorage.getItem('bingoMode');
        if (storedMode) {
          setBingoMode(storedMode);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (mode: string) => {
    try {
      await AsyncStorage.setItem('bingoMode', mode);
      setBingoMode(mode);
      Alert.alert('Settings Saved', `Bingo mode set to ${mode}`);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Select Bingo Mode:</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSave('Classic Bingo')}
      >
        <Text style={styles.buttonText}>Classic Bingo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSave('Four Corners')}
      >
        <Text style={styles.buttonText}>Four Corners</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSave('Full Card')}
      >
        <Text style={styles.buttonText}>Full Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});