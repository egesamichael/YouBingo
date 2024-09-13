import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useState } from 'react';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [soundOn, setSoundOn] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [bingoMode, setBingoMode] = useState('Classic Bingo');

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
              onPress={() => setSoundOn(!soundOn)}
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
              onPress={() => setMusicOn(!musicOn)}
            >
              {musicOn ? (
                <MaterialCommunityIcons name="music-note" size={24} color="white" />
              ) : (
                <MaterialCommunityIcons name="music-note-off" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Invite</Text>
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
    backgroundColor: '#D87FD2', // Pinkish background
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