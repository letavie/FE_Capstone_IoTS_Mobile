import { Stack } from 'expo-router';

export default function DeviceLayout() {
  // console.log('DeviceLayout routes:', ['DeviceDetail', 'ComboDetail', 'DeviceList', 'ComboList']);
  return (
    <Stack>
      <Stack.Screen name="ComboDetail" options={{ title: 'Combo Detail' }} />
      <Stack.Screen name="DeviceDetail" options={{ title: 'Device Detail' }} />
      <Stack.Screen name="DeviceList" options={{ title: 'Devices' }} />
      <Stack.Screen name="ComboList" options={{ title: 'Combos' }} />
    </Stack>
  );
}