// ThemesScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from './ThemeContext';

const ThemesScreen: React.FC = () => {
  const { theme, changeTheme } = useTheme();
  const userHasPremium = false; // Mock logic

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.text, { color: theme.textColor }]}>Choose a Theme:</Text>

      {/* Free Themes */}
      <TouchableOpacity onPress={() => changeTheme('default')}>
        <Text style={styles.themeButton}>Default Theme</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => changeTheme('dark')}>
        <Text style={styles.themeButton}>Dark Theme</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => changeTheme('light')}>
        <Text style={styles.themeButton}>Light Theme</Text>
      </TouchableOpacity>

      {/* Paid Themes */}
      <TouchableOpacity  onPress={() => userHasPremium ? changeTheme('paidTheme1') : alert('Please purchase premium to unlock this theme')}>
        <Text style={styles.themeButton}>Paid Theme 1 (Premium)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  } as ViewStyle,
  text: {
    fontSize: 20,
    marginBottom: 20,
  } as TextStyle,
  themeButton: {
    fontSize: 18,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#ccc',
  } as TextStyle,
});

export default ThemesScreen;