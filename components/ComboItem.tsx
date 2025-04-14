import { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Combo } from '@/services/slices/productApi';
import { ThemeColors } from '../constants/Colors';

const ComboItem = memo<{ item: Combo; colors: ThemeColors; router: any }>(
  ({ item, colors, router }) => (
    <TouchableOpacity
      style={{
        borderRadius: 12,
        padding: 8,
        marginRight: 12,
        marginTop: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        backgroundColor: colors.card,
        width: '48%',
      }}
      onPress={() => router.push(`/device/ComboDetail?id=${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={{ width: 120, height: 120, borderRadius: 8 }} resizeMode="cover" />
      <Text style={{ fontSize: 14, fontWeight: '600', marginVertical: 4, color: colors.foreground }}>{item.name}</Text>
      <Text style={{ color: colors.destructive }}>{item.price.toLocaleString()} VND</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={{ color: colors.mutedForeground, marginLeft: 4 }}>
          {item.rating.toFixed(1)}
        </Text>
        <TouchableOpacity style={{ marginLeft: 'auto' }}>
          <Ionicons name="cart-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
);

export default ComboItem;