import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';

const blogPosts = [
  {
    id: '1',
    image: 'https://i.pinimg.com/736x/d2/31/ef/d231ef68aafc1473805c473adf7b2867.jpg',
    summary: 'Learn how to assemble your IoT kit with these simple steps!',
    likes: 120,
    comments: 15,
  },
  {
    id: '2',
    image: 'https://i.pinimg.com/736x/22/7c/80/227c80570a076260040dddc88246d6a2.jpg',
    summary: 'Top 5 IoT devices to enhance your smart home.',
    likes: 85,
    comments: 10,
  },
  {
    id: '3',
    image: 'https://soracom.io/wp-content/uploads/fly-images/18345/AdobeStock_181088041-scaled-768x432-c.jpeg',
    summary: 'Why IoT is the future of technology.',
    likes: 200,
    comments: 25,
  },
];

export default function Blog() {
  const { colors } = useThemeColors();

  const renderPost = ({ item }: { item: { id: string; image: string; summary: string; likes: number; comments: number } }) => (
    <TouchableOpacity
      className="p-4 border-b"
      style={{ borderColor: colors.border }} 
    >
      <Image source={{ uri: item.image }} className="w-full h-40 rounded-lg" resizeMode="cover" />
      <Text
        className="text-lg font-semibold mt-2"
        style={{ color: colors.foreground }} 
      >
        {item.summary}
      </Text>
      <View className="flex-row mt-2">
        <View className="flex-row items-center mr-4">
          <Ionicons
            name="heart-outline"
            size={20}
            color={colors.mutedForeground} 
          />
          <Text
            className="ml-1"
            style={{ color: colors.mutedForeground }} 
          >
            {item.likes}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={colors.mutedForeground} 
          />
          <Text
            className="ml-1"
            style={{ color: colors.mutedForeground }} 
          >
            {item.comments}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Text
        className="text-2xl font-bold p-4"
        style={{ color: colors.foreground }} 
      >
        Blog
      </Text>
      <FlatList
        data={blogPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}