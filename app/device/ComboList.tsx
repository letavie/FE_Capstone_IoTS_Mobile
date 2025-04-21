

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
import { getCombos, Combo, PaginationParams } from '@/services/slices/productApi';
import { ProductType } from '@/constants/ProductType';
import ComboItem from '@/components/ComboItem';
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
const SkeletonComboItem = ({ colors }: { colors: any }) => (
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

export default function ComboList() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priceAsc' | 'priceDesc' | 'rating' | null>(null);
  const [deviceType, setDeviceType] = useState<typeof ProductType[keyof typeof ProductType] | null>(null);
  const pageSize = 10;

  const fetchCombos = useCallback(async (query: string = '', page: number = 0, append: boolean = false) => {
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
      const response = await getCombos(params);
      const newCombos = response.data || [];
      console.log('Fetched combos:', newCombos.map(c => ({ id: c.id, name: c.name })));
      setCombos((prev) => (append ? [...prev, ...newCombos] : newCombos));
      setHasMore(newCombos.length === pageSize);
    } catch (err: any) {
      console.error('Error fetching combos:', err);
      showToast('error', 'Error', err.message || 'Failed to load combos.');
    } finally {
      setLoadingState(false);
    }
  }, [hasMore, sortBy, deviceType]);

  // Debounced search handler
  const debouncedFetchCombos = useRef(
    debounce((query: string) => {
      setPageIndex(0);
      fetchCombos(query, 0);
    }, 300)
  ).current;

  useEffect(() => {
    debouncedFetchCombos(searchQuery);
    return () => debouncedFetchCombos.cancel();
  }, [searchQuery, debouncedFetchCombos, sortBy, deviceType]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterChange = useCallback(
    (filters: { sortBy: 'priceAsc' | 'priceDesc' | 'rating' | null; deviceType: typeof ProductType[keyof typeof ProductType] | null }) => {
      setSortBy(filters.sortBy);
      setDeviceType(filters.deviceType);
      setPageIndex(0);
      fetchCombos(searchQuery, 0);
    },
    [searchQuery]
  );

  const handleLoadMore = () => {
    if (loading || loadingMore || !hasMore) return;
    const nextPage = pageIndex + 1;
    setPageIndex(nextPage);
    fetchCombos(searchQuery, nextPage, true);
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Combo; index: number }) =>
      loading ? (
        <SkeletonComboItem colors={colors} key={index} />
      ) : (
        <ComboItem item={item} colors={colors} router={router} />
      ),
    [colors, loading, router]
  );

  const keyExtractor = useCallback((item: Combo, index: number) => {
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
          placeholder="Search by combo name..."
          placeholderTextColor={colors.mutedForeground}
          value={searchQuery}
          onChangeText={handleSearch}
          accessibilityLabel="Search combos"
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
        availableTypes={[ProductType.COMBO]}
      />

      {/* Combo List */}
      <FlatList
        data={loading ? Array(4).fill({ id: 'skeleton' }) : combos}
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
            No combos found.
          </Text>
        }
      />
    </View>
  );
}