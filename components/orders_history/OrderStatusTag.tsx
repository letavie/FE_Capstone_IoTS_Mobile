import { View, Text } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

// Define the type for statusConfig
interface StatusConfig {
  [key: string]: {
    text: string;
    color: string;
    icon: string;
    tabName: string;
  };
}

const statusConfig: StatusConfig = {
  '0': { text: 'All orders', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: '📋', tabName: 'All orders' },
  '1': { text: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: '⏳', tabName: 'Pending' },
  '2': { text: 'Packing', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '📦', tabName: 'Packing' },
  '3': { text: 'Delivering', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🚚', tabName: 'Delivering' },
  '5': { text: 'Pending to feedback', color: 'bg-pink-100 text-pink-800 border-pink-200', icon: '⭐', tabName: 'Pending to feedback' },
  '6': { text: 'Success order', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: '🏆', tabName: 'Success order' },
  '7': { text: 'Cancel', color: 'bg-red-100 text-red-800 border-red-200', icon: '↩️', tabName: 'Cancel' },
  '8': { text: 'Bad feedback', color: 'bg-yellow-100 text-red-800 border-red-200', icon: '👎', tabName: 'Bad feedback' },
};

type OrderStatusTagProps = {
  statusId: number;
};

export default function OrderStatusTag({ statusId }: OrderStatusTagProps) {
  const { colors } = useThemeColors();
  const config = statusConfig[statusId.toString()] || {
    text: 'Unknown',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '',
  };

  return (
    <View
      className={`inline-flex items-center px-2 py-1 rounded-sm border ${config.color}`}
      style={{ borderColor: colors.border }}
    >
      <Text className="mr-1">{config.icon}</Text>
      <Text style={{ color: colors.foreground }}>{config.text}</Text>
    </View>
  );
}