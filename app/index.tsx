import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';


export default function Index() {
  const [backgroundSound, setBackgroundSound] = useState<Audio.Sound | null>(null);
  const ballImages = [
    require('../assets/images/ball1.png'),
    require('../assets/images/ball2.png'),
    require('../assets/images/ball3.png'),
  ];

  const ballAnimations = Array.from({ length: 20 }).map(() => ({
    translateY: useRef(new Animated.Value(-100)).current,
    translateX: useRef(new Animated.Value(Math.random() * 300 - 150)).current,
    rotate: useRef(new Animated.Value(0)).current,
    image: ballImages[Math.floor(Math.random() * ballImages.length)],
  }));

 


  useEffect(() => {
    const dropBalls = () => {
      const animations = ballAnimations.map(({ translateY, translateX, rotate }) => 
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 800,
            duration: 4000,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: Math.random() * 300 - 150,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 360,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.stagger(200, animations).start();
    };

    dropBalls();
  }, []);

  useEffect(() => {
    const playBackgroundMusic = async () => {
      try {

      
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/music/welcome.mp3'),
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

    playBackgroundMusic();

    return () => {
      if (backgroundSound) {
        backgroundSound.unloadAsync();
      }
    };
  }, []);

  const handlePlayNow = () => {
    backgroundSound?.stopAsync();
    router.push('./gameplay');
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {ballAnimations.map((animation, index) => (
          <Animated.Image
            key={index}
            source={animation.image}
            style={[
              styles.ball,
              {
                transform: [
                  { translateY: animation.translateY },
                  { translateX: animation.translateX },
                  {
                    rotate: animation.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
        <Image source={require('../assets/images/bingo.png')} style={styles.image} />
        <Text style={styles.text}>You Bingo!</Text>
        <TouchableOpacity style={styles.button} onPress={handlePlayNow}>
          <Text style={styles.buttonText}>Play Now!</Text>
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
  },
  text: {
    fontSize: 62,
    color: '#FFD700',
    marginBottom: 20,
    fontFamily: 'Bingo',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'Bingo',
    textAlign: 'center',
  },
  image: {
    width: 350,
    height: 200,
    marginBottom: 20,
  },
  ball: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: 0,
  },
});
