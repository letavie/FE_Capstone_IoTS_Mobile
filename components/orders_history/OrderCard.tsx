import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Truck } from 'react-native-feather';
import SellerGroup from './SellerGroup';
import dayjs from 'dayjs';

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

type SellerGroupType = {
  sellerId: number;
  sellerName: string;
  storeId: string;
  orderItemStatus: number;
  trackingId?: string;
  items: OrderItem[];
  sellerRole: number; // Make sellerRole required
};

type Order = {
  orderId: number;
  applicationSerialNumber: string;
  createDate: string;
  orderStatusId: string;
  shippingFee: number;
  totalPrice: number;
  orderDetailsGrouped: SellerGroupType[];
};

type OrderCardProps = {
  order: Order;
  onFeedbackClick: (group: SellerGroupType & { orderId: number }) => void;
  onReceivedClick: (orderId: number, sellerId: number) => void;
  onTrackClick: (trackingId: string) => void;
  onCancelClick: (orderId: number, sellerId: number) => void;
  onWarrantyRequestClick: (orderItemId: number) => void;
  onCancelCashPayment: (orderId: number) => void;
};

export default function OrderCard({
  order,
  onFeedbackClick,
  onReceivedClick,
  onTrackClick,
  onCancelClick,
  onWarrantyRequestClick,
  onCancelCashPayment,
}: OrderCardProps) {
  const { colors } = useThemeColors();
  const trackingId = order.orderDetailsGrouped[0]?.trackingId;

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  return (
    <View className="p-6 rounded-lg shadow-md my-4 border bg-white" style={{ borderColor: colors.border }}>
      {/* Order Header */}
      <View className="flex-row justify-between items-center border-b pb-4 mb-4" style={{ borderColor: colors.border }}>
        <View>
          <View className="flex-row items-center space-x-2 mb-2">
            <Text className="text-gray-600" style={{ color: colors.mutedForeground }}>
              Order code:
            </Text>
            <Text className="font-bold" style={{ color: colors.foreground }}>
              {order.applicationSerialNumber}
            </Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <Text className="text-gray-600" style={{ color: colors.mutedForeground }}>
              Create date:
            </Text>
            <Text className="font-medium" style={{ color: colors.foreground }}>
              {formatDate(order.createDate)}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center space-x-2">
          {order.orderDetailsGrouped.some(
            (group) => group.orderItemStatus === 2 || group.orderItemStatus === 3
          ) && trackingId && (
            <>
              <TouchableOpacity onPress={() => onTrackClick(trackingId)}>
                <Truck width={24} height={24} color="#10B981" />
              </TouchableOpacity>
              <Text style={{ color: colors.mutedForeground }}>|</Text>
            </>
          )}
          {order.orderStatusId === '1' ? (
            <Text className="text-green-600 pl-3">PAID</Text>
          ) : order.orderStatusId === '2' ? (
            <Text className="text-red-600 pl-3">CANCELLED</Text>
          ) : (
            <Text className="text-yellow-600 pl-3">CASH PAYMENT</Text>
          )}
        </View>
      </View>

      {/* Seller Groups */}
      {order.orderDetailsGrouped.map((group) => (
        <SellerGroup
          key={`${order.orderId}-${group.sellerId}`}
          group={group}
          orderId={order.orderId}
          onFeedbackClick={onFeedbackClick}
          onReceivedClick={onReceivedClick}
          onWarrantyRequestClick={onWarrantyRequestClick}
        />
      ))}

      {/* Order Summary */}
      <View className="flex-row justify-between items-center pt-4">
        <View className="flex-row items-center space-x-2">
          <Text className="font-medium" style={{ color: colors.foreground }}>
            Shipping fee:
          </Text>
          <Text style={{ color: colors.foreground }}>{formatPrice(order.shippingFee)}</Text>
        </View>
        <View className="flex-row items-center space-x-2">
          <Text className="font-medium text-lg" style={{ color: colors.foreground }}>
            Total:
          </Text>
          <Text className="text-red-600 font-bold text-lg">{formatPrice(order.totalPrice)}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-end space-x-3 mt-6">
        {order.orderDetailsGrouped.some((group) => group.orderItemStatus === 1) && (
          order.orderStatusId === '3' ? (
            <TouchableOpacity
              className="bg-red-500 rounded-md px-4 py-2"
              onPress={() => onCancelCashPayment(order.orderId)}
            >
              <Text className="text-white font-semibold">Cancel Order</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-red-500 rounded-md px-4 py-2"
              onPress={() => onCancelClick(order.orderId, order.orderDetailsGrouped[0].sellerId)}
            >
              <Text className="text-white font-semibold">Cancel Order</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}