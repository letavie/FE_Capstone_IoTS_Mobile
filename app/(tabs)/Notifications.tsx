import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';

const notifications = [
  { id: '1', message: 'Your order #1234 has been shipped!', time: '2h ago', icon: 'cart' },
  { id: '2', message: 'New blog post: "Top IoT Devices"', time: '5h ago', icon: 'book' },
  { id: '3', message: 'Your warranty request has been approved.', time: '1d ago', icon: 'shield-checkmark' },
];

export default function Notifications() {
  const { colors } = useThemeColors();

  const renderNotification = ({ item }: { item: { id: string; message: string; time: string; icon: string } }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b"
      style={{ borderColor: colors.mutedForeground }} 
    >
      <Ionicons
        name={item.icon as keyof typeof Ionicons.glyphMap}
        size={24}
        color={colors.primary} 
        className="mr-4"
      />
      <View className="flex-1">
        <Text className="text-sm" style={{ color: colors.foreground }}>
          {item.message}
        </Text>
        <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
          {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Text className="text-2xl font-bold p-4" style={{ color: colors.foreground }}>
        Notifications
      </Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}