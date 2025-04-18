
// import { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
//   Dimensions,
//   RefreshControl,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useThemeColors } from '../../hooks/useThemeColors';
// import { getIotDeviceDetails, IotDeviceDetail } from '@/services/slices/productApi';
// import ReanimatedCarousel from 'react-native-reanimated-carousel';
// import { StarIcon, ChatBubbleLeftIcon, ShoppingBagIcon, PlusIcon, MinusIcon } from 'react-native-heroicons/outline';
// import { Ionicons } from '@expo/vector-icons';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// interface Review {
//   createdBy: number;
//   rating: number;
//   createdDate: string;
//   content: string;
// }

// // Fallback component for missing icons
// const FallbackIcon = () => null;

// const SafeStarIcon = StarIcon || FallbackIcon;
// const SafeChatBubbleLeftIcon = ChatBubbleLeftIcon || FallbackIcon;
// const SafeShoppingBagIcon = ShoppingBagIcon || FallbackIcon;
// const SafePlusIcon = PlusIcon || FallbackIcon;
// const SafeMinusIcon = MinusIcon || FallbackIcon;

// export default function DeviceDetail() {
//   const { colors } = useThemeColors();
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const [device, setDevice] = useState<IotDeviceDetail | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [allImages, setAllImages] = useState<string[]>([]);
//   const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

//   const fetchDeviceDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       console.log('Received ID from useLocalSearchParams:', id);
//       if (!id || typeof id !== 'string' || isNaN(parseInt(id, 10))) {
//         throw new Error('Invalid device ID');
//       }
//       const deviceId = parseInt(id, 10);
//       console.log('Parsed Device ID:', deviceId);
//       const response = await getIotDeviceDetails(deviceId);
//       setDevice(response);

//       // Create list of images
//       const images = [
//         response.imageUrl,
//         ...(response.attachments?.map((img) => img.imageUrl) || []),
//       ].filter(Boolean);
//       setAllImages(images);
//     } catch (err: any) {
//       setError(err.message || 'Failed to load device details.');
//       console.error('Error fetching device details:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchDeviceDetails();
//   }, [id]);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchDeviceDetails();
//   }, []);

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('vi-VN').format(price);
//   };

//   const calculateMonthsSince = (dateString: string) => {
//     const createdDate = new Date(dateString);
//     const currentDate = new Date();
//     const yearsDifference = currentDate.getFullYear() - createdDate.getFullYear();
//     const monthsDifference = currentDate.getMonth() - createdDate.getMonth();
//     return yearsDifference * 12 + monthsDifference;
//   };

//   const handleAddToCart = () => {
//     if (!device || device.quantity <= 0) {
//       alert('The product is out of stock.');
//       return;
//     }
//     alert(`Added ${quantity} item(s) to cart!`);
//   };

//   const renderCarouselItem = useCallback(
//     ({ item }: { item: string }) => (
//       <Image
//         source={{ uri: item }}
//         style={{ width: SCREEN_WIDTH - 32, height: 200, borderRadius: 8 }}
//         resizeMode="contain"
//       />
//     ),
//     []
//   );

//   const renderReviewItem = useCallback(
//     ({ item }: { item: Review }) => (
//       <View className="bg-card rounded-lg p-4 mb-4" style={{ backgroundColor: colors.card }}>
//         <View className="flex-row justify-between items-center mb-2">
//           <Text className="font-semibold" style={{ color: colors.foreground }}>
//             {`Anonymous ${item.createdBy}`}
//           </Text>
//           <View className="flex-row">
//             {[...Array(5)].map((_, i) => (
//               <SafeStarIcon
//                 key={i}
//                 size={16}
//                 color={i < item.rating ? colors.primary : colors.mutedForeground}
//               />
//             ))}
//           </View>
//         </View>
//         <Text className="text-xs mb-2" style={{ color: colors.mutedForeground }}>
//           {new Date(item.createdDate).toLocaleString('en-EN', {
//             dateStyle: 'medium',
//             timeStyle: 'short',
//           })}
//         </Text>
//         <Text className="text-sm" style={{ color: colors.foreground }}>
//           {item.content || 'No comment'}
//         </Text>
//       </View>
//     ),
//     [colors]
//   );

