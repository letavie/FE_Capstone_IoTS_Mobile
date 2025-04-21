import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../../hooks/useThemeColors';
import { MessageCircle, ShoppingBag } from 'react-native-feather';
import OrderStatusTag from './OrderStatusTag';
import OrderItem from './OrderItem';

type OrderItem = {
  orderItemId: number;
  imageUrl: string;
  nameProduct: string;
  quantity: number;
  price: number;
  orderItemStatus?: number;
  warrantyEndDate?: string;
  productType?: number;
};

type SellerGroupProps = {
  group: {
    sellerId: number;
    sellerName: string;
    storeId: string;
    orderItemStatus: number;
    items: OrderItem[];
    sellerRole: number;
  };
  orderId: number;
  onFeedbackClick: (group: SellerGroupProps['group'] & { orderId: number }) => void;
  onWarrantyRequestClick: (orderItemId: number) => void;
  onReceivedClick: (orderId: number, sellerId: number) => void;
};

export default function SellerGroup({
  group,
  orderId,
  onFeedbackClick,
  onWarrantyRequestClick,
  onReceivedClick,
}: SellerGroupProps) {
  const { colors } = useThemeColors();
  const router = useRouter();

  return (
    <View className="mb-4 pb-4 border-b border-gray-300">
      {/* Seller Info */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center space-x-3">
          <Text className="font-bold text-base" style={{ color: colors.foreground }}>
            {group.sellerName}
          </Text>
          <View className="flex-row space-x-2">
            {/* <TouchableOpacity
              className="flex-row items-center px-1 py-1 border rounded-sm"
              style={{ borderColor: colors.primary, backgroundColor: colors.primary }}
              onPress={() => router.push(`/chat/${group.storeId}` as any)}
            >
              <MessageCircle width={16} height={16} color={colors.primaryForeground} />
              <Text className="ml-1 text-xs" style={{ color: colors.primaryForeground }}>
                Chat Now
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              className="flex-row items-center px-1 py-1 border rounded-sm"
              style={{ borderColor: colors.border }}
              onPress={() => router.push(`/shop/${group.storeId}` as any)}
            >
              <ShoppingBag width={16} height={16} color={colors.foreground} />
              <Text className="ml-1 text-xs" style={{ color: colors.foreground }}>
                View Shop
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row items-center space-x-3">
          <OrderStatusTag statusId={group.orderItemStatus} />
        </View>
      </View>

      {/* Order Items */}
      {group.items.map((item) => (
        <OrderItem
          key={item.orderItemId}
          item={item}
          onWarrantyRequestClick={onWarrantyRequestClick}
        />
      ))}

      {/* Action Buttons */}
      <View className="flex-row justify-end space-x-2 mt-2">
        {group.orderItemStatus === 5 && (
          <TouchableOpacity
            className="rounded-md px-4 py-2"
            style={{ backgroundColor: colors.primary }}
            onPress={() => onFeedbackClick({ ...group, orderId })}
          >
            <Text className="font-semibold" style={{ color: colors.primaryForeground }}>
              Feedback
            </Text>
          </TouchableOpacity>
        )}
        {group.orderItemStatus === 3 && (
          <TouchableOpacity
            className="rounded-md px-4 py-2"
            style={{ backgroundColor: '#10B981' }}
            onPress={() => onReceivedClick(orderId, group.sellerId)}
          >
            <Text className="font-semibold text-white">Received Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}