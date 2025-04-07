import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import '../global.css';
export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Đảm bảo Welcome là màn hình đầu tiên
    router.replace('/auth/Welcome');
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/Welcome" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}