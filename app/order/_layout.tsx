import { Stack } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function OrderLayout() {
  const { colors } = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.foreground,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="HistoryOrders" options={{ title: 'History Orders' }} />
    </Stack>
  );
}