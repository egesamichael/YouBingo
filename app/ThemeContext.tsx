// ThemeContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ViewStyle, TextStyle } from 'react-native';

// Define the theme interface
interface Theme {
  backgroundColor: string;
  textColor: string;
}

interface ThemeContextType {
  theme: Theme;
  changeTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<string>('default');

  const themes: Record<string, Theme> = {
    default: {
      backgroundColor: '#fff',
      textColor: '#000',
    },
    dark: {
      backgroundColor: '#000',
      textColor: '#fff',
    },
    light: {
      backgroundColor: '#f4f4f4',
      textColor: '#222',
    },
    paidTheme1: {
      backgroundColor: '#003366',
      textColor: '#ffcc00',
    },
    // Add more themes here
  };

  const changeTheme = (themeName: string) => {
    setThemeName(themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[themeName], changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};