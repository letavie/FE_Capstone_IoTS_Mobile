import { Stack } from "expo-router";
export default function STORELayout() {
  // console.log('DeviceLayout routes:', ['DeviceDetail', 'ComboDetail', 'DeviceList', 'ComboList']);
  return (
    <Stack>
      <Stack.Screen name="ProfileStore" options={{ title: "Profile Store" }} />
    </Stack>
  );
}
