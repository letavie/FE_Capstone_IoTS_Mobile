/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// const tintColorLight = '#0a7ea4';
// const tintColorDark = '#fff';

// export const Colors = {
//   light: {
//     text: '#11181C',
//     background: '#fff',
//     tint: tintColorLight,
//     icon: '#687076',
//     tabIconDefault: '#687076',
//     tabIconSelected: tintColorLight,
//   },
//   dark: {
//     text: '#ECEDEE',
//     background: '#151718',
//     tint: tintColorDark,
//     icon: '#9BA1A6',
//     tabIconDefault: '#9BA1A6',
//     tabIconSelected: tintColorDark,
//   },
// };

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Định nghĩa interface cho theme colors
export interface ThemeColors {
  border: string;
  input: string;
  ring: string;
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  destructive: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  popover: string;
  popoverForeground: string;
  card: string;
  cardForeground: string;
  textColer: string; // Lưu ý: Có thể đây là lỗi typo, nên sửa thành "textColor"
  headerBg: string;
  text: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

// Định nghĩa giá trị Colors
export const Colors = {
  light: {
    border: '#E5E7EB',
    input: '#F3F4F6',
    ring: '#D1D5DB',
    background: '#fff',
    foreground: '#11181C',
    primary: '#0a7ea4',
    primaryForeground: '#fff',
    secondary: '#E5E7EB',
    secondaryForeground: '#11181C',
    destructive: '#EF4444',
    muted: '#D1D5DB',
    mutedForeground: '#6B7280',
    accent: '#F3F4F6',
    accentForeground: '#11181C',
    popover: '#fff',
    popoverForeground: '#11181C',
    card: '#fff',
    cardForeground: '#11181C',
    textColer: '#11181C', // Sửa thành "textColor" nếu cần
    headerBg: '#0a7ea4',
    text: '#11181C',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    border: '#374151',
    input: '#1F2937',
    ring: '#4B5563',
    background: '#151718',
    foreground: '#ECEDEE',
    primary: '#fff',
    primaryForeground: '#151718',
    secondary: '#374151',
    secondaryForeground: '#ECEDEE',
    destructive: '#F87171',
    muted: '#4B5563',
    mutedForeground: '#9CA3AF',
    accent: '#1F2937',
    accentForeground: '#ECEDEE',
    popover: '#1F2937',
    popoverForeground: '#ECEDEE',
    card: '#1F2937',
    cardForeground: '#ECEDEE',
    textColer: '#ECEDEE', // Sửa thành "textColor" nếu cần
    headerBg: '#1F2937',
    text: '#ECEDEE',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};