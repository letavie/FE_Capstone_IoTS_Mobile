// import { View, Text, Image, TouchableOpacity } from 'react-native';
// import { useThemeColors } from '../../hooks/useThemeColors';
// import { Shield } from 'react-native-feather';
// import dayjs from 'dayjs';

// type OrderItemProps = {
//   item: {
//     orderItemId: number;
//     imageUrl: string;
//     nameProduct: string;
//     quantity: number;
//     price: number;
//     orderItemStatus?: number; 
//     warrantyEndDate?: string; 
//     productType?: number; 
//   };
//   onWarrantyRequestClick: (orderItemId: number) => void;
// };

// export default function OrderItem({ item, onWarrantyRequestClick }: OrderItemProps) {
//   const { colors } = useThemeColors();
//   const currentDate = new Date();
//   const warrantyEndDate = item.warrantyEndDate ? new Date(item.warrantyEndDate) : null;
//   const isWarrantyValid = warrantyEndDate && warrantyEndDate > currentDate;
//   const isWarrantyApplicable = item.productType !== 3; // Safe with optional chaining

//   const formatDate = (dateString: string) => {
//     return dayjs(dateString).format('DD/MM/YYYY HH:mm');
//   };

//   const formatPrice = (price: number) => {
//     return price.toLocaleString('vi-VN') + '₫';
//   };

//   return (
//     <View className="flex-row justify-between items-center p-3 rounded-md bg-blue-50">
//       {/* Product Info */}
//       <View className="flex-row items-center">
//         <Image
//           source={{ uri: item.imageUrl }}
//           style={{ width: 80, height: 80, borderRadius: 4, resizeMode: 'cover' }}
//         />
//         <View className="ml-4">
//           <Text className="font-medium" style={{ color: colors.foreground }}>
//             {item.nameProduct}
//           </Text>
//           <Text className="text-gray-600" style={{ color: colors.mutedForeground }}>
//             Quantity: {item.quantity}
//           </Text>
//         </View>
//       </View>

//       {/* Price and Warranty */}
//       <View className="flex-col items-end space-y-2">
//         <Text className="text-red-500 font-medium">{formatPrice(item.price)}</Text>
//         {(item.orderItemStatus === 6 || item.orderItemStatus === 8) && isWarrantyApplicable && (
//           <View className="flex-col items-end space-y-1">
//             {isWarrantyValid && item.warrantyEndDate ? (
//               <Text className="text-xs flex-row" style={{ color: colors.mutedForeground }}>
//                 <Text className="text-green-700">Warranty until: </Text>
//                 {formatDate(item.warrantyEndDate)}
//               </Text>
//             ) : null}

//             {isWarrantyValid ? (
//               <TouchableOpacity
//                 className="flex-row items-center bg-blue-50 rounded-md px-2 py-1"
//                 onPress={() => onWarrantyRequestClick(item.orderItemId)}
//               >
//                 <Text className="text-yellow-500 mr-1">Warranty</Text>
//                 <Shield width={16} height={16} color="#F59E0B" />
//               </TouchableOpacity>
//             ) : (
//               <Text className="text-xs" style={{ color: colors.mutedForeground }}>
//                 Warranty expired!
//               </Text>
//             )}
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }

import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Shield } from 'react-native-feather';
import dayjs from 'dayjs';

type OrderItemProps = {
  item: {
    orderItemId: number;
    imageUrl: string;
    nameProduct: string;
    quantity: number;
    price: number;
    orderItemStatus?: number;
    warrantyEndDate?: string;
    productType?: number;
  };
  onWarrantyRequestClick: (orderItemId: number) => void;
};

export default function OrderItem({ item, onWarrantyRequestClick }: OrderItemProps) {
  const { colors } = useThemeColors();
  const currentDate = new Date();
  const warrantyEndDate = item.warrantyEndDate ? new Date(item.warrantyEndDate) : null;
  const isWarrantyValid = warrantyEndDate && warrantyEndDate > currentDate;
  const isWarrantyApplicable = item.productType !== 3;

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  return (
    <View className="flex-row items-center p-3 rounded-lg bg-blue-50 mb-3 shadow-sm">
      {/* Product Image */}
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/80' }}
        className="w-20 h-20 rounded-md"
        resizeMode="cover"
      />

      {/* Product Info */}
      <View className="flex-1 mx-3">
        <Text
          className="text-base font-medium text-foreground"
          style={{ color: colors.foreground }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.nameProduct}
        </Text>
        <Text className="text-sm text-muted-foreground mt-1" style={{ color: colors.mutedForeground }}>
          Quantity: {item.quantity}
        </Text>
      </View>

      {/* Price and Warranty */}
      <View className="items-end w-24">
        <Text className="text-red-500 font-semibold text-sm">
          {formatPrice(item.price)}
        </Text>
        {(item.orderItemStatus === 6 || item.orderItemStatus === 8) && isWarrantyApplicable && (
          <View className="mt-2 items-end">
            {isWarrantyValid && item.warrantyEndDate ? (
              <Text className="text-xs text-muted-foreground" style={{ color: colors.mutedForeground }}>
                <Text className="text-green-700">Warranty until: </Text>
                {formatDate(item.warrantyEndDate)}
              </Text>
            ) : null}

            {isWarrantyValid ? (
              <TouchableOpacity
                className="flex-row items-center bg-blue-100 rounded-md px-2 py-1 mt-1"
                onPress={() => onWarrantyRequestClick(item.orderItemId)}
                accessibilityLabel="Request warranty"
                activeOpacity={0.7}
              >
                <Text className="text-yellow-500 text-xs font-medium mr-1">Warranty</Text>
                <Shield width={16} height={16} color="#F59E0B" />
              </TouchableOpacity>
            ) : (
              <Text className="text-xs text-muted-foreground mt-1" style={{ color: colors.mutedForeground }}>
                Warranty expired
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}