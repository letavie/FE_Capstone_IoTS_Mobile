// import { useEffect, useState } from 'react';
// import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { useThemeColors } from '@/hooks/useThemeColors';

// const slides = [
//   { id: '1', image: 'https://i.pinimg.com/736x/22/7c/80/227c80570a076260040dddc88246d6a2.jpg' },
//   { id: '2', image: 'https://i.pinimg.com/736x/25/c8/a3/25c8a3c28d69009a12a4744174f9dfe1.jpg' },
//   { id: '3', image: 'https://i.pinimg.com/736x/9a/9d/c8/9a9dc8b3a9e19da743b2b6bcd421e20a.jpg' },
//   { id: '4', image: 'https://i.pinimg.com/736x/18/2c/a4/182ca4ce65c6f7026f3cb2398792dfdb.jpg' },
//   { id: '5', image: 'https://i.pinimg.com/736x/d2/22/db/d222dbaa9f347469d84ea31a2fc87d9d.jpg' },
// ];

// const flashSaleItems = Array.from({ length: 10 }, (_, i) => ({
//   id: `${i}`,
//   image: 'https://i.pinimg.com/736x/86/56/4b/86564b4f19efa3c41af031ff2d102685.jpg',
//   name: `Item ${i + 1}`,
//   price: (Math.random() * 100).toFixed(2),
//   rate: (Math.random() * 5).toFixed(1),
// }));

// const categories = ['Sensors', 'Modules', 'Kits', 'Tools', 'Accessories', 'Boards'];

// const devices = Array.from({ length: 8 }, (_, i) => ({
//   id: `${i}`,
//   image: 'https://i.pinimg.com/736x/70/eb/6b/70eb6b81ba48774e677bc64bdb1c08f6.jpg',
//   name: `Device ${i + 1}`,
//   price: (Math.random() * 100).toFixed(2),
//   rate: (Math.random() * 5).toFixed(1),
// }));

// const combos = Array.from({ length: 4 }, (_, i) => ({
//   id: `${i}`,
//   image: 'https://i.pinimg.com/736x/8f/82/db/8f82db3117aee2cd410e7d80a5e0f6d3.jpg',
//   name: `Combo ${i + 1}`,
//   price: (Math.random() * 200).toFixed(2),
//   rate: (Math.random() * 5).toFixed(1),
// }));

// export default function Home() {
//   const router = useRouter();
//   const { colors } = useThemeColors();
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

//   useEffect(() => {
//     const slideInterval = setInterval(() => {
//       setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//     }, 5000);
//     const timerInterval = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);
//     return () => {
//       clearInterval(slideInterval);
//       clearInterval(timerInterval);
//     };
//   }, []);

//   const formatTime = (seconds: number) => {
//     const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
//     const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${h}:${m}:${s}`;
//   };

//   const renderSlide = ({ item }: { item: { id: string; image: string } }) => (
//     <Image source={{ uri: item.image }} style={styles.slideImage} resizeMode="cover" />
//   );

//   const renderFlashSaleItem = ({ item }: { item: { id: string; image: string; name: string; price: string; rate: string } }) => (
//     <View style={[styles.card, { backgroundColor: colors.card }]}>
//       <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
//       <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.name}</Text>
//       <Text style={{ color: colors.destructive }}>${item.price}</Text>
//       <View style={styles.cardFooter}>
//         <Ionicons name="star" size={16} color="#FFD700" />
//         <Text style={{ color: colors.mutedForeground, marginLeft: 4 }}>{item.rate}</Text>
//         <TouchableOpacity style={styles.cartIcon}>
//           <Ionicons name="cart-outline" size={20} color={colors.primary} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderCategory = ({ item }: { item: string }) => (
//     <TouchableOpacity style={[styles.categoryButton, { borderColor: colors.border }]}>
//       <Text style={[styles.categoryText, { color: colors.foreground }]}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const renderDeviceOrCombo = ({ item }: { item: { id: string; image: string; name: string; price: string; rate: string } }) => (
//     <View style={[styles.card, { backgroundColor: colors.card, width: '48%' }]}>
//       <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
//       <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.name}</Text>
//       <Text style={{ color: colors.destructive }}>${item.price}</Text>
//       <View style={styles.cardFooter}>
//         <Ionicons name="star" size={16} color="#FFD700" />
//         <Text style={{ color: colors.mutedForeground, marginLeft: 4 }}>{item.rate}</Text>
//         <TouchableOpacity style={styles.cartIcon}>
//           <Ionicons name="cart-outline" size={20} color={colors.primary} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
//       <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
//         <Text style={styles.headerText}>Discover</Text>
//        <TouchableOpacity onPress={() => router.push('/cart/Cart')}>
//   <View className="bg-white rounded-full p-2">
//     <Ionicons name="cart-outline" size={28} color={colors.primary} />
//   </View>
// </TouchableOpacity>
//       </View>

