import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';

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
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as 'light' | 'dark');
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
      await AsyncStorage.setItem('theme', newTheme);
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
      border: hslToHex(214, 31, 91), // #d9e2ec
      input: hslToHex(214, 31, 91), // #d9e2ec
      ring: hslToHex(221, 39, 11), // #1a2526
      background: hslToHex(0, 0, 100), // #ffffff
      foreground: hslToHex(222, 47, 11), // #0f172a
      primary: "#007AFF",  // #1a2526
      primaryForeground: hslToHex(210, 40, 98), // #f5faff
      secondary: hslToHex(215, 28, 17), // #1f2a44
      secondaryForeground: hslToHex(210, 40, 98), // #f5faff
      destructive: hslToHex(0, 62, 30), // #9b2c2c
      destructiveForeground: hslToHex(210, 40, 98), // #f5faff
      muted: hslToHex(215, 28, 17), // #1f2a44
      mutedForeground: hslToHex(215, 20, 65), // #94a3b8
      accent: hslToHex(215, 28, 17), // #1f2a44
      accentForeground: hslToHex(210, 40, 98), // #f5faff
      popover: hslToHex(0, 0, 100), // #ffffff
      popoverForeground: hslToHex(222, 47, 11), // #0f172a
      card: hslToHex(0, 0, 100), // #ffffff
      cardForeground: hslToHex(222, 47, 11), // #0f172a
      mainColer: "#f4f8fb",
      textColer: "#58bbf9",
      bgColer: "#EBF5FF",
      headerBg: "#007AFF",
    },
    dark: {
      border: hslToHex(214, 31, 20), // #2e3a4d
      input: hslToHex(214, 31, 20), // #2e3a4d
      ring: hslToHex(221, 39, 80), // #b3c0c2
      background: hslToHex(0, 0, 0), // #000000
      foreground: hslToHex(210, 40, 98), // #f5faff
      primary: hslToHex(210, 40, 98), // #f5faff
      primaryForeground: hslToHex(221, 39, 11), // #1a2526
      secondary: hslToHex(215, 28, 80), // #b3c0c2
      secondaryForeground: hslToHex(215, 28, 17), // #1f2a44
      destructive: hslToHex(0, 62, 50), // #e53e3e
      destructiveForeground: hslToHex(210, 40, 98), // #f5faff
      muted: hslToHex(215, 28, 80), // #b3c0c2
      mutedForeground: hslToHex(215, 20, 35), // #4b5e77
      accent: hslToHex(215, 28, 80), // #b3c0c2
      accentForeground: hslToHex(215, 28, 17), // #1f2a44
      popover: hslToHex(0, 0, 0), // #000000
      popoverForeground: hslToHex(210, 40, 98), // #f5faff
      card: hslToHex(0, 0, 0), // #000000
      cardForeground: hslToHex(210, 40, 98), // #f5faff
      mainColer: "#f4f8fb",
      textColer: "#58bbf9",
      bgColer: "#EBF5FF",
      headerBg: "#007AFF",
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