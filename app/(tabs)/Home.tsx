import { useEffect, useState, memo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../../hooks/useThemeColors';
import { ThemeColors } from '../../constants/Colors';
import {
  getIotDevices,
  getCombos,
  getMaterialCategories,
  IotDevice,
  Combo,
  MaterialCategory,
  PaginationParams,
} from './../../services/slices/productApi';
import { ProductType } from '@/constants/ProductType';
import DeviceItem from '@/components/DeviceItem';
import ComboItem from '@/components/ComboItem';

// Define TypeScript interfaces
interface Slide {
  id: string;
  image: string;
}

interface Item {
  id: string;
  image: string;
  name: string;
  price: string;
  rate: string;
}

// Static data for Slides (memoized)
const SLIDES: Slide[] = [
  { id: '1', image: 'https://i.pinimg.com/736x/22/7c/80/227c80570a076260040dddc88246d6a2.jpg' },
  { id: '2', image: 'https://i.pinimg.com/736x/25/c8/a3/25c8a3c28d69009a12a4744174f9dfe1.jpg' },
  { id: '3', image: 'https://i.pinimg.com/736x/9a/9d/c8/9a9dc8b3a9e19da743b2b6bcd421e20a.jpg' },
  { id: '4', image: 'https://i.pinimg.com/736x/18/2c/a4/182ca4ce65c6f7026f3cb2398792dfdb.jpg' },
  { id: '5', image: 'https://i.pinimg.com/736x/d2/22/db/d222dbaa9f347469d84ea31a2fc87d9d.jpg' },
];

// Static data for Flash Sale (memoized)
const FLASH_SALE_ITEMS: Item[] = Array.from({ length: 10 }, (_, i) => ({
  id: i.toString(),
  image: 'https://i.pinimg.com/736x/86/56/4b/86564b4f19efa3c41af031ff2d102685.jpg',
  name: `Item ${i + 1}`,
  price: (Math.random() * 100).toFixed(2),
  rate: (Math.random() * 5).toFixed(1),
}));

// Reusable Components with Types
const SlideItem = memo<{ image: string }>(({ image }) => (
  <Image source={{ uri: image }} style={styles.slideImage} resizeMode="cover" />
));

const FlashSaleItem = memo<{ item: Item; colors: ThemeColors }>(({ item, colors }) => (
  <View style={[styles.card, { backgroundColor: colors.card }]}>
    <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
    <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.name}</Text>
    <Text style={{ color: colors.destructive }}>${item.price}</Text>
    <View style={styles.cardFooter}>
      <Ionicons name="star" size={16} color="#FFD700" />
      <Text style={{ color: colors.mutedForeground, marginLeft: 4 }}>{item.rate}</Text>
      <TouchableOpacity style={styles.cartIcon}>
        <Ionicons name="cart-outline" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  </View>
));

const CategoryItem = memo<{ item: MaterialCategory; colors: ThemeColors }>(({ item, colors }) => (
  <TouchableOpacity style={[styles.categoryButton, { borderColor: colors.border }]}>
    <Text style={[styles.categoryText, { color: colors.foreground }]}>{item.label}</Text>
  </TouchableOpacity>
));

