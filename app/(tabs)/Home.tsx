import { useEffect, useState, memo, useCallback, useRef } from "react";
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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColors } from "../../hooks/useThemeColors";
import { ThemeColors } from "../../constants/Colors";
import {
  getIotDevices,
  getCombos,
  getMaterialCategories,
  IotDevice,
  Combo,
  MaterialCategory,
  PaginationParams,
} from "./../../services/slices/productApi";
import { ProductType } from "@/constants/ProductType";
import DeviceItem from "@/components/DeviceItem";
import ComboItem from "@/components/ComboItem";
import Toast from "react-native-toast-message";

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
  {
    id: "1",
    image:
      "https://i.pinimg.com/736x/22/7c/80/227c80570a076260040dddc88246d6a2.jpg",
  },
  {
    id: "2",
    image:
      "https://i.pinimg.com/736x/25/c8/a3/25c8a3c28d69009a12a4744174f9dfe1.jpg",
  },
  {
    id: "3",
    image:
      "https://i.pinimg.com/736x/9a/9d/c8/9a9dc8b3a9e19da743b2b6bcd421e20a.jpg",
  },
  {
    id: "4",
    image:
      "https://i.pinimg.com/736x/18/2c/a4/182ca4ce65c6f7026f3cb2398792dfdb.jpg",
  },
  {
    id: "5",
    image:
      "https://i.pinimg.com/736x/d2/22/db/d222dbaa9f347469d84ea31a2fc87d9d.jpg",
  },
];

// Static data for Flash Sale (memoized)
const FLASH_SALE_ITEMS: Item[] = Array.from({ length: 10 }, (_, i) => ({
  id: i.toString(),
  image:
    "https://i.pinimg.com/736x/86/56/4b/86564b4f19efa3c41af031ff2d102685.jpg",
  name: `Item ${i + 1}`,
  price: (Math.random() * 100).toFixed(2),
  rate: (Math.random() * 5).toFixed(1),
}));

// Reusable Components with Types
const SlideItem = memo<{ image: string; index: number; colors: ThemeColors }>(
  ({ image, index, colors }) => {
    const [imageLoading, setImageLoading] = useState(true);
    return (
      <View style={styles.slideContainer}>
        {imageLoading && (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: colors.mutedForeground },
            ]}
          >
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
        <Image
          source={{ uri: image, cache: "force-cache" }}
          style={styles.slideImage}
          resizeMode="cover"
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
      </View>
    );
  }
);

