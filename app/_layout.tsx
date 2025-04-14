import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import '../global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toastConfig } from '../components/CustomToast';
import 'react-native-gesture-handler';
export default function RootLayout() {
  const router = useRouter();

  // useEffect(() => {
  //   // Redirect to the Welcome screen on app load
  //   router.replace('/auth/Welcome');
  // }, []);
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          router.replace('/(tabs)/Home');
        } else {
          router.replace('/auth/Welcome');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        router.replace('/auth/Welcome');
      }
    };

    checkToken();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="device"  />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}