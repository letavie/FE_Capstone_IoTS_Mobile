

// import { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   TextInput,
//   TouchableOpacity,
// } from 'react-native';
// import { useThemeColors } from '../../hooks/useThemeColors';
// import { getIotDevices, IotDevice, PaginationParams } from '@/services/slices/productApi';
// import { ProductType } from '@/constants/ProductType';
// import DeviceItem from '@/components/DeviceItem';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import Toast from 'react-native-toast-message';
// import { debounce } from 'lodash';

// const showToast = (type: 'success' | 'error' | 'info', message: string, description?: string) => {
//   Toast.show({
//     type: type,
//     text1: message,
//     text2: description || '',
//     position: 'top',
//     visibilityTime: 3000,
//     topOffset: 50,
//     text1Style: { fontSize: 16, fontWeight: 'bold', color: '#333333' },
//     text2Style: { fontSize: 14, color: '#333333' },
//   });
// };

// // Skeleton Loader Component
// const SkeletonDeviceItem = ({ colors }: { colors: any }) => (
//   <View
//     style={{
//       borderRadius: 12,
//       padding: 8,
//       margin: 8,
//       backgroundColor: colors.card,
//       width: '45%',
//       height: 220,
//     }}
//   >
//     <View style={{ width: '100%', height: 120, backgroundColor: colors.mutedForeground, borderRadius: 8 }} />
//     <View style={{ marginVertical: 4, height: 16, width: '80%', backgroundColor: colors.mutedForeground, borderRadius: 4 }} />
//     <View style={{ height: 16, width: '50%', backgroundColor: colors.mutedForeground, borderRadius: 4 }} />
//     <View style={{ flexDirection: 'row', marginTop: 4 }}>
//       <View style={{ height: 16, width: 16, backgroundColor: colors.mutedForeground, borderRadius: 4 }} />
//       <View style={{ height: 16, width: 30, marginLeft: 4, backgroundColor: colors.mutedForeground, borderRadius: 4 }} />
//     </View>
//   </View>
// );

// export default function DeviceList() {
//   const { colors } = useThemeColors();
//   const router = useRouter();
//   const [devices, setDevices] = useState<IotDevice[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [pageIndex, setPageIndex] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const pageSize = 10;

//   const fetchDevices = useCallback(async (query: string = '', page: number = 0, append: boolean = false) => {
//     if (page > 0 && !hasMore) return;

//     const setLoadingState = page === 0 ? setLoading : setLoadingMore;
//     setLoadingState(true);
//     try {
//       const params: PaginationParams = {
//         pageIndex: page,
//         pageSize,
//         searchKeyword: query,
//         deviceTypeFilter: ProductType.DEVICE,
//       };
//       const response = await getIotDevices(params);
//       const newDevices = response.data || [];
//       setDevices((prev) => (append ? [...prev, ...newDevices] : newDevices));
//       setHasMore(newDevices.length === pageSize);
//     } catch (err: any) {
//       console.error('Error fetching devices:', err); // Log for debugging
//       showToast('error', 'Error', err.message || 'Failed to load devices.');
//     } finally {
//       setLoadingState(false);
//     }
//   }, [hasMore]);

//   // Debounced search handler
//   const debouncedFetchDevices = useRef(
//     debounce((query: string) => {
//       setPageIndex(0);
//       fetchDevices(query, 0);
//     }, 300)
//   ).current;

//   useEffect(() => {
//     debouncedFetchDevices(searchQuery);
//     return () => debouncedFetchDevices.cancel();
//   }, [searchQuery, debouncedFetchDevices]);

//   const handleSearch = (text: string) => {
//     setSearchQuery(text);
//   };

//   const handleLoadMore = () => {
//     if (loading || loadingMore || !hasMore) return;
//     const nextPage = pageIndex + 1;
//     setPageIndex(nextPage);
//     fetchDevices(searchQuery, nextPage, true);
//   };

//   const renderItem = useCallback(
//     ({ item, index }: { item: IotDevice; index: number }) =>
//       loading ? (
//         <SkeletonDeviceItem colors={colors} key={index} />
//       ) : (
//         <DeviceItem item={item} colors={colors} router={router} />
//       ),
//     [colors, loading, router]
//   );

//   const keyExtractor = useCallback((item: IotDevice, index: number) => {
//     // For skeleton items, use the index to ensure uniqueness
//     // For real IotDevice items, item.id will be a number
//     return typeof item.id === 'number' ? `${item.id}-${index}` : `skeleton-${index}`;  }, []);

//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       {/* Search Input */}
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           borderColor: colors.border,
//           borderWidth: 1,
//           borderRadius: 8,
//           margin: 16,
//           backgroundColor: colors.card,
//         }}
//       >
//         <Ionicons
//           name="search"
//           size={20}
//           color={colors.mutedForeground}
//           style={{ marginLeft: 10 }}
//         />
//         <TextInput
//           style={{
//             flex: 1,
//             height: 40,
//             paddingHorizontal: 10,
//             color: colors.foreground,
//           }}
//           placeholder="Search by device name..."
//           placeholderTextColor={colors.mutedForeground}
//           value={searchQuery}
//           onChangeText={handleSearch}
//           accessibilityLabel="Search devices"
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity
//             onPress={() => setSearchQuery('')}
//             style={{ padding: 10 }}
//             accessibilityLabel="Clear search"
//           >
//             <Ionicons name="close-circle" size={20} color={colors.mutedForeground} />
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Device List */}
//       <FlatList
//         data={loading ? Array(4).fill({ id: 'skeleton' }) : devices}
//         renderItem={renderItem}
//         keyExtractor={keyExtractor}
//         numColumns={2}
//         contentContainerStyle={{ padding: 8 }}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={
//           loadingMore ? (
//             <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 16 }} />
//           ) : null
//         }
//         ListEmptyComponent={
//           <Text style={{ textAlign: 'center', color: colors.mutedForeground, marginTop: 20 }}>
//             No devices found.
//           </Text>
//         }
//       />
//     </View>
//   );
// }
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getIotDevices, IotDevice, PaginationParams } from '@/services/slices/productApi';
import { ProductType } from '@/constants/ProductType';
import DeviceItem from '@/components/DeviceItem';
import FilterBar from '@/components/FilterBar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { debounce } from 'lodash';

