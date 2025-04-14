import { View, Text } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

export default function Cart() {
  const { colors } = useThemeColors();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text style={{ color: colors.foreground }}>Cart Screen</Text>
    </View>
  );
}