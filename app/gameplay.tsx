import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import InlineAd from './InlineAd';
import Dialog from "react-native-dialog"; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const [soundOn, setSoundOn] = useState<boolean>(false); // Tracks sound effects
  const [musicOn, setMusicOn] = useState<boolean>(true); // Tracks background music
  const [modalVisible, setModalVisible] = useState(false);
  const [nobingoSound, setNobingoSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSoundOn = await AsyncStorage.getItem('soundOn');
        const savedMusicOn = await AsyncStorage.getItem('musicOn');
        setSoundOn(savedSoundOn === 'true');
        setMusicOn(savedMusicOn === 'true');
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
            shouldPlay: musicOn,
            isLooping: true,
          }
        );
        setBackgroundSound(newSound);
        if (musicOn) await newSound.playAsync();
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

    const loadNobingoSound = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/music/nobingo.wav')
        );
        setNobingoSound(newSound);
        console.log('No Bingo sound loaded');
      } catch (error) {
        console.error('Error loading No Bingo sound:', error);
      }
    };

    playBackgroundMusic();
    loadSelectSound();
    loadNobingoSound();

    return () => {
      if (backgroundSound) {
        backgroundSound.unloadAsync();
      }
      if (selectSound) {
        selectSound.unloadAsync();
      }
      if (nobingoSound) {
        backgroundSound?.stopAsync();
        nobingoSound.unloadAsync();
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
    setModalVisible(false)
    setMarkedNumbers(new Array(25).fill(false));
    setSelectionCount(0);
    setWinningNumbers(generateWinningNumbers(bingoMode));
    setRevealWinningNumbers(false);
    console.log('Game reset');
  };

  

  const checkWinningNumbers = () => {
    setRevealWinningNumbers(true);
    if (checkForBingo(markedNumbers, winningNumbers)) {
      // Alert.alert('Congratulations!', 'You have Bingo!', [
      //   { text: 'OK', onPress: () => console.log('Bingo acknowledged') },
      setModalVisible(true)
      // ]);
      // showCustomAlert('Congratulations! You have Bingo!', 'success');
    } else {
      // showCustomAlert('No Bingo. Try again!', 'failure');
      setModalVisible(true)
    }
  };

  // Play and stop No Bingo sound on modal open/close
  useEffect(() => {
    if (modalVisible) {
      if (nobingoSound) {
        nobingoSound.playAsync();
        console.log('Playing No Bingo sound');
      }
    } else {
      if (nobingoSound) {
        nobingoSound.stopAsync();
        console.log('Stopping No Bingo sound');
      }
    }
  }, [modalVisible]);


  return (
    <ImageBackground
      source={require('../assets/images/gameplay.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerText}>You Lose</Text>
          </View>
          <View style={styles.buttonRow}>

          <TouchableOpacity style={styles.optionButton} onPress={()=>{resetGame()}}>  
            <MaterialCommunityIcons name="restart" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <MaterialCommunityIcons name="menu" size={24} color="white" />
          </TouchableOpacity>

          </View>
          
        </View>
        </View>
      </Modal>

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
        {/* <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>Reset Game</Text>
        </TouchableOpacity> */}

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
    backgroundColor: '#32CD32',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D87FD2',
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
  card: {
    width: '90%',
    height: '40%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  optionButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    width: '20%',
    marginHorizontal: 5,
  },
  optionText: {
    fontSize: 20,
    color: '#FFFFFF',
    
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});