//       <View style={styles.sliderContainer}>
//         <FlatList
//           data={slides}
//           renderItem={renderSlide}
//           keyExtractor={(item) => item.id}
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           onMomentumScrollEnd={(e) => {
//             const index = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
//             setCurrentSlide(index);
//           }}
//         />
//         <View style={styles.dotsContainer}>
//           {slides.map((_, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.dot,
//                 { backgroundColor: index === currentSlide ? colors.textColer : colors.muted },
//               ]}
//             />
//           ))}
//         </View>
//       </View>

//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color={colors.mutedForeground} style={styles.searchIcon} />
//         <TextInput
//           placeholder="Search products..."
//           placeholderTextColor={colors.mutedForeground}
//           style={[styles.searchInput, { backgroundColor: colors.input, color: colors.foreground }]}
//         />
//       </View>

//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Flash Sale</Text>
//           <Text style={{ color: colors.destructive }}>{formatTime(timeLeft)}</Text>
//         </View>
//         <FlatList
//           data={flashSaleItems}
//           renderItem={renderFlashSaleItem}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//         />
//       </View>

//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Categories</Text>
//           <TouchableOpacity>
//             <Text style={{ color: colors.textColer }}>See All</Text>
//           </TouchableOpacity>
//         </View>
//         <FlatList
//           data={categories}
//           renderItem={renderCategory}
//           keyExtractor={(item) => item}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//         />
//       </View>

//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Devices</Text>
//           <TouchableOpacity onPress={() => router.push('/device/DeviceList')}>
//             <Text style={{ color: colors.textColer }}>See All</Text>
//           </TouchableOpacity>
//         </View>
//         <FlatList
//           data={devices}
//           renderItem={renderDeviceOrCombo}
//           keyExtractor={(item) => item.id}
//           numColumns={2}
//           scrollEnabled={false}
//         />
//       </View>

//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Combos</Text>
//           <TouchableOpacity onPress={() => router.push('/device/ComboList')}>
//             <Text style={{ color: colors.textColer }}>See All</Text>
//           </TouchableOpacity>
//         </View>
//         <FlatList
//           data={combos}
//           renderItem={renderDeviceOrCombo}
//           keyExtractor={(item) => item.id}
//           numColumns={2}
//           scrollEnabled={false}
//         />
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
//   headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
//   sliderContainer: { paddingHorizontal: 16, marginTop: 16 },
//   slideImage: { width: 360, height: 160, borderRadius: 12 },
//   dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
//   dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
//   searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 16, paddingHorizontal: 8 },
//   searchIcon: { marginRight: 8 },
//   searchInput: { flex: 1, padding: 10, borderRadius: 8 },
//   section: { marginTop: 24, paddingHorizontal: 16 },
//   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   sectionTitle: { fontSize: 20, fontWeight: 'bold' },
//   card: { borderRadius: 12, padding: 8, marginRight: 12, marginTop: 6, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
//   cardImage: { width: 120, height: 120, borderRadius: 8 },
//   cardTitle: { fontSize: 14, fontWeight: '600', marginVertical: 4 },
//   cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
//   cartIcon: { marginLeft: 'auto' },
//   categoryButton: { borderWidth: 1, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8 },
//   categoryText: { fontSize: 14 },
// });

import { useEffect, useState, memo } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';

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

interface Colors {
  border: string;
  input: string;
  ring: string;
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  destructive: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  popover: string;
  popoverForeground: string;
  card: string;
  cardForeground: string;
  textColer: string;
  headerBg: string;
}

// Static data
const SLIDES: Slide[] = [
  { id: '1', image: 'https://i.pinimg.com/736x/22/7c/80/227c80570a076260040dddc88246d6a2.jpg' },
  { id: '2', image: 'https://i.pinimg.com/736x/25/c8/a3/25c8a3c28d69009a12a4744174f9dfe1.jpg' },
  { id: '3', image: 'https://i.pinimg.com/736x/9a/9d/c8/9a9dc8b3a9e19da743b2b6bcd421e20a.jpg' },
  { id: '4', image: 'https://i.pinimg.com/736x/18/2c/a4/182ca4ce65c6f7026f3cb2398792dfdb.jpg' },
  { id: '5', image: 'https://i.pinimg.com/736x/d2/22/db/d222dbaa9f347469d84ea31a2fc87d9d.jpg' },
];

const FLASH_SALE_ITEMS: Item[] = Array.from({ length: 10 }, (_, i) => ({
  id: i.toString(),
  image: 'https://i.pinimg.com/736x/86/56/4b/86564b4f19efa3c41af031ff2d102685.jpg',
  name: `Item ${i + 1}`,
  price: (Math.random() * 100).toFixed(2),
  rate: (Math.random() * 5).toFixed(1),
}));

const CATEGORIES: string[] = ['Sensors', 'Modules', 'Kits', 'Tools', 'Accessories', 'Boards'];

const DEVICES: Item[] = Array.from({ length: 8 }, (_, i) => ({
  id: i.toString(),
  image: 'https://i.pinimg.com/736x/70/eb/6b/70eb6b81ba48774e677bc64bdb1c08f6.jpg',
  name: `Device ${i + 1}`,
  price: (Math.random() * 100).toFixed(2),
  rate: (Math.random() * 5).toFixed(1),
}));

const COMBOS: Item[] = Array.from({ length: 4 }, (_, i) => ({
  id: i.toString(),
  image: 'https://i.pinimg.com/736x/8f/82/db/8f82db3117aee2cd410e7d80a5e0f6d3.jpg',
  name: `Combo ${i + 1}`,
  price: (Math.random() * 200).toFixed(2),
  rate: (Math.random() * 5).toFixed(1),
}));

// Reusable Components with Types
const SlideItem = memo<{ image: string }>(({ image }) => (
  <Image source={{ uri: image }} style={styles.slideImage} resizeMode="cover" />
));

const FlashSaleItem = memo<{ item: Item; colors: Colors }>(({ item, colors }) => (
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

const CategoryItem = memo<{ item: string; colors: Colors }>(({ item, colors }) => (
  <TouchableOpacity style={[styles.categoryButton, { borderColor: colors.border }]}>
    <Text style={[styles.categoryText, { color: colors.foreground }]}>{item}</Text>
  </TouchableOpacity>
));

const DeviceOrComboItem = memo<{ item: Item; colors: Colors }>(({ item, colors }) => (
  <View style={[styles.card, { backgroundColor: colors.card, width: '48%' }]}>
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

export default function Home() {
  const router = useRouter();
  const { colors } = useThemeColors();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
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
  }, []);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Text style={styles.headerText}>Discover</Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/cart')}
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
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / Dimensions.get('window').width);
            setCurrentSlide(index);
          }}
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
          initialNumToRender={5}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Categories</Text>
          <TouchableOpacity>
            <Text style={{ color: colors.textColer }}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={CATEGORIES}
          renderItem={({ item }) => <CategoryItem item={item} colors={colors} />}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Devices</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/device/DeviceList')}>
            <Text style={{ color: colors.textColer }}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={DEVICES}
          renderItem={({ item }) => <DeviceOrComboItem item={item} colors={colors} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Combos</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/device/ComboList')}>
            <Text style={{ color: colors.textColer }}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={COMBOS}
          renderItem={({ item }) => <DeviceOrComboItem item={item} colors={colors} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
        />
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