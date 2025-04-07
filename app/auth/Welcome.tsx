import { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function Welcome() {
  const router = useRouter();
  const { colors } = useThemeColors();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/Home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 justify-center items-center bg-bgColer">
      <Image
        source={require('../../assets/images/logo3.png')}
        className="w-32 h-32 mb-4"
        resizeMode="contain"
      />
      {/* <Text className="text-4xl font-Mainfont font-bold text-textColer">IoTS</Text> */}
      <Text className="text-lg font-Mainfont text-textColer">Welcome to IoTS</Text>
    </View>
  );
}