//   const reviewItemLayout = useCallback(
//     (_: any, index: number) => ({
//       length: 120,
//       offset: 120 * index,
//       index,
//     }),
//     []
//   );

//   const DetailsTab = () => {
//     const deviceNonNull = device as IotDeviceDetail;

//     return (
//       <View className="p-4">
//         {deviceNonNull.summary && (
//           <View className="mb-4">
//             <Text className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
//               Summary
//             </Text>
//             <Text className="text-sm" style={{ color: colors.mutedForeground }}>
//               {deviceNonNull.summary}
//             </Text>
//           </View>
//         )}
//         {deviceNonNull.description && (
//           <View className="mb-4">
//             <Text className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
//               Description
//             </Text>
//             <Text className="text-sm" style={{ color: colors.mutedForeground }}>
//               {deviceNonNull.description}
//             </Text>
//           </View>
//         )}
//         {(deviceNonNull.weight || deviceNonNull.warrantyMonth || deviceNonNull.category?.label || deviceNonNull.model) && (
//           <View className="mb-4">
//             <Text className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
//               Basic Information
//             </Text>
//             <View className="flex-row flex-wrap">
//               {deviceNonNull.weight !== undefined && deviceNonNull.weight !== null && (
//                 <View className="w-1/2 mb-2">
//                   <Text className="text-sm" style={{ color: colors.mutedForeground }}>
//                     Weight
//                   </Text>
//                   <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
//                     {deviceNonNull.weight} kg
//                   </Text>
//                 </View>
//               )}
//               {deviceNonNull.warrantyMonth !== undefined && deviceNonNull.warrantyMonth !== null && (
//                 <View className="w-1/2 mb-2">
//                   <Text className="text-sm" style={{ color: colors.mutedForeground }}>
//                     Warranty
//                   </Text>
//                   <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
//                     {deviceNonNull.warrantyMonth} months
//                   </Text>
//                 </View>
//               )}
//               {deviceNonNull.category?.label && (
//                 <View className="w-1/2 mb-2">
//                   <Text className="text-sm" style={{ color: colors.mutedForeground }}>
//                     Category
//                   </Text>
//                   <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
//                     {deviceNonNull.category.label}
//                   </Text>
//                 </View>
//               )}
//               {deviceNonNull.model && (
//                 <View className="w-1/2 mb-2">
//                   <Text className="text-sm" style={{ color: colors.mutedForeground }}>
//                     Model
//                   </Text>
//                   <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
//                     {deviceNonNull.model}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           </View>
//         )}
//         {deviceNonNull.specifications && (
//           <View className="mb-4">
//             <Text className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
//               Specifications
//             </Text>
//             <Text className="text-sm" style={{ color: colors.mutedForeground }}>
//               {deviceNonNull.specifications}
//             </Text>
//           </View>
//         )}
//         {deviceNonNull.deviceSpecificationsList && deviceNonNull.deviceSpecificationsList.length > 0 && (
//           <View className="mb-4">
//             <Text className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
//               Technical Specifications
//             </Text>
//             {deviceNonNull.deviceSpecificationsList.map((specGroup, index) => (
//               <View key={index} className="mb-4">
//                 {specGroup.name && (
//                   <Text className="font-medium mb-2" style={{ color: colors.foreground }}>
//                     {specGroup.name}
//                   </Text>
//                 )}
//                 {specGroup.deviceSpecificationItemsList?.length > 0 && (
//                   <View>
//                     {specGroup.deviceSpecificationItemsList.map((item, itemIndex) => (
//                       <View key={itemIndex} className="flex-row justify-between py-2 border-b" style={{ borderColor: colors.border }}>
//                         <Text className="text-sm" style={{ color: colors.mutedForeground }}>
//                           {item.specificationProperty || 'N/A'}
//                         </Text>
//                         <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
//                           {item.specificationValue || 'N/A'}
//                         </Text>
//                       </View>
//                     ))}
//                   </View>
//                 )}
//               </View>
//             ))}
//           </View>
//         )}
//       </View>
//     );
//   };

