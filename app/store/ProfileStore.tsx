import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";

import {
  fetchStoreDetailsById,
  fetchPaginatedProductsByStoreId,
} from "@/services/slices/storeApi";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { AirbnbRating } from "react-native-ratings";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

const getJoinedText = (createdDate: string): string => {
  if (!createdDate) return "Active recently";
  const created = new Date(createdDate);
  const now = new Date();
  const diffInMonths =
    (now.getFullYear() - created.getFullYear()) * 12 +
    (now.getMonth() - created.getMonth());
  return diffInMonths < 1
    ? "Active recently"
    : `Joined ${diffInMonths} months ago`;
};

export default function ProfileStore() {
  const { storeId } = useLocalSearchParams();
  const { colors } = useThemeColors();

  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [dataProduct, setDataProduct] = useState<any>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const loadData = async () => {
      if (storeId) {
        try {
          const storeDetails = await fetchStoreDetailsById(storeId as string);
          setStoreInfo(storeDetails.data);

          const products = await fetchPaginatedProductsByStoreId({
            storeId: storeId as string,
            pageIndex,
            pageSize,
          });
          setDataProduct(products.data);
          setTotalCount(products.data.totalDevices + products.data.totalCombos);
        } catch (error) {
          console.error("Error loading store data:", error);
        }
      }
    };
    loadData();
  }, [storeId, pageIndex, pageSize]);

  const joinedText = getJoinedText(storeInfo?.createdDate);

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  if (!storeId) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="text-lg" style={{ color: colors.foreground }}>
          No store ID provided
        </Text>
      </View>
    );
  }

  if (!storeInfo) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="text-lg" style={{ color: colors.foreground }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View className="relative h-64">
        <Image
          source={{
            uri: storeInfo.imageUrl || "https://via.placeholder.com/150",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black opacity-50" />
        <View className="absolute bottom-4 left-4 right-4 flex-row items-center">
          <Image
            source={{
              uri: storeInfo.imageUrl || "https://via.placeholder.com/100",
            }}
            className="w-24 h-24 rounded-full border-4 border-white"
            resizeMode="cover"
          />
          <View className="ml-4 flex-1">
            <Text className="text-2xl font-semibold text-white">
              {storeInfo.name}
            </Text>
            <Text className="text-sm text-white">Online 7 hours ago</Text>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between p-4">
        <View
          className="bg-card rounded-lg p-4 shadow-sm w-[48%] mb-4 items-center"
          style={{ backgroundColor: colors.card }}
        >
          <Text
            className="text-xl font-semibold"
            style={{ color: colors.foreground }}
          >
            {storeInfo.numberOfFeedbacks}
          </Text>
          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
            Evaluates
          </Text>
        </View>
        <View
          className="bg-card rounded-lg p-4 shadow-sm w-[48%] mb-4 items-center"
          style={{ backgroundColor: colors.card }}
        >
          <Text
            className="text-xl font-semibold"
            style={{ color: colors.foreground }}
          >
            {storeInfo.storeNumberOfProducts}
          </Text>
          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
            Products
          </Text>
        </View>
        <View
          className="bg-card rounded-lg p-4 shadow-sm w-[48%] mb-4 items-center"
          style={{ backgroundColor: colors.card }}
        >
          <Text
            className="text-xl font-semibold"
            style={{ color: colors.foreground }}
          >
            {joinedText.split(" ")[1] === "recently"
              ? "Recent"
              : joinedText.split(" ")[1]}
          </Text>
          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
            {joinedText.split(" ")[0] === "Active" ? "Activity" : "Joined"}
          </Text>
        </View>
        <View
          className="bg-card rounded-lg p-4 shadow-sm w-[48%] mb-4 items-center"
          style={{ backgroundColor: colors.card }}
        >
          <Text
            className="text-xl font-semibold"
            style={{ color: colors.foreground }}
          >
            {storeInfo.provinceName}
          </Text>
          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
            Address
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap p-4">
        {storeInfo.storeAttachments?.map((attachment: any) => (
          <Image
            key={attachment.id}
            source={{ uri: attachment.imageUrl }}
            className="w-24 h-24 rounded-md m-1"
            resizeMode="cover"
          />
        ))}
      </View>

      <View className="p-4">
        <Text
          className="text-xl font-semibold mb-4"
          style={{ color: colors.foreground }}
        >
          All Products
        </Text>
        <FlatList
          data={dataProduct?.devicesIot}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <Link href={`/device/DeviceDetail?id=${item.id}`} asChild>
              <TouchableOpacity
                className="flex-1 m-2 bg-card rounded-lg shadow-sm p-2"
                style={{ backgroundColor: colors.card }}
              >
                <View className="relative">
                  <Image
                    source={{
                      uri: item.imageUrl || "https://via.placeholder.com/150",
                    }}
                    className="w-full h-48 rounded-t-lg"
                    resizeMode="cover"
                  />
                  <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-md">
                    <Text className="text-xs text-white">New</Text>
                  </View>
                  <TouchableOpacity className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
                    <Ionicons
                      name="eye-outline"
                      size={20}
                      color={colors.foreground}
                    />
                  </TouchableOpacity>
                </View>
                <View className="p-2">
                  <Text
                    className="text-sm font-semibold line-clamp-2"
                    style={{ color: colors.foreground }}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-lg font-bold text-red-500 mt-1">
                    {formatPrice(item.price)}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <AirbnbRating
                      count={5}
                      defaultRating={item.rating}
                      size={16}
                      isDisabled
                      showRating={false}
                    />
                    <Text
                      className="text-xs ml-2"
                      style={{ color: colors.mutedForeground }}
                    >
                      (88)
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          )}
          ListFooterComponent={
            <View className="flex-row justify-center mt-4">
              <TouchableOpacity
                onPress={() => handlePageChange(pageIndex - 1)}
                disabled={pageIndex === 1}
                className="p-2 mx-2 rounded-lg"
                style={{
                  backgroundColor:
                    pageIndex === 1 ? colors.muted : colors.primary,
                }}
              >
                <Text className="text-white">Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePageChange(pageIndex + 1)}
                disabled={pageIndex * pageSize >= totalCount}
                className="p-2 mx-2 rounded-lg"
                style={{
                  backgroundColor:
                    pageIndex * pageSize >= totalCount
                      ? colors.muted
                      : colors.primary,
                }}
              >
                <Text className="text-white">Next</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
}
