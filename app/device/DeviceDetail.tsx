import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getIotDeviceDetails, IotDeviceDetail } from '@/services/slices/productApi';
import ReanimatedCarousel from 'react-native-reanimated-carousel';
import { StarIcon, ChatBubbleLeftIcon, ShoppingBagIcon, PlusIcon, MinusIcon } from 'react-native-heroicons/outline';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Review {
  createdBy: number;
  rating: number;
  createdDate: string;
  content: string;
}

// Fallback component for missing icons
const FallbackIcon = () => null;

const SafeStarIcon = StarIcon || FallbackIcon;
const SafeChatBubbleLeftIcon = ChatBubbleLeftIcon || FallbackIcon;
const SafeShoppingBagIcon = ShoppingBagIcon || FallbackIcon;
const SafePlusIcon = PlusIcon || FallbackIcon;
const SafeMinusIcon = MinusIcon || FallbackIcon;

export default function DeviceDetail() {
  const { colors } = useThemeColors();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [device, setDevice] = useState<IotDeviceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'details', title: 'Details' },
    { key: 'reviews', title: 'Reviews' },
  ]);

  const fetchDeviceDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Received ID from useLocalSearchParams:', id);
      if (!id || typeof id !== 'string' || isNaN(parseInt(id, 10))) {
        throw new Error('Invalid device ID');
      }
      const deviceId = parseInt(id, 10);
      console.log('Parsed Device ID:', deviceId);
      const response = await getIotDeviceDetails(deviceId);
      setDevice(response);

      // Create list of images
      const images = [
        response.imageUrl,
        ...(response.attachments?.map((img) => img.imageUrl) || []),
      ].filter(Boolean);
      setAllImages(images);
    } catch (err: any) {
      setError(err.message || 'Failed to load device details.');
      console.error('Error fetching device details:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeviceDetails();
  }, [id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDeviceDetails();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const calculateMonthsSince = (dateString: string) => {
    const createdDate = new Date(dateString);
    const currentDate = new Date();
    const yearsDifference = currentDate.getFullYear() - createdDate.getFullYear();
    const monthsDifference = currentDate.getMonth() - createdDate.getMonth();
    return yearsDifference * 12 + monthsDifference;
  };

  const handleAddToCart = () => {
    if (!device || device.quantity <= 0) {
      alert('The product is out of stock.');
      return;
    }
    // TODO: Implement add to cart logic
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const renderCarouselItem = useCallback(
    ({ item }: { item: string }) => (
      <Image
        source={{ uri: item }}
        style={{ width: SCREEN_WIDTH - 32, height: 200, borderRadius: 8 }}
        resizeMode="contain"
      />
    ),
    []
  );

  const renderReviewItem = useCallback(
    ({ item }: { item: Review }) => (
      <View className="bg-card rounded-lg p-4 mb-4" style={{ backgroundColor: colors.card }}>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-semibold" style={{ color: colors.foreground }}>
            {`Anonymous ${item.createdBy}`}
          </Text>
          <View className="flex-row">
            {[...Array(5)].map((_, i) => (
              <SafeStarIcon
                key={i}
                size={16}
                color={i < item.rating ? colors.primary : colors.mutedForeground}
              />
            ))}
          </View>
        </View>
        <Text className="text-xs mb-2" style={{ color: colors.mutedForeground }}>
          {new Date(item.createdDate).toLocaleString('en-EN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </Text>
        <Text className="text-sm" style={{ color: colors.foreground }}>
          {item.content || 'No comment'}
        </Text>
      </View>
    ),
    [colors]
  );

  const reviewItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 120, // Approximate height of a review item
      offset: 120 * index,
      index,
    }),
    []
  );

  const DetailsTab = () => {
    const deviceNonNull = device as IotDeviceDetail;

    return (
      <ScrollView className="p-4">
        {deviceNonNull.summary && (
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
              Summary
            </Text>
            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
              {deviceNonNull.summary}
            </Text>
          </View>
        )}
        {deviceNonNull.description && (
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
              Description
            </Text>
            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
              {deviceNonNull.description}
            </Text>
          </View>
        )}
        {(deviceNonNull.weight || deviceNonNull.warrantyMonth || deviceNonNull.category?.label || deviceNonNull.model) && (
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
              Basic Information
            </Text>
            <View className="flex-row flex-wrap">
              {deviceNonNull.weight !== undefined && deviceNonNull.weight !== null && (
                <View className="w-1/2 mb-2">
                  <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                    Weight
                  </Text>
                  <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                    {deviceNonNull.weight} kg
                  </Text>
                </View>
              )}
              {deviceNonNull.warrantyMonth !== undefined && deviceNonNull.warrantyMonth !== null && (
                <View className="w-1/2 mb-2">
                  <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                    Warranty
                  </Text>
                  <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                    {deviceNonNull.warrantyMonth} months
                  </Text>
                </View>
              )}
              {deviceNonNull.category?.label && (
                <View className="w-1/2 mb-2">
                  <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                    Category
                  </Text>
                  <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                    {deviceNonNull.category.label}
                  </Text>
                </View>
              )}
              {deviceNonNull.model && (
                <View className="w-1/2 mb-2">
                  <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                    Model
                  </Text>
                  <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                    {deviceNonNull.model}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        {deviceNonNull.specifications && (
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
              Specifications
            </Text>
            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
              {deviceNonNull.specifications}
            </Text>
          </View>
        )}
        {deviceNonNull.deviceSpecificationsList && deviceNonNull.deviceSpecificationsList.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
              Technical Specifications
            </Text>
            {deviceNonNull.deviceSpecificationsList.map((specGroup, index) => (
              <View key={index} className="mb-4">
                {specGroup.name && (
                  <Text className="font-medium mb-2" style={{ color: colors.foreground }}>
                    {specGroup.name}
                  </Text>
                )}
                {specGroup.deviceSpecificationItemsList?.length > 0 && (
                  <View>
                    {specGroup.deviceSpecificationItemsList.map((item, itemIndex) => (
                      <View key={itemIndex} className="flex-row justify-between py-2 border-b" style={{ borderColor: colors.border }}>
                        <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                          {item.specificationProperty || 'N/A'}
                        </Text>
                        <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                          {item.specificationValue || 'N/A'}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  const ReviewsTab = () => (
    <FlatList
      data={[] /* TODO: Replace with actual feedback data */}
      renderItem={renderReviewItem}
      keyExtractor={(item: Review, index: number) => `review-${index}`}
      getItemLayout={reviewItemLayout}
      ListEmptyComponent={
        <View className="p-4">
          <Text className="text-center text-sm italic" style={{ color: colors.mutedForeground }}>
            There are currently no reviews for this product. Be the first to share your thoughts!
          </Text>
        </View>
      }
    />
  );

  const renderScene = SceneMap({
    details: DetailsTab,
    reviews: ReviewsTab,
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !device) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <Text className="text-center text-sm" style={{ color: colors.destructive }}>
          {error || 'Device not found.'}
        </Text>
      </View>
    );
  }

  const joinedMonths = calculateMonthsSince(device.storeInfo.createdDate);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header with Back Button */}
      {/* <View className="flex-row items-center p-4 border-b" style={{ borderColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-semibold" style={{ color: colors.foreground }}>
          Device Detail
        </Text>
      </View> */}

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Image Carousel */}
        <ReanimatedCarousel
          width={SCREEN_WIDTH - 32}
          height={200}
          data={allImages.length > 0 ? allImages : ['https://via.placeholder.com/200']}
          renderItem={renderCarouselItem}
          loop
          autoPlay
          autoPlayInterval={3000}
          style={{ alignSelf: 'center' }}
        />

        {/* Product Info */}
        <View className="p-4">
          <Text className="text-2xl font-bold mb-2" style={{ color: colors.foreground }}>
            {device.name}
          </Text>
          <Text className="text-sm mb-4" style={{ color: colors.mutedForeground }}>
            {device.summary}
          </Text>
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-sm" style={{ color: colors.foreground }}>
                Available: {device.quantity}
              </Text>
              <Text className="text-sm" style={{ color: device.quantity > 0 ? colors.primary : colors.destructive }}>
                {device.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
            <View>
              <Text className="text-sm" style={{ color: colors.foreground }}>
                Category: {device.category.label || 'N/A'}
              </Text>
              <Text className="text-sm" style={{ color: colors.foreground }}>
                Brand: {device.manufacturer || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Store Info */}
          <View className="bg-card rounded-lg p-4 mb-4" style={{ backgroundColor: colors.card }}>
            <View className="flex-row items-center">
              <Image
                source={{ uri: device.storeInfo.imageUrl || 'https://via.placeholder.com/48' }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
                resizeMode="cover"
              />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold" style={{ color: colors.foreground }}>
                  {device.storeInfo.name}
                </Text>
                <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                  Joined {joinedMonths} months ago
                </Text>
              </View>
            </View>
            <View className="flex-row mt-4">
              <TouchableOpacity className="flex-1 mr-2 p-2 rounded-lg border flex-row justify-center items-center" style={{ borderColor: colors.primary }}>
                <SafeChatBubbleLeftIcon size={20} color={colors.primary} />
                <Text className="ml-2 text-sm" style={{ color: colors.primary }}>
                  Chat Now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => alert('Store navigation not implemented yet.')}
                className="flex-1 ml-2 p-2 rounded-lg border flex-row justify-center items-center"
                style={{ borderColor: colors.border }}
              >
                <SafeShoppingBagIcon size={20} color={colors.foreground} />
                <Text className="ml-2 text-sm" style={{ color: colors.foreground }}>
                  View Shop
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Tabs for Product Details and Reviews */}
      <View className="flex-1">
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: SCREEN_WIDTH }}
          renderTabBar={(props: any) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: colors.primary }}
              style={{ backgroundColor: colors.card }}
              labelStyle={{ color: colors.foreground, fontWeight: 'bold' }}
            />
          )}
        />
      </View>

      {/* Sticky Price, Quantity, and Add to Cart */}
      <View className="p-4 border-t" style={{ borderColor: colors.border, backgroundColor: colors.card }}>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold" style={{ color: colors.primary }}>
            {formatPrice(device.price)} VND
          </Text>
          <View className="flex-row items-center">
            <Text className="text-sm font-semibold mr-4" style={{ color: colors.foreground }}>
              Quantity:
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 rounded-lg border"
              style={{ borderColor: colors.border }}
            >
              <SafeMinusIcon size={20} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="mx-4 text-lg" style={{ color: colors.foreground }}>
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity(Math.min(device.quantity || 10, quantity + 1))}
              className="p-2 rounded-lg border"
              style={{ borderColor: colors.border }}
            >
              <SafePlusIcon size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleAddToCart}
          className="p-4 rounded-lg"
          style={{ backgroundColor: '#FBBF24' }}
        >
          <Text className="text-center font-semibold text-white">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}