//   const ReviewsTab = () => (
//     <View className="p-4">
//       <FlatList
//         data={[] /* TODO: Replace with actual feedback data */}
//         renderItem={renderReviewItem}
//         keyExtractor={(item: Review, index: number) => `review-${index}`}
//         getItemLayout={reviewItemLayout}
//         ListEmptyComponent={
//           <View className="p-4">
//             <Text className="text-center text-sm italic" style={{ color: colors.mutedForeground }}>
//               There are currently no reviews for this product. Be the first to share your thoughts!
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   if (error || !device) {
//     return (
//       <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
//         <Text className="text-center text-sm" style={{ color: colors.destructive }}>
//           {error || 'Device not found.'}
//         </Text>
//       </View>
//     );
//   }

//   const joinedMonths = calculateMonthsSince(device.storeInfo.createdDate);

//   return (
//     <View className="flex-1" style={{ backgroundColor: colors.background }}>
//       <ScrollView
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
//         }
//       >
//         {/* Image Carousel */}
//         <ReanimatedCarousel
//           width={SCREEN_WIDTH - 32}
//           height={200}
//           data={allImages.length > 0 ? allImages : ['https://via.placeholder.com/200']}
//           renderItem={renderCarouselItem}
//           loop
//           autoPlay
//           autoPlayInterval={3000}
//           style={{ alignSelf: 'center', marginTop: 16 }}
//         />

//         {/* Product Info */}
//         <View className="p-4">
//           <Text className="text-2xl font-bold mb-2" style={{ color: colors.foreground }}>
//             {device.name}
//           </Text>
//           <Text className="text-sm mb-4" style={{ color: colors.mutedForeground }}>
//             {device.summary}
//           </Text>
//           <View className="flex-row justify-between mb-4">
//             <View>
//               <Text className="text-sm" style={{ color: colors.foreground }}>
//                 Available: {device.quantity}
//               </Text>
//               <Text
//                 className="text-sm"
//                 style={{ color: device.quantity > 0 ? colors.primary : colors.destructive }}
//               >
//                 {device.quantity > 0 ? 'In Stock' : 'Out of Stock'}
//               </Text>
//             </View>
//             <View>
//               <Text className="text-sm" style={{ color: colors.foreground }}>
//                 Category: {device.category.label || 'N/A'}
//               </Text>
//               <Text className="text-sm" style={{ color: colors.foreground }}>
//                 Brand: {device.manufacturer || 'N/A'}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Store Info */}
//         <View className="p-4">
//           <View className="bg-card rounded-lg p-4 mb-4" style={{ backgroundColor: colors.card }}>
//             <View className="flex-row items-center">
//               <Image
//                 source={{ uri: device.storeInfo.imageUrl || 'https://via.placeholder.com/48' }}
//                 style={{ width: 48, height: 48, borderRadius: 24 }}
//                 resizeMode="cover"
//               />
//               <View className="ml-4 flex-1">
//                 <Text className="text-lg font-semibold" style={{ color: colors.foreground }}>
//                   {device.storeInfo.name}
//                 </Text>
//                 <Text className="text-sm" style={{ color: colors.mutedForeground }}>
//                   Joined {joinedMonths} months ago
//                 </Text>
//               </View>
//             </View>
//             <View className="flex-row mt-4">
//               <TouchableOpacity
//                 className="flex-1 mr-2 p-2 rounded-lg border flex-row justify-center items-center"
//                 style={{ borderColor: colors.primary }}
//               >
//                 <SafeChatBubbleLeftIcon size={20} color={colors.primary} />
//                 <Text className="ml-2 text-sm" style={{ color: colors.primary }}>
//                   Chat Now
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => alert('Store navigation not implemented yet.')}
//                 className="flex-1 ml-2 p-2 rounded-lg border flex-row justify-center items-center"
//                 style={{ borderColor: colors.border }}
//               >
//                 <SafeShoppingBagIcon size={20} color={colors.foreground} />
//                 <Text className="ml-2 text-sm" style={{ color: colors.foreground }}>
//                   View Shop
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* Tab-like Navigation for Details and Reviews */}
//         <View
//           className="flex-row p-4 border-b"
//           style={{ borderColor: colors.border, backgroundColor: colors.card }}
//         >
//           <TouchableOpacity
//             onPress={() => setActiveTab('details')}
//             className="flex-1 p-2"
//             style={{
//               borderBottomWidth: activeTab === 'details' ? 2 : 0,
//               borderBottomColor: colors.primary,
//             }}
//           >
//             <Text
//               className="text-center font-semibold"
//               style={{ color: activeTab === 'details' ? colors.primary : colors.foreground }}
//             >
//               Details
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setActiveTab('reviews')}
//             className="flex-1 p-2"
//             style={{
//               borderBottomWidth: activeTab === 'reviews' ? 2 : 0,
//               borderBottomColor: colors.primary,
//             }}
//           >
//             <Text
//               className="text-center font-semibold"
//               style={{ color: activeTab === 'reviews' ? colors.primary : colors.foreground }}
//             >
//               Reviews
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Tab Content */}
//         {activeTab === 'details' ? <DetailsTab /> : <ReviewsTab />}
//       </ScrollView>

