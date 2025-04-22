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
    // light: {
    //   border: hslToHex(214, 31, 91),
    //   input: hslToHex(214, 31, 91),
    //   ring: hslToHex(221, 39, 11),
    //   background: hslToHex(0, 0, 100),
    //   foreground: hslToHex(222, 47, 11),
    //   primary: '#007AFF',
    //   primaryForeground: hslToHex(210, 40, 98),
    //   secondary: hslToHex(215, 28, 17),
    //   secondaryForeground: hslToHex(210, 40, 98),
    //   destructive: hslToHex(0, 62, 30),
    //   destructiveForeground: hslToHex(210, 40, 98),
    //   muted: hslToHex(215, 28, 17),
    //   mutedForeground: hslToHex(215, 20, 65),
    //   accent: hslToHex(215, 28, 17),
    //   accentForeground: hslToHex(210, 40, 98),
    //   popover: hslToHex(0, 0, 100),
    //   popoverForeground: hslToHex(222, 47, 11),
    //   card: hslToHex(0, 0, 100),
    //   cardForeground: hslToHex(222, 47, 11),
    //   mainColer: '#f4f8fb',
    //   textColer: '#58bbf9',
    //   bgColer: '#EBF5FF',
    //   headerBg: '#007AFF',
    //   // Add missing properties
    //   text: hslToHex(222, 47, 11), // Same as foreground for consistency
    //   tint: '#007AFF', // Same as primary for consistency
    //   icon: hslToHex(222, 47, 11), // Same as foreground
    //   tabIconDefault: hslToHex(215, 20, 65), // Same as mutedForeground
    //   tabIconSelected: '#007AFF', // Same as primary
    // },
    // dark: {
    //   border: hslToHex(214, 31, 20),
    //   input: hslToHex(214, 31, 20),
    //   ring: hslToHex(221, 39, 80),
    //   background: hslToHex(0, 0, 0),
    //   foreground: hslToHex(210, 40, 98),
    //   primary: hslToHex(210, 40, 98),
    //   primaryForeground: hslToHex(221, 39, 11),
    //   secondary: hslToHex(215, 28, 80),
    //   secondaryForeground: hslToHex(215, 28, 17),
    //   destructive: hslToHex(0, 62, 50),
    //   destructiveForeground: hslToHex(210, 40, 98),
    //   muted: hslToHex(215, 28, 80),
    //   mutedForeground: hslToHex(215, 20, 35),
    //   accent: hslToHex(215, 28, 80),
    //   accentForeground: hslToHex(215, 28, 17),
    //   popover: hslToHex(0, 0, 0),
    //   popoverForeground: hslToHex(210, 40, 98),
    //   card: hslToHex(0, 0, 0),
    //   cardForeground: hslToHex(210, 40, 98),
    //   mainColer: '#f4f8fb',
    //   textColer: '#58bbf9',
    //   bgColer: '#EBF5FF',
    //   headerBg: '#007AFF',
    //   // Add missing properties
    //   text: hslToHex(210, 40, 98), // Same as foreground for consistency
    //   tint: hslToHex(210, 40, 98), // Same as primary for consistency
    //   icon: hslToHex(210, 40, 98), // Same as foreground
    //   tabIconDefault: hslToHex(215, 20, 35), // Same as mutedForeground
    //   tabIconSelected: hslToHex(210, 40, 98), // Same as primary
    // },
    light: {
      border: "#C8D7EB", // hslToHex(214, 31, 91) → H=214, S=31%, L=91% → #C8D7EB
      input: "#C8D7EB", // hslToHex(214, 31, 91) → #C8D7EB
      ring: "#1B263B", // hslToHex(221, 39, 11) → H=221, S=39%, L=11% → #1B263B
      background: "#FFFFFF", // hslToHex(0, 0, 100) → H=0, S=0%, L=100% → #FFFFFF
      foreground: "#1B263B", // hslToHex(222, 47, 11) → H=222, S=47%, L=11% → #1B263B
      primary: "#007AFF", // Already hex
      primaryForeground: "#F5F9FF", // hslToHex(210, 40, 98) → H=210, S=40%, L=98% → #F5F9FF
      secondary: "#2A354A", // hslToHex(215, 28, 17) → H=215, S=28%, L=17% → #2A354A
      secondaryForeground: "#F5F9FF", // hslToHex(210, 40, 98) → #F5F9FF
      destructive: "#7D2B2B", // hslToHex(0, 62, 30) → H=0, S=62%, L=30% → #7D2B2B
      destructiveForeground: "#F5F9FF", // hslToHex(210, 40, 98) → #F5F9FF
      muted: "#2A354A", // hslToHex(215, 28, 17) → #2A354A
      mutedForeground: "#8C9DBF", // hslToHex(215, 20, 65) → H=215, S=20%, L=65% → #8C9DBF
      accent: "#2A354A", // hslToHex(215, 28, 17) → #2A354A
      accentForeground: "#F5F9FF", // hslToHex(210, 40, 98) → #F5F9FF
      popover: "#FFFFFF", // hslToHex(0, 0, 100) → #FFFFFF
      popoverForeground: "#1B263B", // hslToHex(222, 47, 11) → #1B263B
      card: "#FFFFFF", // hslToHex(0, 0, 100) → #FFFFFF
      cardForeground: "#1B263B", // hslToHex(222, 47, 11) → #1B263B
      mainColer: "#f4f8fb", // Already hex
      textColer: "#58bbf9", // Already hex
      bgColer: "#EBF5FF", // Already hex
      headerBg: "#007AFF", // Already hex
      text: "#1B263B", // hslToHex(222, 47, 11) → #1B263B
      tint: "#007AFF", // Already hex
      icon: "#1B263B", // hslToHex(222, 47, 11) → #1B263B
      tabIconDefault: "#8C9DBF", // hslToHex(215, 20, 65) → #8C9DBF
      tabIconSelected: "#007AFF", // Already hex
    },
    dark: {
      border: "#2A354A", // hslToHex(214, 31, 20) → H=214, S=31%, L=20% → #2A354A
      input: "#2A354A", // hslToHex(214, 31, 20) → #2A354A
      ring: "#A2B6E0", // hslToHex(221, 39, 80) → H=221, S=39%, L=80% → #A2B6E0
      background: "#000000", // hslToHex(0, 0, 0) → H=0, S=0%, L=0% → #000000
      foreground: "#F5F9FF", // hslToHex(210, 40, 98) → H=210, S=40%, L=98% → #F5F9FF
      primary: "#F5F9FF", // hslToHex(210, 40, 98) → #F5F9FF
      primaryForeground: "#1B263B", // hslToHex(221, 39, 11) → H=221, S=39%, L=11% → #1B263B
      secondary: "#A2B6E0", // hslToHex(215, 28, 80) → H=215, S=28%, L=80% → #A2B6E0
      secondaryForeground: "#2A354A", // hslToHex(215, 28, 17) → H=215, S=28%, L=17% → #2A354A
      destructive: "#CC3333", // hslToHex(0, 62, 50) → H=0, S=62%, L=50% → #CC3333
      destructiveForeground: "#F5F9FF", // hslToHex(210, 40, 98) → #F5F9FF
      muted: "#A2B6E0", // hslToHex(215, 28, 80) → #A2B6E0
      mutedForeground: "#5B6B8C", // hslToHex(215, 20, 35) → H=215, S=20%, L=35% → #5B6B8C
      accent: "#A2B6E0", // hslToHex(215, 28, 80) → #A2B6E0
      accentForeground: "#2A354A", // hslToHex(215, 28, 17) → #2A354A
      popover: "#000000", // hslToHex(0, 0, 0) → #000000
      popoverForeground: "#F5F9FF", // hslToHex(210, 40, 98) → #F5F9FF
      card: "#000000", // hslToHex(0, 0, 0) → #000000
      cardForeground: "#F5F9FF", // hslToHex(210, 40, 98) → #F5F9FF
      mainColer: "#f4f8fb", // Already hex
      textColer: "#58bbf9", // Already hex
      bgColer: "#EBF5FF", // Already hex
      headerBg: "#007AFF", // Already hex
      text: "#F5F9FF", // hslToHex(210, 40, 98) → #F5F9FF
      tint: "#F5F9FF", // hslToHex(210, 40, 98) → #F5F9FF
      icon: "#F5F9FF", // hslToHex(210, 40, 98) → #F5F9FF
      tabIconDefault: "#5B6B8C", // hslToHex(215, 20, 35) → #5B6B8C
      tabIconSelected: "#F5F9FF", // hslToHex(210, 40, 98) → #F5F9FF
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