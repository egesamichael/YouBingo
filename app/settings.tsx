import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [soundOn, setSoundOn] = useState<boolean>(false);
  const [musicOn, setMusicOn] = useState<boolean>(false);

  // Load settings from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const soundSetting = await AsyncStorage.getItem('soundOn');
        const musicSetting = await AsyncStorage.getItem('musicOn');
        if (soundSetting !== null) {
          setSoundOn(JSON.parse(soundSetting));
        }
        if (musicSetting !== null) {
          setMusicOn(JSON.parse(musicSetting));
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };

    loadSettings();
  }, []);

  // Toggle sound setting and save it to AsyncStorage
  const toggleSound = async () => {
    try {
      const newSoundSetting = !soundOn;
      setSoundOn(newSoundSetting);
      await AsyncStorage.setItem('soundOn', JSON.stringify(newSoundSetting));
    } catch (error) {
      console.error('Failed to save sound setting', error);
    }
  };

  // Toggle music setting and save it to AsyncStorage
  const toggleMusic = async () => {
    try {
      const newMusicSetting = !musicOn;
      setMusicOn(newMusicSetting);
      await AsyncStorage.setItem('musicOn', JSON.stringify(newMusicSetting));
    } catch (error) {
      console.error('Failed to save music setting', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/gameplay.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Settings</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: soundOn ? '#1E90FF' : '#FF4500' },
              ]}
              onPress={toggleSound}
            >
              {soundOn ? (
                <Entypo name="sound" size={24} color="white" />
              ) : (
                <Entypo name="sound-mute" size={24} color="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: musicOn ? '#1E90FF' : '#FF4500' },
              ]}
              onPress={toggleMusic}
            >
              {musicOn ? (
                <MaterialCommunityIcons name="music-note" size={24} color="white" />
              ) : (
                <MaterialCommunityIcons name="music-note-off" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Game level</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push('./themescreen')}
          >
            <Text style={styles.optionText}>Themes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionButton, styles.supportButton]}>
            <Text style={styles.optionText}>Support</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D87FD2',
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#862D91',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  optionButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    width: '100%',
  },
  supportButton: {
    backgroundColor: '#32CD32',
  },
  optionText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  card: {
    width: '90%',
    height: '40%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});