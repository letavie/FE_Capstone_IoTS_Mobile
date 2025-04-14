import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../hooks/useThemeColors';
import { Combo } from './../services/slices/productApi';
import { useRouter } from 'expo-router';

interface ComboCardProps {
  combo: Combo;
}

const ComboCard: React.FC<ComboCardProps> = ({ combo }) => {
  const { colors } = useThemeColors();
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/device/ComboDetail?id=${combo.id}`)}
      className="bg-white rounded-lg shadow-md p-4 w-64"
    >
      <Image
        source={{ uri: combo.imageUrl }}
        className="w-full h-40 object-cover rounded-md mb-2"
      />
      <Text className="text-gray-800 font-semibold">{combo.name}</Text>
      <Text className="text-red-600">{combo.price.toLocaleString()} VND</Text>
      <View className="flex flex-row items-center mt-2">
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text className="text-gray-600 ml-1">{combo.rating.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ComboCard;