
// import { memo } from 'react';
// import { View, Text, Image, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { IotDevice } from '@/services/slices/productApi';
// import { ThemeColors } from '../constants/Colors';

// const DeviceItem = memo<{ item: IotDevice; colors: ThemeColors; router: any }>(
//   ({ item, colors, router }) => {
//     const handlePress = () => {
//       if (!item.id || isNaN(item.id)) {
//         console.error('Invalid device ID:', item.id);
//         return;
//       }
//       console.log('Navigating to DeviceDetail with ID:', item.id);
//       router.push(`/device/DeviceDetail?id=${item.id}`);
//     };

//     return (
//       <TouchableOpacity
//         style={{
//           borderRadius: 12,
//           padding: 8,
//           marginRight: 12,
//           marginTop: 6,
//           elevation: 4,
//           shadowColor: '#000',
//           shadowOpacity: 0.1,
//           shadowRadius: 4,
//           shadowOffset: { width: 0, height: 2 },
//           backgroundColor: colors.card,
//           width: '48%',
//         }}
//         onPress={handlePress}
//       >
//         <Image
//           source={{ uri: item.imageUrl }}
//           style={{ width: 120, height: 120, borderRadius: 8 }}
//           resizeMode="cover"
//         />
//         <Text
//           style={{
//             fontSize: 14,
//             fontWeight: '600',
//             marginVertical: 4,
//             color: colors.foreground,
//           }}
//           numberOfLines={2}
//           ellipsizeMode="tail"
//         >
//           {item.name}
//         </Text>
//         <Text style={{ color: colors.destructive }}>
//           {item.price.toLocaleString()} VND
//         </Text>
//         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
//           <Ionicons name="star" size={16} color="#FFD700" />
//           <Text style={{ color: colors.mutedForeground, marginLeft: 4 }}>
//             {item.rating.toFixed(1)}
//           </Text>
//           <TouchableOpacity style={{ marginLeft: 'auto' }}>
//             <Ionicons name="cart-outline" size={20} color={colors.primary} />
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     );
//   }
// );

// export default DeviceItem;
import { memo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IotDevice } from '@/services/slices/productApi';
import { ThemeColors } from '../constants/Colors';
import { Router } from 'expo-router';

interface DeviceItemProps {
  item: IotDevice;
  colors: ThemeColors;
  router: Router;
}

const DeviceItem = memo<DeviceItemProps>(({ item, colors, router }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handlePress = () => {
    if (!item.id || isNaN(item.id)) {
      console.error('Invalid device ID:', item.id);
      return;
    }
    console.log('Navigating to DeviceDetail with ID:', item.id);
    router.push(`/device/DeviceDetail?id=${item.id}`);
  };

  return (
    <TouchableOpacity
      style={{
        borderRadius: 12,
        padding: 12,
        margin: 8, // Adjusted for consistent spacing in grid
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        backgroundColor: colors.card,
        width: '45%', // Adjusted for better spacing with margin
      }}
      onPress={handlePress}
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
          minHeight: 40, // Ensure consistent height for text
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

export default DeviceItem;