//       {/* Sticky Price, Quantity, and Add to Cart */}
//       <View className="p-4 border-t" style={{ borderColor: colors.border, backgroundColor: colors.card }}>
//         <View className="flex-row items-center justify-between mb-4">
//           <Text className="text-lg font-semibold" style={{ color: colors.primary }}>
//             {formatPrice(device.price)} VND
//           </Text>
//           <View className="flex-row items-center">
//             <Text className="text-sm font-semibold mr-4" style={{ color: colors.foreground }}>
//               Quantity:
//             </Text>
//             <TouchableOpacity
//               onPress={() => setQuantity(Math.max(1, quantity - 1))}
//               className="p-2 rounded-lg border"
//               style={{ borderColor: colors.border }}
//             >
//               <SafeMinusIcon size={20} color={colors.foreground} />
//             </TouchableOpacity>
//             <Text className="mx-4 text-lg" style={{ color: colors.foreground }}>
//               {quantity}
//             </Text>
//             <TouchableOpacity
//               onPress={() => setQuantity(Math.min(device.quantity || 10, quantity + 1))}
//               className="p-2 rounded-lg border"
//               style={{ borderColor: colors.border }}
//             >
//               <SafePlusIcon size={20} color={colors.foreground} />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <TouchableOpacity
//           onPress={handleAddToCart}
//           className="p-4 rounded-lg"
//           style={{ backgroundColor: '#FBBF24' }}
//         >
//           <Text className="text-center font-semibold text-white">Add to Cart</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getIotDeviceDetails, IotDeviceDetail } from '@/services/slices/productApi';
import ReanimatedCarousel from 'react-native-reanimated-carousel';
import { StarIcon, ChatBubbleLeftIcon, ShoppingBagIcon, PlusIcon, MinusIcon } from 'react-native-heroicons/outline';
import { Ionicons } from '@expo/vector-icons';

