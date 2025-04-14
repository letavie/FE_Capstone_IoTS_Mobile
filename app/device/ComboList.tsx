import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getCombos, Combo, PaginationParams } from '@/services/slices/productApi';
import { ProductType } from '@/constants/ProductType';
import ComboItem from '@/app/(tabs)/Home'; 
import { useRouter } from 'expo-router';

export default function ComboList() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchCombos = async (query: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const params: PaginationParams = {
        pageIndex: 0,
        pageSize: 3, // Updated to match your requirement
        searchKeyword: query, // Use search query here
        deviceTypeFilter: ProductType.COMBO,
      };
      const response = await getCombos(params);
      setCombos(response.data || []); // Ensure data is an array
    } catch (err: any) {
      setError(err.message || 'Failed to load combos.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch combos on mount and when search query changes
  useEffect(() => {
    fetchCombos(searchQuery);
  }, [searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.destructive }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search Input */}
      <TextInput
        style={{
          height: 40,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          margin: 16,
          backgroundColor: colors.card,
          color: colors.foreground,
        }}
        placeholder="Search by combo name..."
        placeholderTextColor={colors.mutedForeground}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {/* Combo List */}
      <FlatList
        data={combos}
        renderItem={({ item }) => <ComboItem item={item} colors={colors} router={router} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: colors.mutedForeground }}>
            No combos found.
          </Text>
        }
      />
    </View>
  );
}