export default function Home() {
  const router = useRouter();
  const { colors } = useThemeColors();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); 
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [devices, setDevices] = useState<IotDevice[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [loadingCombos, setLoadingCombos] = useState(false);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const [errorDevices, setErrorDevices] = useState<string | null>(null);
  const [errorCombos, setErrorCombos] = useState<string | null>(null);

  // Memoized fetchData function
  const fetchData = useCallback(async () => {
    // Fetch Material Categories
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const categoriesData = await getMaterialCategories();
      setCategories(categoriesData);
    } catch (err: any) {
      setErrorCategories(err.message || 'Failed to load categories.');
    } finally {
      setLoadingCategories(false);
    }

    // Fetch IotDevices
    setLoadingDevices(true);
    setErrorDevices(null);
    try {
      const deviceParams: PaginationParams = {
        pageIndex: 0,
        pageSize: 8, 
        searchKeyword: '',
        deviceTypeFilter: ProductType.DEVICE,
      };
      const devicesData = await getIotDevices(deviceParams);
      setDevices(devicesData.data);
    } catch (err: any) {
      setErrorDevices(err.message || 'Failed to load devices.');
    } finally {
      setLoadingDevices(false);
    }

    // Fetch Combos
    setLoadingCombos(true);
    setErrorCombos(null);
    try {
      const comboParams: PaginationParams = {
        pageIndex: 0,
        pageSize: 4, // Lấy 4 combo
        searchKeyword: '',
        deviceTypeFilter: ProductType.COMBO,
      };
      const combosData = await getCombos(comboParams);
      setCombos(combosData.data);
    } catch (err: any) {
      setErrorCombos(err.message || 'Failed to load combos.');
    } finally {
      setLoadingCombos(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 24 * 60 * 60));
    }, 1000);

    return () => {
      clearInterval(slideInterval);
      clearInterval(timerInterval);
    };
  }, [fetchData]);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Debounced handler for slider scroll
  const handleMomentumScrollEnd = useCallback((e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / Dimensions.get('window').width);
    setCurrentSlide(index);
  }, []);

  // getItemLayout for FlatLists
  const slideItemLayout = useCallback(
    (_: any, index: number) => ({
      length: Dimensions.get('window').width - 32,
      offset: (Dimensions.get('window').width - 32) * index,
      index,
    }),
    []
  );

  const flashSaleItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 136, // card width (120) + marginRight (12) + padding (4)
      offset: 136 * index,
      index,
    }),
    []
  );

  const categoryItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 100, // Approximate width of category button
      offset: 100 * index,
      index,
    }),
    []
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={styles.headerText}>Discover</Text>
        <TouchableOpacity
          onPress={() => router.push('/cart/Cart')}
          accessibilityLabel="Go to cart"
        >
          <View style={styles.cartButton}>
            <Ionicons name="cart-outline" size={28} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.sliderContainer}>
        <FlatList
          data={SLIDES}
          renderItem={({ item }) => <SlideItem image={item.image} />}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          getItemLayout={slideItemLayout}
          initialNumToRender={1}
          windowSize={3}
        />
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, { backgroundColor: index === currentSlide ? colors.textColer : colors.muted }]}
            />
          ))}
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.mutedForeground} style={styles.searchIcon} />
        <TextInput
          placeholder="Search products..."
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { backgroundColor: colors.input, color: colors.foreground }]}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Flash Sale</Text>
          <Text style={{ color: colors.destructive }}>{formatTime(timeLeft)}</Text>
        </View>
        <FlatList
          data={FLASH_SALE_ITEMS}
          renderItem={({ item }) => <FlashSaleItem item={item} colors={colors} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          getItemLayout={flashSaleItemLayout}
          initialNumToRender={5}
          windowSize={5}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Categories</Text>
          <TouchableOpacity>
            <Text style={{ color: colors.textColer }}>See All</Text>
          </TouchableOpacity>
        </View>
        {loadingCategories ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : errorCategories ? (
          <Text style={{ color: colors.destructive }}>{errorCategories}</Text>
        ) : (
          <FlatList
            data={categories}
            renderItem={({ item }) => <CategoryItem item={item} colors={colors} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            getItemLayout={categoryItemLayout}
            initialNumToRender={5}
            windowSize={5}
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Devices</Text>
          <TouchableOpacity onPress={() => router.push('/device/DeviceList')}>
            <Text style={{ color: colors.textColer }}>See All</Text>
          </TouchableOpacity>
        </View>
        {loadingDevices ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : errorDevices ? (
          <Text style={{ color: colors.destructive }}>{errorDevices}</Text>
        ) : (
          <FlatList
            data={devices}
            renderItem={({ item }) => <DeviceItem item={item} colors={colors} router={router} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnWrapper}
            initialNumToRender={4}
            windowSize={5}
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Combos</Text>
          <TouchableOpacity onPress={() => router.push('/device/ComboList')}>
            <Text style={{ color: colors.textColer }}>See All</Text>
          </TouchableOpacity>
        </View>
        {loadingCombos ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : errorCombos ? (
          <Text style={{ color: colors.destructive }}>{errorCombos}</Text>
        ) : (
          <FlatList
            data={combos}
            renderItem={({ item }) => <ComboItem item={item} colors={colors} router={router} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnWrapper}
            initialNumToRender={4}
            windowSize={5}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  cartButton: { backgroundColor: '#fff', borderRadius: 20, padding: 8 },
  sliderContainer: { paddingHorizontal: 16, marginTop: 16 },
  slideImage: { width: Dimensions.get('window').width - 32, height: 160, borderRadius: 12 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 8,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, padding: 10, borderRadius: 8 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  card: {
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
    marginTop: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: { width: 120, height: 120, borderRadius: 8 },
  cardTitle: { fontSize: 14, fontWeight: '600', marginVertical: 4 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  cartIcon: { marginLeft: 'auto' },
  categoryButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  categoryText: { fontSize: 14 },
  columnWrapper: { justifyContent: 'space-between' },
});