import { useState, useEffect, useCallback } from "react";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  getComboDetails,
  getCombos,
  getFeedbackHistory,
  addToCart,
  Combo,
  PaginationParams,
} from "@/services/slices/productApi";
import { ProductType } from "../../constants/ProductType";
import ComboCard from "../../components/ComboCard";
import { fetchLabMemberPagination } from "@/services/slices/labApi";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Interface for lab data
interface Lab {
  id: number;
  title: string;
  summary: string;
  price: number;
  storeName: string;
  imageUrl?: string;
}

export default function ComboDetail() {
  const { id: comboId } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useThemeColors();

  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [relatedCombos, setRelatedCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(false);

  const [numCart, setNumCart] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // const [addingLabId, setAddingLabId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [addingLabId, setAddingLabId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (!comboId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No combo ID provided",
      });
      return;
    }
    const numericComboId = parseInt(comboId as string, 10);
    if (isNaN(numericComboId)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid combo ID",
      });
      return;
    }
    setLoading(true);

    try {
      // Fetch combo details
      const comboResponse = await getComboDetails(numericComboId);
      console.log("Combo Response:", comboResponse);
      setSelectedCombo(comboResponse);

      const labResponse = await fetchLabMemberPagination({
        comboId: numericComboId,
        pageIndex: 0,
        pageSize: 10,
        searchKeyword: "",
      });
      setLabs(labResponse.data.data || []);
      console.log("Labs Response:", labResponse.data);

      // Fetch feedback
      const feedbackResponse = await getFeedbackHistory({
        advancedFilter: {
          // productId: parseInt(comboId as string),
          productId: numericComboId,
          productType: ProductType.COMBO,
        },
        paginationRequest: {
          pageIndex: 0,
          pageSize: 10,
          searchKeyword: "",
        },
      });
      // setFeedback(feedbackResponse || []);
      setFeedback(feedbackResponse.data.data || []);

      // Fetch related combos
      const combosResponse = await getCombos({
        pageIndex: 1,
        pageSize: 10,
        searchKeyword: "",
        deviceTypeFilter: ProductType.COMBO,
      });
      setRelatedCombos(combosResponse.data || []);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Loading failed",
        text2: err.message || "Failed to load combo details",
      });
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [comboId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onChangeQuantity = useCallback(
    (value: number) => {
      if (value > (selectedCombo?.quantity || 0)) {
        Toast.show({
          type: "info",
          text1: "Quantity limit",
          text2: `Only ${selectedCombo?.quantity} items available`,
        });
        setNumCart(selectedCombo?.quantity || 1);
        return;
      }
      setNumCart(value);
    },
    [selectedCombo]
  );

  const handleAddToCart = useCallback(async () => {
    if (!selectedCombo?.quantity) {
      Toast.show({
        type: "error",
        text1: "Out of stock",
        text2: "This combo is currently unavailable",
      });
      return;
    }
    const numericComboId = parseInt(comboId as string, 10);
    if (isNaN(numericComboId)) {
      Toast.show({
        type: "error",
        text1: "Invalid combo",
        text2: "The combo ID is not valid",
      });
      return;
    }
    try {
      setIsAdding(true);
      await addToCart({
        productId: numericComboId,
        productType: ProductType.COMBO,
        quantity: numCart,
      });
      Toast.show({
        type: "success",
        text1: "Added to cart",
        text2: `Combo added to cart successfully!`,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to add to cart",
        text2: error || "Please try again later",
      });
    } finally {
      setIsAdding(false);
    }
  }, [comboId, numCart, selectedCombo, fetchData]);

  const handleAddLabToCart = useCallback(async (labId: number) => {
    setAddingLabId(labId);

    try {
      await addToCart({
        productId: labId,
        productType: ProductType.LAB,
        quantity: 1,
      });
      Toast.show({
        type: "success",
        text1: "Lab added",
        text2: "The lab has been added to your cart",
      });
    } catch (error: any) {
      Toast.show({
        type: "warning",
        text1: "Failed to add lab",
        text2: error || "Please try again later",
      });
    } finally {
      setAddingLabId(null);
    }
  }, []);

  const handleImageClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false);
    setSelectedImageIndex(0);
  }, []);

  const handleDeviceClick = (iotDeviceId: string) => {
    router.push(`/device/DeviceDetail?id=${iotDeviceId}`);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!selectedCombo) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl font-semibold text-gray-800 mb-4">
          No combo details available.
        </Text>
        <TouchableOpacity
          onPress={fetchData}
          className="bg-blue-600 px-6 py-2 rounded"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = [
    selectedCombo.imageUrl,
    ...(selectedCombo.attachmentsList || []).map(
      (attachment) => attachment.imageUrl
    ),
  ].filter(
    (url): url is string => typeof url === "string" && url.trim() !== ""
  );
  console.log("Images Array:", images);

  // Define sections for the FlatList
  const sections = [
    { type: "imageSlider" },
    { type: "mainInfo" },
    { type: "storeInfo" },
    { type: "labs" },
    { type: "tabs" },
    { type: "relatedCombos" },
  ];

  const renderSection = ({ item }: { item: { type: string } }) => {
    switch (item.type) {
      case "imageSlider":
        return (
          <View className="bg-white rounded-lg shadow-sm p-6 mb-4">
            {images.length > 0 ? (
              <>
                <FlatList
                  data={images}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => handleImageClick(index)}>
                      <Image
                        source={{ uri: item }}
                        style={{
                          width: SCREEN_WIDTH - 32,
                          height: 200,
                          borderRadius: 8,
                        }}
                        className="w-full h-80 object-contain rounded"
                        resizeMode="contain"
                        onError={(e) =>
                          console.log("Image Load Error:", e.nativeEvent.error)
                        }
                        onLoad={() => console.log("Image Loaded:", item)}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={(event) => {
                    const index = Math.round(
                      event.nativeEvent.contentOffset.x /
                        event.nativeEvent.layoutMeasurement.width
                    );
                    setSelectedImageIndex(index);
                  }}
                />
                <View className="flex flex-row justify-center mt-2">
                  {images.map((_, index) => (
                    <View
                      key={index}
                      className={`w-2 h-2 rounded-full mx-1 ${
                        index === selectedImageIndex
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </View>
              </>
            ) : (
              <View className="w-full h-80 flex justify-center items-center bg-gray-200 rounded">
                <Text className="text-gray-500">No images available</Text>
              </View>
            )}
          </View>
        );

      case "mainInfo":
        return (
          <View className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <Text className="text-sm text-gray-600 mb-4">
              {selectedCombo.summary}
            </Text>
            <Text className="text-xs text-gray-500 mt-4">
              Serial: {selectedCombo.applicationSerialNumber}
            </Text>
          </View>
        );

      case "storeInfo":
        return (
          <View className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <Text className="text-sm text-gray-600 mb-4">
              Sold by:{" "}
              <Text className="text-blue-600">
                {selectedCombo.storeNavigationName}
              </Text>
            </Text>
            <View className="border border-blue-600 rounded-md">
              <Text className="text-white bg-blue-600 p-2 font-semibold">
                Your Trust, Our Commitment
              </Text>
              <View className="p-3 space-y-2">
                <View className="flex flex-row items-center space-x-2">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="gray"
                  />
                  <Text className="text-gray-700">
                    Check products before selling
                  </Text>
                </View>
                <View className="flex flex-row items-center space-x-2">
                  <Ionicons name="chatbubble-outline" size={20} color="gray" />
                  <Text className="text-gray-700">Dedicated advice</Text>
                </View>
                <View className="flex flex-row items-center space-x-2">
                  <Ionicons name="car-outline" size={20} color="gray" />
                  <Text className="text-gray-700">Fast shipping</Text>
                </View>
                <View className="flex flex-row items-center space-x-2">
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color="gray"
                  />
                  <Text className="text-gray-700">Responsible warranty</Text>
                </View>
              </View>
            </View>
            <View className="border border-blue-600 rounded-md mt-4">
              <Text className="text-white bg-blue-600 p-2 font-semibold">
                Promotion
              </Text>
              <Text className="p-3 text-gray-700">
                Free Standard Shipping (3-5 days) for prepaid orders over 2
                million VND nationwide (excluding orders weighing over 500g).
              </Text>
            </View>
          </View>
        );

      case "labs":
        return (
          <View className="bg-white p-6 rounded-lg shadow-md mb-4">
            <Text className="text-2xl font-semibold text-blue-600 mb-6">
              Labs related to combo
            </Text>
            {labs.length > 0 ? (
              labs.map((item) => (
                <View
                  key={item.id}
                  className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-4 flex flex-row items-start gap-4"
                >
                  {item.imageUrl && (
                    <Image
                      source={{ uri: item.imageUrl }}
                      className="w-32 h-32 object-cover rounded-md"
                      onError={(e) =>
                        console.log(
                          "Lab Image Load Error:",
                          e.nativeEvent.error
                        )
                      }
                    />
                  )}
                  <View className="flex-1">
                    <Text className="text-gray-800 font-semibold">
                      {item.title}
                    </Text>

                    <Text className="text-gray-600 text-sm">
                      Price: {item.price.toLocaleString("vi-VN")} VND
                    </Text>
                    <Text className="text-gray-700 text-sm mt-1">
                      Store:{" "}
                      <Text className="text-blue-600 font-medium">
                        {item.storeName}
                      </Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleAddLabToCart(item.id)}
                    disabled={addingLabId === item.id}
                    className="bg-blue-600 p-2 rounded"
                  >
                    <Ionicons name="cart-outline" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className="text-gray-500">
                No labs included in this combo.
              </Text>
            )}
          </View>
        );

      case "tabs":
        return (
          <View className="bg-white p-6 rounded-lg shadow-md mb-4">
            <View className="flex flex-row border-b border-gray-200 mb-4">
              <TouchableOpacity
                onPress={() => setActiveTab("details")}
                className={`flex-1 py-2 ${
                  activeTab === "details" ? "border-b-2 border-blue-600" : ""
                }`}
              >
                <Text
                  className={`text-center ${
                    activeTab === "details"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  Combo Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("reviews")}
                className={`flex-1 py-2 ${
                  activeTab === "reviews" ? "border-b-2 border-blue-600" : ""
                }`}
              >
                <Text
                  className={`text-center ${
                    activeTab === "reviews"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  Reviews
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === "details" ? (
              <View className="space-y-6">
                <View>
                  <Text className="text-lg font-medium text-gray-800 mb-2">
                    Combo Description
                  </Text>
                  <Text className="text-gray-700">
                    {selectedCombo.description || "No description available."}
                  </Text>
                </View>
                <View>
                  <Text className="text-lg font-medium text-gray-800 mb-2">
                    Specifications
                  </Text>
                  <Text className="text-gray-700">
                    {selectedCombo.specifications ||
                      "No specifications available."}
                  </Text>
                </View>
                <View>
                  <Text className="text-lg font-medium text-gray-800 mb-2">
                    Notes
                  </Text>
                  <Text className="text-gray-700">
                    {selectedCombo.notes || "No notes available."}
                  </Text>
                </View>
                <View>
                  <Text className="text-lg font-medium text-gray-800 mb-4">
                    Included Devices
                  </Text>
                  <View className="flex flex-row flex-wrap justify-between">
                    {selectedCombo.deviceComboList.map((item) => (
                      <TouchableOpacity
                        key={item.deviceName}
                        onPress={() =>
                          handleDeviceClick(item.iotDeviceId.toString())
                        }
                        className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-4 flex flex-row items-start gap-4 w-[48%]"
                      >
                        <View className="flex-1">
                          <Text className="text-gray-800 font-semibold">
                            {item.deviceName}
                          </Text>
                          <Text className="text-gray-700 text-sm mt-1">
                            Quantity:{" "}
                            <Text className="text-blue-600 font-medium">
                              {item.amount}
                            </Text>
                          </Text>
                        </View>
                        {item.imageUrl && (
                          <Image
                            source={{ uri: item.imageUrl }}
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) =>
                              console.log(
                                "Device Image Load Error:",
                                e.nativeEvent.error
                              )
                            }
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ) : (
              <View className="space-y-4">
                {feedback.length > 0 ? (
                  feedback.map((review: any, index: number) => (
                    <View
                      key={index}
                      className="p-4 border-b border-gray-200 rounded-md"
                    >
                      <View className="flex flex-row justify-between mb-2">
                        <Text className="font-semibold text-gray-800">{`Anonymous ${review.createdBy}`}</Text>
                        <View className="flex flex-row">
                          {[...Array(5)].map((_, i) => (
                            <Ionicons
                              key={i}
                              name={i < review.rating ? "star" : "star-outline"}
                              size={16}
                              color="#FFD700"
                            />
                          ))}
                        </View>
                      </View>
                      <Text className="text-xs text-gray-500 mb-2">
                        {new Date(review.createdDate).toLocaleString("en-EN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </Text>
                      <Text className="text-gray-700 text-sm">
                        {review.content || "No comment"}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View className="text-center py-8">
                    <Text className="text-gray-500 italic mb-4">
                      There are currently no reviews for this combo. Be the
                      first to share your thoughts!
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );

      case "relatedCombos":
        return (
          <View className="bg-white p-6 rounded-lg shadow-md mb-4">
            <Text className="text-2xl font-semibold text-blue-600 mb-6">
              Related Combos
            </Text>
            <FlatList
              data={relatedCombos
                .filter((combo) => combo.isActive === 1)
                .slice(0, 10)}
              renderItem={({ item }) => (
                <View className="min-w-[250px] mr-4">
                  <ComboCard combo={item} />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header with Cart Icon */}
      <View className="flex flex-row justify-between items-center p-4 bg-white shadow-sm">
        <Text className="text-2xl font-bold">{selectedCombo.name}</Text>
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Ionicons name="cart-outline" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Content using FlatList */}
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item, index) => item.type + index}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Fixed Bottom Bar */}
      <View className="bg-white p-4 border-t border-gray-200 shadow-lg absolute bottom-0 left-0 right-0">
        <View className="flex-row items-center justify-between gap-4">
          <Text className="text-xl font-bold text-red-600 flex-1">
            {((selectedCombo?.price || 0) * numCart).toLocaleString("vi-VN")}{" "}
            VND
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-full">
            <TouchableOpacity
              onPress={() => onChangeQuantity(numCart - 1)}
              className="p-3"
              disabled={numCart <= 1}
            >
              <Text
                className={`text-lg font-semibold ${
                  numCart <= 1 ? "text-gray-400" : "text-gray-800"
                }`}
              >
                −
              </Text>
            </TouchableOpacity>
            <Text className="text-lg font-medium text-gray-800 px-4 py-2">
              {numCart}
            </Text>
            <TouchableOpacity
              onPress={() => onChangeQuantity(numCart + 1)}
              className="p-3"
              disabled={
                selectedCombo?.quantity
                  ? numCart >= selectedCombo.quantity
                  : false
              }
            >
              <Text
                className={`text-lg font-semibold ${
                  selectedCombo?.quantity && numCart >= selectedCombo.quantity
                    ? "text-gray-400"
                    : "text-gray-800"
                }`}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={isAdding || (selectedCombo?.quantity ?? 0) === 0}
            className={`flex-1 py-3 rounded-lg ${
              isAdding || (selectedCombo?.quantity ?? 0) === 0
                ? "bg-gray-300"
                : "bg-blue-600"
            }`}
          >
            <Text
              className={`text-center text-base font-semibold ${
                isAdding || (selectedCombo?.quantity ?? 0) === 0
                  ? "text-gray-500"
                  : "text-white"
              }`}
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <View className="flex-1 bg-black bg-opacity-80 justify-center items-center">
          <FlatList
            data={images}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                className="w-full h-3/4 object-contain"
                resizeMode="contain"
                onError={(e) =>
                  console.log("Modal Image Load Error:", e.nativeEvent.error)
                }
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedImageIndex}
            onScroll={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x /
                  event.nativeEvent.layoutMeasurement.width
              );
              setSelectedImageIndex(index);
            }}
          />
          <Pressable
            onPress={handleModalClose}
            className="absolute top-10 right-10"
          >
            <Ionicons name="close" size={30} color="white" />
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
