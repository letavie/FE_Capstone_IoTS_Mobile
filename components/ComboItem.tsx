// import { memo } from 'react';
// import { View, Text, Image, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Combo } from '@/services/slices/productApi';
// import { ThemeColors } from '../constants/Colors';

// const ComboItem = memo<{ item: Combo; colors: ThemeColors; router: any }>(
//   ({ item, colors, router }) => (
//     <TouchableOpacity
//       style={{
//         borderRadius: 12,
//         padding: 8,
//         marginRight: 12,
//         marginTop: 6,
//         elevation: 4,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         shadowOffset: { width: 0, height: 2 },
//         backgroundColor: colors.card,
//         width: '48%',
//       }}
//       onPress={() => router.push(`/device/ComboDetail?id=${item.id}`)}
//     >
//       <Image source={{ uri: item.imageUrl }} style={{ width: 120, height: 120, borderRadius: 8 }} resizeMode="cover" />
//       <Text style={{ fontSize: 14, fontWeight: '600', marginVertical: 4, color: colors.foreground }}>{item.name}</Text>
//       <Text style={{ color: colors.destructive }}>{item.price.toLocaleString()} VND</Text>
//       <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
//         <Ionicons name="star" size={16} color="#FFD700" />
//         <Text style={{ color: colors.mutedForeground, marginLeft: 4 }}>
//           {item.rating.toFixed(1)}
//         </Text>
//         <TouchableOpacity style={{ marginLeft: 'auto' }}>
//           <Ionicons name="cart-outline" size={20} color={colors.primary} />
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   )
// );

// export default ComboItem;
import { memo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Combo } from '@/services/slices/productApi';
import { ThemeColors } from '../constants/Colors';
import { Router } from 'expo-router';

interface ComboItemProps {
  item: Combo;
  colors: ThemeColors;
  router: Router;
}

const ComboItem = memo<ComboItemProps>(({ item, colors, router }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      style={{
        borderRadius: 12,
        padding: 12,
        margin: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        backgroundColor: colors.card,
        width: '45%',
      }}
      onPress={() => router.push(`/device/ComboDetail?id=${item.id}`)}
    >
      <View style={{ position: 'relative', width: '100%', height: 120 }}>
        {imageLoading && !imageError && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: colors.mutedForeground,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
        <Image
          source={{
            uri: imageError || !item.imageUrl ? 'https://via.placeholder.com/120' : item.imageUrl,
          }}
          style={{ width: '100%', height: 120, borderRadius: 8 }}
          resizeMode="cover"
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          marginTop: 8,
          marginBottom: 4,
          color: colors.foreground,
          minHeight: 40,
          lineHeight: 20,
        }}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.name}
      </Text>
      <Text style={{ color: colors.destructive, fontWeight: '500' }}>
        {item.price.toLocaleString()} VND
      </Text>
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
  );
});

export default ComboItem;