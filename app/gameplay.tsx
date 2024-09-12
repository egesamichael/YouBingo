import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Function to generate Bingo numbers based on selected mode
const generateBingoNumbers = (mode: string) => {
  switch (mode) {
    case 'Four Corners':
      return [1, 5, 21, 25];
    case 'Full Card':
      return Array.from({ length: 25 }, (_, i) => i + 1);
    case 'Classic Bingo':
      return Array.from({ length: 25 }, (_, i) => i + 1); // Adjust based on classic bingo rules
    default:
      return Array.from({ length: 25 }, (_, i) => i + 1);
  }
};

// Function to generate winning numbers based on mode
const generateWinningNumbers = (mode: string) => {
  const winningNumbers: number[] = [];

  switch (mode) {
    case 'Four Corners':
      return [1, 5, 21, 25];
    case 'Full Card':
      return Array.from({ length: 25 }, (_, i) => i + 1);
    case 'Classic Bingo':
      // Generate a random set of winning numbers (e.g., 5 numbers for Classic Bingo)
      while (winningNumbers.length < 5) {
        const num = Math.floor(Math.random() * 25) + 1;
        if (!winningNumbers.includes(num)) {
          winningNumbers.push(num);
        }
      }
      return winningNumbers;
    default:
      return Array.from({ length: 25 }, (_, i) => i + 1);
  }
};

// Function to check if the selected numbers meet the Bingo criteria
const checkForBingo = (markedNumbers: boolean[], winningNumbers: number[]): boolean => {
  return winningNumbers.every(num => markedNumbers[num - 1]);
};

// BingoCard component to render Bingo numbers and handle selections
const BingoCard = ({ mode, markedNumbers, setMarkedNumbers, selectionCount, setSelectionCount }: 
  { mode: string, markedNumbers: boolean[], setMarkedNumbers: (marked: boolean[]) => void, selectionCount: number, setSelectionCount: (count: number) => void }) => {
  
  const maxSelections = mode === 'Full Card' ? 25 : 5;
  const numbers = generateBingoNumbers(mode);
  const winningNumbers = generateWinningNumbers(mode);

  const handlePress = (index: number) => {
    const newMarkedNumbers = [...markedNumbers];
    const isSelected = newMarkedNumbers[index];
    
    if (isSelected) {
      newMarkedNumbers[index] = false;
      setSelectionCount(selectionCount - 1);
    } else if (selectionCount < maxSelections) {
      newMarkedNumbers[index] = true;
      setSelectionCount(selectionCount + 1);
    } else {
      Alert.alert('Selection Limit Reached', `You can only select up to ${maxSelections} numbers.`);
    }
    
    setMarkedNumbers(newMarkedNumbers);

    if (checkForBingo(newMarkedNumbers, winningNumbers)) {
      Alert.alert('Congratulations!', 'You have Bingo!', [
        { text: 'OK', onPress: () => console.log('Bingo acknowledged') },
      ]);
    }
  };

  return (
    <View style={styles.grid}>
      {numbers.map((number, index) => (
        <TouchableOpacity
          key={number}
          style={[styles.cell, markedNumbers[index] && styles.cellMarked]}
          onPress={() => handlePress(index)}
        >
          <Text style={styles.number}>{number}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function Gameplay() {
  const [bingoMode, setBingoMode] = useState<string>('Classic Bingo');
  const [markedNumbers, setMarkedNumbers] = useState<boolean[]>(new Array(25).fill(false));
  const [selectionCount, setSelectionCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const mode = await AsyncStorage.getItem('bingoMode');
        if (mode) {
          setBingoMode(mode);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const resetGame = () => {
    setMarkedNumbers(new Array(25).fill(false));
    setSelectionCount(0);
  };

  return (
    <ImageBackground
      source={require('../assets/images/gameplay.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.settingsIcon} onPress={() => router.push('./settings')}>
          <Image
            source={require('../assets/images/settings.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <BingoCard 
          mode={bingoMode} 
          markedNumbers={markedNumbers} 
          setMarkedNumbers={setMarkedNumbers} 
          selectionCount={selectionCount} 
          setSelectionCount={setSelectionCount} 
        />
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>Reset Game</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  settingsIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cell: {
    width: 60,
    height: 60,
    backgroundColor: '#ffeb3b',
    borderColor: '#ff9800',
    borderWidth: 2,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  cellMarked: {
    backgroundColor: '#d32f2f',
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  resetButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  resetButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});