import { addToCart, ProductType } from '@/services/slices/cartApi';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
import asyncStorageService from '@/services/storage/AsyncStorageService';
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
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

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

  // const handleAddToCart = () => {
  //   if (!device || device.quantity <= 0) {
  //     alert('The product is out of stock.');
  //     return;
  //   }
  //   alert(`Added ${quantity} item(s) to cart!`);
  // };
  const handleAddToCart = async () => {
    if (!device || device.quantity <= 0) {
      alert('The product is out of stock.');
      return;
    }
    try {
      const token = await asyncStorageService.getItem<string>('token');
      console.log('Token before addToCart:', token ? 'Present' : 'Missing');
      const productId = parseInt(id as string, 10);
      console.log('Adding to cart:', { productId, productType: ProductType.IOT_DEVICE, quantity });
      await addToCart({
        productId,
        productType: ProductType.IOT_DEVICE,
        quantity,
      });
      setQuantity(1);
    } catch (err: any) {
      console.error('handleAddToCart error:', err);
      // Error handled in cartApi, but log for debugging
    }
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
    (item: Review, index: number) => (
      <View
        key={`review-${index}`}
        className="bg-card rounded-lg p-4 mb-4"
        style={{ backgroundColor: colors.card }}
      >
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

  const DetailsTab = () => {
    const deviceNonNull = device as IotDeviceDetail;

    return (
      <View className="p-4">
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
        {(deviceNonNull.weight ||
          deviceNonNull.warrantyMonth ||
          deviceNonNull.category?.label ||
          deviceNonNull.model) && (
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
              {deviceNonNull.warrantyMonth !== undefined &&
                deviceNonNull.warrantyMonth !== null && (
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
        {deviceNonNull.deviceSpecificationsList &&
          deviceNonNull.deviceSpecificationsList.length > 0 && (
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
                        <View
                          key={itemIndex}
                          className="flex-row justify-between py-2 border-b"
                          style={{ borderColor: colors.border }}
                        >
                          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                            {item.specificationProperty || 'N/A'}
                          </Text>
                          <Text
                            className="text-sm font-medium"
                            style={{ color: colors.foreground }}
                          >
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
      </View>
    );
  };

  const ReviewsTab = () => {
    const reviews: Review[] = []; // TODO: Replace with actual feedback data

    return (
      <View className="p-4">
        {reviews.length === 0 ? (
          <View className="p-4">
            <Text className="text-center text-sm italic" style={{ color: colors.mutedForeground }}>
              There are currently no reviews for this product. Be the first to share your thoughts!
            </Text>
          </View>
        ) : (
          reviews.map((item, index) => renderReviewItem(item, index))
        )}
      </View>
    );
  };

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
      <ScrollView
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
          style={{ alignSelf: 'center', marginTop: 16 }}
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
              <Text
                className="text-sm"
                style={{ color: device.quantity > 0 ? colors.primary : colors.destructive }}
              >
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
        </View>

        {/* Store Info */}
        <View className="p-4">
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
              <TouchableOpacity
                className="flex-1 mr-2 p-2 rounded-lg border flex-row justify-center items-center"
                style={{ borderColor: colors.primary }}
              >
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

        {/* Tab-like Navigation for Details and Reviews */}
        <View
          className="flex-row p-4 border-b"
          style={{ borderColor: colors.border, backgroundColor: colors.card }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('details')}
            className="flex-1 p-2"
            style={{
              borderBottomWidth: activeTab === 'details' ? 2 : 0,
              borderBottomColor: colors.primary,
            }}
          >
            <Text
              className="text-center font-semibold"
              style={{ color: activeTab === 'details' ? colors.primary : colors.foreground }}
            >
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('reviews')}
            className="flex-1 p-2"
            style={{
              borderBottomWidth: activeTab === 'reviews' ? 2 : 0,
              borderBottomColor: colors.primary,
            }}
          >
            <Text
              className="text-center font-semibold"
              style={{ color: activeTab === 'reviews' ? colors.primary : colors.foreground }}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'details' ? <DetailsTab /> : <ReviewsTab />}
      </ScrollView>

      {/* Sticky Price, Quantity, and Add to Cart */}
      <View
  className="p-4 border-t"
  style={{ borderColor: colors.border, backgroundColor: colors.card }}
>
  <View className="flex-row items-center justify-between mb-4">
    <Text className="text-lg font-semibold" style={{ color: colors.primary }}>
      {formatPrice(device.price * quantity)} VND
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
      {/* <View
        className="p-4 border-t"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
      >
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
      </View> */}
    </View>
  );
}