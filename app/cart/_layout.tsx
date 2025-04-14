import { Stack } from 'expo-router';
export default function CartLayout() {
    return (
      <Stack>
     
        <Stack.Screen name="Cart" options={{ title: 'Cart' }} />
      </Stack>
    );
  }