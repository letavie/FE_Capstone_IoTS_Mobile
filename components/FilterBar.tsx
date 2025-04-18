import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/Colors';
import { ProductType } from '@/constants/ProductType';

interface FilterBarProps {
  colors: ThemeColors;
  onFilterChange: (filters: {
    sortBy: 'priceAsc' | 'priceDesc' | 'rating' | null;
    deviceType: typeof ProductType[keyof typeof ProductType] | null;
  }) => void;
  availableTypes: (typeof ProductType[keyof typeof ProductType])[]; // Use keyof to get union of ProductType values
}

const FilterBar = ({ colors, onFilterChange, availableTypes }: FilterBarProps) => {
  const [sortBy, setSortBy] = useState<'priceAsc' | 'priceDesc' | 'rating' | null>(null);
  const [deviceType, setDeviceType] = useState<typeof ProductType[keyof typeof ProductType] | null>(null);

  const handleSortPress = (newSort: 'priceAsc' | 'priceDesc' | 'rating' | null) => {
    const updatedSort = sortBy === newSort ? null : newSort;
    setSortBy(updatedSort);
    onFilterChange({ sortBy: updatedSort, deviceType });
  };

  const handleTypePress = (type: typeof ProductType[keyof typeof ProductType] | null) => {
    const updatedType = deviceType === type ? null : type;
    setDeviceType(updatedType);
    onFilterChange({ sortBy, deviceType: updatedType });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: sortBy === 'priceAsc' ? colors.primary : colors.card }]}
        onPress={() => handleSortPress('priceAsc')}
      >
        <Ionicons name="arrow-down" size={16} color={sortBy === 'priceAsc' ? colors.background : colors.foreground} />
        <Text style={[styles.filterText, { color: sortBy === 'priceAsc' ? colors.background : colors.foreground }]}>
          Price: Low to High
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: sortBy === 'priceDesc' ? colors.primary : colors.card }]}
        onPress={() => handleSortPress('priceDesc')}
      >
        <Ionicons name="arrow-up" size={16} color={sortBy === 'priceDesc' ? colors.background : colors.foreground} />
        <Text style={[styles.filterText, { color: sortBy === 'priceDesc' ? colors.background : colors.foreground }]}>
          Price: High to Low
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: sortBy === 'rating' ? colors.primary : colors.card }]}
        onPress={() => handleSortPress('rating')}
      >
        <Ionicons name="star" size={16} color={sortBy === 'rating' ? colors.background : colors.foreground} />
        <Text style={[styles.filterText, { color: sortBy === 'rating' ? colors.background : colors.foreground }]}>
          Top Rated
        </Text>
      </TouchableOpacity>
      {availableTypes.map(type => (
        <TouchableOpacity
          key={type}
          style={[styles.filterButton, { backgroundColor: deviceType === type ? colors.primary : colors.card }]}
          onPress={() => handleTypePress(type)}
        >
          <Text style={[styles.filterText, { color: deviceType === type ? colors.background : colors.foreground }]}>
            {type === ProductType.COMBO ? 'Combo' : 'Device'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default FilterBar;