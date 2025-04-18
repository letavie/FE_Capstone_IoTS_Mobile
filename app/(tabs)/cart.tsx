// app/(tabs)/cart.tsx
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Link, useRouter } from 'expo-router';
import { TrashIcon, PlusIcon, MinusIcon } from 'react-native-heroicons/outline';
import {
  fetchCarts,
  addToCart,
  updateCartQuantity,
  deleteCartItem,
  selectCartItem,
  unselectCartItem,
  getCartTotalInformation,
  fetchComboIncludedLabs,
  ProductType,
} from '../../services/slices/cartApi';
import { CartItem, Lab, CartResponse, TotalInformation } from '@/types/cart';

// Fallback icon component
const FallbackIcon = () => null;
const SafeTrashIcon = TrashIcon || FallbackIcon;
const SafePlusIcon = PlusIcon || FallbackIcon;
const SafeMinusIcon = MinusIcon || FallbackIcon;

export default function Cart() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalSelectedItemsPrice, setTotalSelectedItemsPrice] = useState<number>(0);
  const [includedLabs, setIncludedLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentCartId, setCurrentCartId] = useState<number | null>(null);

  const pageIndex = 0;
  const pageSize = 100;

  const fetchCartData = async () => {
    setLoading(true);
    setError(null);
    try {
      const cartData: CartResponse = await fetchCarts({ pageIndex, pageSize });
      setCart(cartData.data);
      setTotalCount(cartData.totalCount);
      const totalData: TotalInformation = await getCartTotalInformation();
      setTotalSelectedItemsPrice(totalData.totalSelectedItemsPrice);
    } catch (err: any) {
      setError(err.message || 'Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleDelete = async (cartId: number) => {
    try {
      await deleteCartItem({ cartId });
      fetchCartData();
    } catch (err) {
      // Error handled in cartApi
    }
  };

  const handleCheckBox = async (cartId: number, isChecked: boolean) => {
    try {
      if (isChecked) {
        await selectCartItem({ cartId });
      } else {
        await unselectCartItem({ cartId });
      }
      fetchCartData();
    } catch (err) {
      // Error handled in cartApi
    }
  };

  const handleViewIncludedLabs = async (cartId: number) => {
    try {
      const labs = await fetchComboIncludedLabs({ cartId });
      setIncludedLabs(labs);
      setCurrentCartId(cartId);
      setIsModalVisible(true);
    } catch (err) {
      // Error handled in cartApi
    }
  };

  const handleUnselectLab = async (labCartId: number) => {
    try {
      await deleteCartItem({ cartId: labCartId });
      if (currentCartId) {
        const labs = await fetchComboIncludedLabs({ cartId: currentCartId });
        setIncludedLabs(labs);
      }
      fetchCartData();
    } catch (err) {
      // Error handled in cartApi
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setCurrentCartId(null);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const QuantityControl = ({ quantity, cartId }: { quantity: number; cartId: number }) => {
    const handleUpdateQuantity = async (newQuantity: number) => {
      try {
        await updateCartQuantity({ cartId, quantity: newQuantity });
        fetchCartData();
      } catch (err) {
        // Error handled in cartApi
      }
    };

    return (
      <View className="flex-row items-center bg-gray-100 rounded-full">
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(Math.max(1, quantity - 1))}
          className="p-2"
          disabled={quantity <= 1}
        >
          <SafeMinusIcon
            size={20}
            color={quantity <= 1 ? colors.mutedForeground : colors.foreground}
          />
        </TouchableOpacity>
        <Text
          className="px-4 py-1 text-base"
          style={{ color: colors.foreground }}
        >
          {quantity}
        </Text>
        <TouchableOpacity
          onPress={() => handleUpdateQuantity(quantity + 1)}
          className="p-2"
        >
          <SafePlusIcon size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const detailPath =
      item.productType === ProductType.COMBO
        ? `/detail-combo/${item.productId}`
        : `/detail/${item.productId}`;

    return (
      <View
        className="flex-row items-center p-4 border-b"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
      >
        <TouchableOpacity
          onPress={() => handleCheckBox(item.id, !item.isSelected)}
          className="mr-4"
        >
          <View
            className={`w-6 h-6 rounded border-2 ${
              item.isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
            }`}
          >
            {item.isSelected && (
              <Text className="text-white text-center font-bold">✓</Text>
            )}
          </View>
        </TouchableOpacity>
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/64' }}
          style={{ width: 64, height: 64, borderRadius: 8 }}
          resizeMode="cover"
        />
        <View className="flex-1 ml-4">
          <Link href={detailPath as any}>
            <Text
              className="text-base font-medium line-clamp-2"
              style={{ color: colors.foreground }}
            >
              {item.productName}
            </Text>
          </Link>
          <Text className="text-sm mt-1" style={{ color: colors.mutedForeground }}>
            Price: {formatPrice(item.price)} VND
          </Text>
          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
            Total: {formatPrice(item.totalPrice)} VND
          </Text>
          <QuantityControl quantity={item.quantity} cartId={item.id} />
          {item.productType === ProductType.COMBO && item.numberOfIncludedLabs > 0 && (
            <TouchableOpacity
              onPress={() => handleViewIncludedLabs(item.id)}
              className="mt-2"
            >
              <Text className="text-sm text-blue-600">
                View Included Labs ({item.numberOfIncludedLabs})
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)} className="ml-4">
          <SafeTrashIcon size={24} color={colors.destructive} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderLabItem = ({ item }: { item: Lab }) => (
    <View
      className="flex-row items-center p-4 border-b"
      style={{ borderColor: colors.border }}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/48' }}
        style={{ width: 48, height: 48, borderRadius: 8 }}
        resizeMode="cover"
      />
      <View className="flex-1 ml-4">
        <Text className="text-base font-medium" style={{ color: colors.foreground }}>
          {item.labName}
        </Text>
        <Text className="text-sm" style={{ color: colors.mutedForeground }}>
          {item.labSummary}
        </Text>
        <Text className="text-sm" style={{ color: colors.mutedForeground }}>
          Price: {formatPrice(item.price)} VND
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleUnselectLab(item.id)}>
        <SafeTrashIcon size={24} color={colors.destructive} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {totalCount > 0 ? (
        <FlatList
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={<View className="h-24" />}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg italic" style={{ color: colors.mutedForeground }}>
            Your cart is empty.
          </Text>
        </View>
      )}
      {totalCount > 0 && (
        <View
          className="p-4 border-t shadow-lg absolute bottom-0 left-0 right-0"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-1">
              <Text
                className="text-sm font-medium"
                style={{ color: colors.mutedForeground }}
              >
                Total Price:
              </Text>
              <Text
                className="text-xl font-bold"
                style={{ color: colors.primary }}
              >
                {formatPrice(totalSelectedItemsPrice)} VND
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/checkout' as any)}
              className="flex-1 py-3 rounded-lg bg-blue-600"
              disabled={totalSelectedItemsPrice === 0}
            >
              <Text
                className="text-center text-base font-semibold text-white"
              >
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-4 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.foreground }}
              >
                Included Labs
              </Text>
              <TouchableOpacity onPress={handleModalClose}>
                <Text className="text-blue-600 text-base">Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={includedLabs}
              renderItem={renderLabItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <Text
                  className="text-center text-sm italic"
                  style={{ color: colors.mutedForeground }}
                >
                  No labs included.
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}