const FlashSaleItem = memo<{ item: Item; colors: ThemeColors }>(
  ({ item, colors }) => (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Image
        source={{ uri: item.image, cache: "force-cache" }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <Text
        style={[styles.cardTitle, { color: colors.foreground }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.name}
      </Text>
      <Text style={{ color: colors.destructive }}>${item.price}</Text>
      <View style={styles.cardFooter}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={{ color: colors.mutedForeground, marginLeft: 4 }}>
          {item.rate}
        </Text>
        <TouchableOpacity style={styles.cartIcon}>
          <Ionicons name="cart-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )
);

const CategoryItem = memo<{ item: MaterialCategory; colors: ThemeColors }>(
  ({ item, colors }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        {
          backgroundColor: "#FFFFFF",
          borderColor: "#000000",
          borderWidth: 1,
        },
      ]}
    >
      <Text
        style={[styles.categoryText, { color: colors.foreground }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  )
);

// Skeleton Loader for Devices/Combos
const SkeletonItem = memo<{ colors: ThemeColors }>(({ colors }) => (
  <View style={[styles.card, { backgroundColor: colors.card, width: "45%" }]}>
    <View
      style={[styles.cardImage, { backgroundColor: colors.mutedForeground }]}
    />
    <View
      style={{
        height: 16,
        width: "80%",
        backgroundColor: colors.mutedForeground,
        borderRadius: 4,
        marginVertical: 4,
      }}
    />
    <View
      style={{
        height: 16,
        width: "50%",
        backgroundColor: colors.mutedForeground,
        borderRadius: 4,
      }}
    />
  </View>
));

const showToast = (
  type: "success" | "error" | "info",
  message: string,
  description?: string
) => {
  Toast.show({
    type,
    text1: message,
    text2: description || "",
    position: "top",
    visibilityTime: 3000,
    topOffset: 50,
    text1Style: { fontSize: 16, fontWeight: "bold", color: "#333333" },
    text2Style: { fontSize: 14, color: "#333333" },
  });
};

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
  const scrollViewRef = useRef<ScrollView>(null);

  // Memoized fetchData function
  const fetchData = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const categoriesData = await getMaterialCategories();
      setCategories(categoriesData);
    } catch (err: any) {
      showToast("error", "Error", err.message || "Failed to load categories.");
    } finally {
      setLoadingCategories(false);
    }

    try {
      setLoadingDevices(true);
      const deviceParams: PaginationParams = {
        pageIndex: 0,
        pageSize: 8,
        searchKeyword: "",
        deviceTypeFilter: ProductType.DEVICE,
      };
      const devicesData = await getIotDevices(deviceParams);
      setDevices(devicesData.data);
    } catch (err: any) {
      showToast("error", "Error", err.message || "Failed to load devices.");
    } finally {
      setLoadingDevices(false);
    }

    try {
      setLoadingCombos(true);
      const comboParams: PaginationParams = {
        pageIndex: 0,
        pageSize: 4,
        searchKeyword: "",
        deviceTypeFilter: ProductType.COMBO,
      };
      const combosData = await getCombos(comboParams);
      setCombos(combosData.data);
    } catch (err: any) {
      showToast("error", "Error", err.message || "Failed to load combos.");
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

  const formatTime = useCallback((seconds: number): string => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, []);

  const handleMomentumScrollEnd = useCallback((e: any) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / (Dimensions.get("window").width - 32)
    );
    setCurrentSlide(index);
  }, []);

  // Optimized getItemLayout
  const slideItemLayout = useCallback(
    (_: any, index: number) => ({
      length: Dimensions.get("window").width - 32,
      offset: (Dimensions.get("window").width - 32) * index,
      index,
    }),
    []
  );

  const flashSaleItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 136,
      offset: 136 * index,
      index,
    }),
    []
  );

  const categoryItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 100,
      offset: 100 * index,
      index,
    }),
    []
  );

  // Key extractors
  const slideKeyExtractor = useCallback((item: Slide) => item.id, []);
  const flashSaleKeyExtractor = useCallback((item: Item) => item.id, []);
  const categoryKeyExtractor = useCallback(
    (item: MaterialCategory) => item.id.toString(),
    []
  );
  const deviceKeyExtractor = useCallback(
    (item: IotDevice, index: number) => `${item.id}-${index}`,
    []
  );
  const comboKeyExtractor = useCallback(
    (item: Combo, index: number) => `${item.id}-${index}`,
    []
  );

  const CategoryItem = memo<{ item: MaterialCategory; colors: ThemeColors }>(
    ({ item, colors }) => (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          {
            backgroundColor: "#FFFFFF",
            borderColor: "#000000",
            borderWidth: 1,
          },
        ]}
      >
        <Text
          style={[styles.categoryText, { color: colors.foreground }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    )
  );

  // Skeleton Loader for Categories
  const SkeletonCategoryItem = memo<{ colors: ThemeColors }>(({ colors }) => (
    <View
      style={[
        styles.categoryButton,
        {
          backgroundColor: colors.mutedForeground,
          borderColor: colors.mutedForeground,
          borderWidth: 1,
          width: 100,
        },
      ]}
    >
      <View
        style={{
          height: 16,
          width: "80%",
          backgroundColor: colors.background,
          borderRadius: 4,
        }}
      />
    </View>
  ));

  // Render items
  const renderSlideItem = useCallback(
    ({ item, index }: { item: Slide; index: number }) => (
      <SlideItem image={item.image} index={index} colors={colors} />
    ),
    [colors]
  );

  const renderFlashSaleItem = useCallback(
    ({ item }: { item: Item }) => <FlashSaleItem item={item} colors={colors} />,
    [colors]
  );

  const renderDeviceItem = useCallback(
    ({ item, index }: { item: IotDevice; index: number }) =>
      loadingDevices ? (
        <SkeletonItem colors={colors} />
      ) : (
        <DeviceItem item={item} colors={colors} router={router} />
      ),
    [colors, loadingDevices, router]
  );

  const renderComboItem = useCallback(
    ({ item, index }: { item: Combo; index: number }) =>
      loadingCombos ? (
        <SkeletonItem colors={colors} />
      ) : (
        <ComboItem item={item} colors={colors} router={router} />
      ),
    [colors, loadingCombos, router]
  );
  const renderCategoryItem = useCallback(
    ({ item }: { item: MaterialCategory }) => (
      <CategoryItem item={item} colors={colors} />
    ),
    [colors]
  );

  const renderSkeletonCategoryItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <SkeletonCategoryItem colors={colors} key={`skeleton-cat-${index}`} />
    ),
    [colors]
  );
  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            elevation: 5,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            paddingTop: Platform.OS === "ios" ? 40 : 20,
          },
        ]}
      >
        <Text style={styles.headerText}>IoTS</Text>
        <TouchableOpacity
          onPress={() => router.push("/cart/Cart")}
          accessibilityLabel="Go to cart"
        >
          <View style={styles.cartButton}>
            <Ionicons name="cart-outline" size={28} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, marginTop: 80 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sliderContainer}>
          <FlatList
            data={SLIDES}
            renderItem={renderSlideItem}
            keyExtractor={slideKeyExtractor}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            getItemLayout={slideItemLayout}
            initialNumToRender={1}
            windowSize={3}
            removeClippedSubviews
          />
          <View style={styles.dotsContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentSlide ? colors.textColer : colors.muted,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.mutedForeground}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search products..."
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.searchInput,
              { backgroundColor: colors.input, color: colors.foreground },
            ]}
            accessibilityLabel="Search products"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            {/* <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Flash Sale
            </Text> */}
            {/* <Text style={{ color: colors.destructive }}>
              {formatTime(timeLeft)}
            </Text> */}
          </View>
          {/* <FlatList
            data={FLASH_SALE_ITEMS}
            renderItem={renderFlashSaleItem}
            keyExtractor={flashSaleKeyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            getItemLayout={flashSaleItemLayout}
            initialNumToRender={5}
            windowSize={5}
            removeClippedSubviews
          /> */}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Categories
            </Text>
            {/* <TouchableOpacity onPress={() => router.push('/categories')}>
      <Text style={{ color: colors.textColer, fontSize: 14, fontWeight: '600' }}>See All</Text>
    </TouchableOpacity> */}
          </View>
          {loadingCategories ? (
            <FlatList
              data={Array(5).fill({ id: "skeleton" })}
              renderItem={renderSkeletonCategoryItem}
              keyExtractor={(item, index) => `skeleton-cat-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              getItemLayout={categoryItemLayout}
              initialNumToRender={5}
              windowSize={5}
              removeClippedSubviews
            />
          ) : categories.length === 0 ? (
            <Text
              style={{
                color: colors.mutedForeground,
                fontSize: 14,
                paddingHorizontal: 8,
              }}
            >
              No categories available.
            </Text>
          ) : (
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={categoryKeyExtractor}
              horizontal
              showsHorizontalScrollIndicator={false}
              getItemLayout={categoryItemLayout}
              initialNumToRender={5}
              windowSize={5}
              removeClippedSubviews
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Devices
            </Text>
            <TouchableOpacity onPress={() => router.push("/device/DeviceList")}>
              <Text style={{ color: colors.textColer }}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={loadingDevices ? Array(4).fill({ id: "skeleton" }) : devices}
            renderItem={renderDeviceItem}
            keyExtractor={deviceKeyExtractor}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnWrapper}
            initialNumToRender={4}
            windowSize={5}
            removeClippedSubviews
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Combos
            </Text>
            <TouchableOpacity onPress={() => router.push("/device/ComboList")}>
              <Text style={{ color: colors.textColer }}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={loadingCombos ? Array(4).fill({ id: "skeleton" }) : combos}
            renderItem={renderComboItem}
            keyExtractor={comboKeyExtractor}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnWrapper}
            initialNumToRender={4}
            windowSize={5}
            removeClippedSubviews
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  cartButton: { backgroundColor: "#fff", borderRadius: 20, padding: 8 },
  sliderContainer: { paddingHorizontal: 16, marginTop: 16 },
  slideContainer: { width: Dimensions.get("window").width - 32, height: 160 },
  slideImage: { width: "100%", height: 160, borderRadius: 12 },
  imagePlaceholder: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 8,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, padding: 10, borderRadius: 8 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold" },
  card: {
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
    marginTop: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: { width: 120, height: 120, borderRadius: 8 },
  cardTitle: { fontSize: 14, fontWeight: "600", marginVertical: 4 },
  cardFooter: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  cartIcon: { marginLeft: "auto" },

  categoryButton: {
    borderRadius: 12, // Softer corners
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    elevation: 2, // Subtle shadow for card effect
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  categoryText: { fontSize: 14 },
  columnWrapper: { justifyContent: "space-between", paddingHorizontal: 8 },
});