const showToast = (type: 'success' | 'error' | 'info', message: string, description?: string) => {
  Toast.show({
    type: type,
    text1: message,
    text2: description || '',
    position: 'top',
    visibilityTime: 3000,
    topOffset: 50,
    text1Style: { fontSize: 16, fontWeight: 'bold', color: '#333333' },
    text2Style: { fontSize: 14, color: '#333333' },
  });
};

// Skeleton Loader Component
const SkeletonDeviceItem = ({ colors }: { colors: any }) => (
  <View
    style={{
      borderRadius: 12,
      padding: 8,
      margin: 8,
      backgroundColor: colors.card,
      width: '45%',
      height: 220,
    }}
  >
    <View style={{ width: '100%', height: 120, backgroundColor: colors.mutedForeground, borderRadius: 8 }} />
    <View style={{ marginVertical: 4, height: 16, width: '80%', backgroundColor: colors.mutedForeground, borderRadius: 4 }} />
    <View style={{ height: 16, width: '50%', backgroundColor: colors.mutedForeground, borderRadius: 4 }} />
    <View style={{ flexDirection: 'row', marginTop: 4 }}>
      <View style={{ height: 16, width: 16, backgroundColor: colors.mutedForeground, borderRadius: 4 }} />
      <View style={{ height: 16, width: 30, marginLeft: 4, backgroundColor: colors.mutedForeground, borderRadius: 4 }} />
    </View>
  </View>
);

export default function DeviceList() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const [devices, setDevices] = useState<IotDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priceAsc' | 'priceDesc' | 'rating' | null>(null);
  const [deviceType, setDeviceType] = useState<typeof ProductType[keyof typeof ProductType] | null>(null);
  const pageSize = 10;

  const fetchDevices = useCallback(async (query: string = '', page: number = 0, append: boolean = false) => {
    if (page > 0 && !hasMore) return;

    const setLoadingState = page === 0 ? setLoading : setLoadingMore;
    setLoadingState(true);
    try {
      const params: PaginationParams = {
        pageIndex: page,
        pageSize,
        searchKeyword: query,
        deviceTypeFilter: deviceType ?? undefined,
        sortBy,
      };
      const response = await getIotDevices(params);
      const newDevices = response.data || [];
      console.log('Fetched devices:', newDevices.map(d => ({ id: d.id, name: d.name })));
      setDevices((prev) => (append ? [...prev, ...newDevices] : newDevices));
      setHasMore(newDevices.length === pageSize);
    } catch (err: any) {
      console.error('Error fetching devices:', err);
      showToast('error', 'Error', err.message || 'Failed to load devices.');
    } finally {
      setLoadingState(false);
    }
  }, [hasMore, sortBy, deviceType]);

  // Debounced search handler
  const debouncedFetchDevices = useRef(
    debounce((query: string) => {
      setPageIndex(0);
      fetchDevices(query, 0);
    }, 300)
  ).current;

  useEffect(() => {
    debouncedFetchDevices(searchQuery);
    return () => debouncedFetchDevices.cancel();
  }, [searchQuery, debouncedFetchDevices, sortBy, deviceType]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterChange = useCallback(
    (filters: { sortBy: 'priceAsc' | 'priceDesc' | 'rating' | null; deviceType: typeof ProductType[keyof typeof ProductType] | null }) => {
      setSortBy(filters.sortBy);
      setDeviceType(filters.deviceType);
      setPageIndex(0);
      fetchDevices(searchQuery, 0);
    },
    [searchQuery]
  );

  const handleLoadMore = () => {
    if (loading || loadingMore || !hasMore) return;
    const nextPage = pageIndex + 1;
    setPageIndex(nextPage);
    fetchDevices(searchQuery, nextPage, true);
  };

  const renderItem = useCallback(
    ({ item, index }: { item: IotDevice; index: number }) =>
      loading ? (
        <SkeletonDeviceItem colors={colors} key={index} />
      ) : (
        <DeviceItem item={item} colors={colors} router={router} />
      ),
    [colors, loading, router]
  );

  const keyExtractor = useCallback((item: IotDevice, index: number) => {
    return typeof item.id === 'number' ? `${item.id}-${index}` : `skeleton-${index}`;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search Input */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 8,
          margin: 16,
          backgroundColor: colors.card,
        }}
      >
        <Ionicons
          name="search"
          size={20}
          color={colors.mutedForeground}
          style={{ marginLeft: 10 }}
        />
        <TextInput
          style={{
            flex: 1,
            height: 40,
            paddingHorizontal: 10,
            color: colors.foreground,
          }}
          placeholder="Search by device name..."
          placeholderTextColor={colors.mutedForeground}
          value={searchQuery}
          onChangeText={handleSearch}
          accessibilityLabel="Search devices"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={{ padding: 10 }}
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Bar */}
      <FilterBar
        colors={colors}
        onFilterChange={handleFilterChange}
        availableTypes={[ProductType.DEVICE]}
      />

      {/* Device List */}
      <FlatList
        data={loading ? Array(4).fill({ id: 'skeleton' }) : devices}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 16 }} />
          ) : null
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: colors.mutedForeground, marginTop: 20 }}>
            No devices found.
          </Text>
        }
      />
    </View>
  );
}