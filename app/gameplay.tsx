import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import InlineAd from './InlineAd';


const generateBingoNumbers = (mode: string) => {
  switch (mode) {
    case 'Four Corners':
      return [1, 5, 21, 25];
    case 'Full Card':
      return Array.from({ length: 25 }, (_, i) => i + 1);
    case 'Classic Bingo':
      return Array.from({ length: 25 }, (_, i) => i + 1);
    default:
      return Array.from({ length: 25 }, (_, i) => i + 1);
  }
};

const generateWinningNumbers = (mode: string) => {
  const winningNumbers: number[] = [];

  switch (mode) {
    case 'Four Corners':
      return [1, 5, 21, 25];
    case 'Full Card':
      return Array.from({ length: 25 }, (_, i) => i + 1);
    case 'Classic Bingo':
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

const checkForBingo = (markedNumbers: boolean[], winningNumbers: number[]): boolean => {
  return winningNumbers.every(num => markedNumbers[num - 1]);
};

const BingoCard = ({
  mode,
  markedNumbers,
  setMarkedNumbers,
  selectionCount,
  setSelectionCount,
  winningNumbers,
  revealWinningNumbers,
  onNumberSelect,
}: {
  mode: string;
  markedNumbers: boolean[];
  setMarkedNumbers: (marked: boolean[]) => void;
  selectionCount: number;
  setSelectionCount: (count: number) => void;
  winningNumbers: number[];
  revealWinningNumbers: boolean;
  onNumberSelect: (index: number) => void;
}) => {
  const maxSelections = mode === 'Full Card' ? 25 : 5;
  const numbers = generateBingoNumbers(mode);

  const handlePress = (index: number) => {
    if (selectionCount < maxSelections || markedNumbers[index]) {
      onNumberSelect(index);
    } else {
      Alert.alert('Selection Limit Reached', `You can only select up to ${maxSelections} numbers.`);
    }
  };

  return (
    <View style={styles.grid}>
      {numbers.map((number, index) => {
        const isWinning = revealWinningNumbers && winningNumbers.includes(number);
        const cellStyle = [
          styles.cell,
          markedNumbers[index] && styles.cellMarked,
          isWinning && styles.cellWinning,
        ];

        return (
          <TouchableOpacity
            key={number}
            style={cellStyle}
            onPress={() => handlePress(index)}
          >
            <Text style={styles.number}>{number}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function Gameplay() {
  const [bingoMode, setBingoMode] = useState<string>('Classic Bingo');
  const [markedNumbers, setMarkedNumbers] = useState<boolean[]>(new Array(25).fill(false));
  const [selectionCount, setSelectionCount] = useState<number>(0);
  const [winningNumbers, setWinningNumbers] = useState<number[]>(generateWinningNumbers('Classic Bingo'));
  const [revealWinningNumbers, setRevealWinningNumbers] = useState<boolean>(false);
  const router = useRouter();
  const [selectSound, setSelectSound] = useState<Audio.Sound | null>(null);
  const [backgroundSound, setBackgroundSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const mode = await AsyncStorage.getItem('bingoMode');
        if (mode) {
          setBingoMode(mode);
          setWinningNumbers(generateWinningNumbers(mode));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();

    const playBackgroundMusic = async () => {
      try {

  

      ///
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/music/gameplay.mp3'),
          {
            shouldPlay: true,
            isLooping: true,
          }
        );
        setBackgroundSound(newSound);
        console.log('Playing background music');
        await newSound.playAsync();
      } catch (error) {
        console.error('Error playing background music:', error);
      }
    };

    const loadSelectSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/music/select.wav')
        );
        setSelectSound(newSound);
        console.log('Select sound loaded');
      } catch (error) {
        console.error('Error loading select sound:', error);
      }
    };

    playBackgroundMusic();
    loadSelectSound();

    return () => {
      if (backgroundSound) {
        backgroundSound.unloadAsync();
      }
      if (selectSound) {
        selectSound.unloadAsync();
      }
    };
  }, []);

  const handleNumberSelect = async (index: number) => {
    console.log(`Number selected: ${index}`);
    const newMarkedNumbers = [...markedNumbers];
    const isSelected = newMarkedNumbers[index];

    if (isSelected) {
      newMarkedNumbers[index] = false;
      setSelectionCount(selectionCount - 1);
    } else if (selectionCount < 5) {
      newMarkedNumbers[index] = true;
      setSelectionCount(selectionCount + 1);
    }

    setMarkedNumbers(newMarkedNumbers);

    if (selectSound) {
      try {
        await selectSound.stopAsync();
        await selectSound.setPositionAsync(0);
        await selectSound.playAsync();
        console.log('Playing select sound');
      } catch (error) {
        console.error('Error playing select sound:', error);
      }
    } else {
      console.log('Select sound not loaded');
    }
  };

  const resetGame = () => {
    setMarkedNumbers(new Array(25).fill(false));
    setSelectionCount(0);
    setWinningNumbers(generateWinningNumbers(bingoMode));
    setRevealWinningNumbers(false);
    console.log('Game reset');
  };

  const checkWinningNumbers = () => {
    setRevealWinningNumbers(true);
    if (checkForBingo(markedNumbers, winningNumbers)) {
      Alert.alert('Congratulations!', 'You have Bingo!', [
        { text: 'OK', onPress: () => console.log('Bingo acknowledged') },
      ]);
    } else {
      Alert.alert('No Bingo', 'Try again!');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/gameplay.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.settingsIcon} onPress={() => router.push('./settings')}>
          <Image
            source={require('../assets/images/settings.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <Text style={styles.modeText}>{bingoMode}</Text>
        <Text style={styles.modeText2}>Select {winningNumbers.length} numbers</Text>
        <BingoCard 
          mode={bingoMode} 
          markedNumbers={markedNumbers} 
          setMarkedNumbers={setMarkedNumbers} 
          selectionCount={selectionCount} 
          setSelectionCount={setSelectionCount} 
          winningNumbers={winningNumbers}  
          revealWinningNumbers={revealWinningNumbers}
          onNumberSelect={handleNumberSelect}
        />
        <TouchableOpacity style={styles.checkButton} onPress={checkWinningNumbers}>
          <Text style={styles.checkButtonText}>Check Winning Numbers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>Reset Game</Text>
        </TouchableOpacity>

        <View style={styles.adContainer}>
          <InlineAd/>
        </View>
    
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
    top: 60,
    right: 18,
  },
  modeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  modeText2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  cell: {
    width: '18%',  // Slightly less than 20% to allow for margins
    height: 60,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6a5acd',
    borderRadius: 10,
  },
  cellMarked: {
    backgroundColor: '#ff4500',
  },
  cellWinning: {
    backgroundColor: '#32cd32',
  },
  number: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  checkButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#6a5acd',
    borderRadius: 10,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#ff4500',
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    alignItems: 'center',
  },
});