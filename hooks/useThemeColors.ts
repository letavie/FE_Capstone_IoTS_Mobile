// hooks/useThemeColors.tsx
import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import asyncStorageService from '../services/storage/AsyncStorageService';
import { Colors } from '../constants/Colors';

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const useThemeColors = () => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await asyncStorageService.getItem<'light' | 'dark'>('theme');
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          setTheme(systemColorScheme ?? 'light');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
        setTheme(systemColorScheme ?? 'light');
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  // Save theme preference when it changes
  const saveTheme = async (newTheme: 'light' | 'dark') => {
    try {
      await asyncStorageService.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const getThemeColor = (
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
  ) => {
    const currentTheme = theme ?? systemColorScheme ?? 'light';
    const colorFromProps = props[currentTheme];
    if (colorFromProps) {
      return colorFromProps;
    }
    return Colors[currentTheme][colorName];
  };

  const colors = {
    light: {
      border: hslToHex(214, 31, 91),
      input: hslToHex(214, 31, 91),
      ring: hslToHex(221, 39, 11),
      background: hslToHex(0, 0, 100),
      foreground: hslToHex(222, 47, 11),
      primary: '#007AFF',
      primaryForeground: hslToHex(210, 40, 98),
      secondary: hslToHex(215, 28, 17),
      secondaryForeground: hslToHex(210, 40, 98),
      destructive: hslToHex(0, 62, 30),
      destructiveForeground: hslToHex(210, 40, 98),
      muted: hslToHex(215, 28, 17),
      mutedForeground: hslToHex(215, 20, 65),
      accent: hslToHex(215, 28, 17),
      accentForeground: hslToHex(210, 40, 98),
      popover: hslToHex(0, 0, 100),
      popoverForeground: hslToHex(222, 47, 11),
      card: hslToHex(0, 0, 100),
      cardForeground: hslToHex(222, 47, 11),
      mainColer: '#f4f8fb',
      textColer: '#58bbf9',
      bgColer: '#EBF5FF',
      headerBg: '#007AFF',
      // Add missing properties
      text: hslToHex(222, 47, 11), // Same as foreground for consistency
      tint: '#007AFF', // Same as primary for consistency
      icon: hslToHex(222, 47, 11), // Same as foreground
      tabIconDefault: hslToHex(215, 20, 65), // Same as mutedForeground
      tabIconSelected: '#007AFF', // Same as primary
    },
    dark: {
      border: hslToHex(214, 31, 20),
      input: hslToHex(214, 31, 20),
      ring: hslToHex(221, 39, 80),
      background: hslToHex(0, 0, 0),
      foreground: hslToHex(210, 40, 98),
      primary: hslToHex(210, 40, 98),
      primaryForeground: hslToHex(221, 39, 11),
      secondary: hslToHex(215, 28, 80),
      secondaryForeground: hslToHex(215, 28, 17),
      destructive: hslToHex(0, 62, 50),
      destructiveForeground: hslToHex(210, 40, 98),
      muted: hslToHex(215, 28, 80),
      mutedForeground: hslToHex(215, 20, 35),
      accent: hslToHex(215, 28, 80),
      accentForeground: hslToHex(215, 28, 17),
      popover: hslToHex(0, 0, 0),
      popoverForeground: hslToHex(210, 40, 98),
      card: hslToHex(0, 0, 0),
      cardForeground: hslToHex(210, 40, 98),
      mainColer: '#f4f8fb',
      textColer: '#58bbf9',
      bgColer: '#EBF5FF',
      headerBg: '#007AFF',
      // Add missing properties
      text: hslToHex(210, 40, 98), // Same as foreground for consistency
      tint: hslToHex(210, 40, 98), // Same as primary for consistency
      icon: hslToHex(210, 40, 98), // Same as foreground
      tabIconDefault: hslToHex(215, 20, 35), // Same as mutedForeground
      tabIconSelected: hslToHex(210, 40, 98), // Same as primary
    },
  };

  return {
    colors: colors[theme ?? systemColorScheme ?? 'light'],
    colorScheme: theme ?? systemColorScheme,
    getThemeColor,
    theme: theme ?? systemColorScheme ?? 'light',
    hslToHex,
    toggleTheme,
  };
};