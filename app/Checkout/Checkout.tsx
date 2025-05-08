import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  Linking,
} from "react-native";
import { useCallback } from "react";
import { RadioButton } from "react-native-paper";
import AddressForm from "./AddressForm";
import {
  createOrder,
  getFeeShip,
  fetchGetTotalPrice,
  fetchCartsPreview,
} from "@/services/slices/checkout";
import WebView from "react-native-webview";
import { useRouter } from "expo-router";
import { Button, Card, Divider } from "react-native-paper";
import Toast from "react-native-toast-message";

interface CartItem {
  id: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  totalPrice: number;
  isSelected: boolean;
}

const Checkout = () => {
  const router = useRouter();
  const [contactNumber, setContactNumber] = useState("");
  const [deliverOption, setDeliverOption] = useState("none");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
    null
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null
  );
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [showWebView, setShowWebView] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);

  useEffect(() => {
    const loadCartData = async () => {
      setLoading(true);
      try {
        const cartData = await fetchCartsPreview();
        setCartItems(cartData.data.data);
        const total = await fetchGetTotalPrice();
        setTotalPrice(total.data.totalSelectedItemsPrice || 0);
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Unable to load order information",
        });
      } finally {
        setLoading(false);
      }
    };
    loadCartData();
  }, []); // Chỉ chạy 1 lần khi mount

  // Tính phí vận chuyển khi thông tin địa chỉ thay đổi
  useEffect(() => {
    const calculateShippingFee = async () => {
      if (
        selectedProvinceId &&
        selectedDistrictId &&
        selectedWardId &&
        address.trim() !== ""
      ) {
        setLoading(true);
        try {
          const shippingFee = await getFeeShip({
            address,
            provinceId: selectedProvinceId,
            districtId: selectedDistrictId,
            wardId: selectedWardId,
            addressId: selectedAddressId || undefined,
            deliver_option: deliverOption,
          });
          setShippingFee(shippingFee);
        } catch (error: any) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Unable to calculate shipping fee",
          });
          setShippingFee(0);
        } finally {
          setLoading(false);
        }
      } else {
        setShippingFee(0);
      }
    };

    calculateShippingFee();
  }, [
    selectedProvinceId,
    selectedDistrictId,
    selectedWardId,
    selectedAddressId,
    deliverOption,
    address, // Thêm address vào dependencies
  ]);
  const handleAddressChange = useCallback(
    (data: {
      address: string;
      ids: {
        provinceId: number | null;
        districtId: number | null;
        wardId: number | null;
        addressId: number | null;
      };
    }) => {
      setAddress(data.address);
      setSelectedProvinceId(data.ids.provinceId);
      setSelectedDistrictId(data.ids.districtId);
      setSelectedWardId(data.ids.wardId);
      setSelectedAddressId(data.ids.addressId);
    },
    []
  );

  const handleCreateOrder = async () => {
    if (!contactNumber) {
      Toast.show({
        type: "error",
        text1: "Missing Phone Number",
        text2: "Please enter your contact phone number.",
      });
      return;
    }

    if (
      !selectedProvinceId ||
      !selectedDistrictId ||
      !selectedWardId ||
      !address
    ) {
      Toast.show({
        type: "error",
        text1: "Incomplete Address Information",
        text2:
          "Please select province, district, ward, and fill in the detailed address.",
      });
      return;
    }

    if (!selectedAddressId) {
      Toast.show({
        type: "error",
        text1: "Shipping Address Not Selected",
        text2: "Please select a shipping address before placing the order.",
      });
      return;
    }

    if (cartItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Empty Cart",
        text2: "Please select at least one product to proceed with payment.",
      });

      return;
    }

    setLoading(true);
    try {
      // const returnUrl = "fe-capstone-iots-mobile://checkout/result";
      // const returnUrl =
      //   "https://fe-capstone-io-ts.vercel.app/checkout-process-order";

      const result = await createOrder({
        address,
        contactNumber,
        notes,
        provinceId: selectedProvinceId,
        districtId: selectedDistrictId,
        wardId: selectedWardId,
        addressId: selectedAddressId || undefined,
        deliver_option: deliverOption,
      });

      console.log("Order creation result:", result);

      if (result.paymentUrl) {
        setPaymentUrl(result.paymentUrl);

        // Xử lý khác nhau giữa web và mobile
        if (Platform.OS === "web") {
          // Mở URL thanh toán trong tab mới nếu là web
          window.open(result.paymentUrl, "_blank");
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "The payment page has been opened in a new tab.",
          });
        } else {
          // Hiển thị WebView nếu là mobile
          setShowWebView(true);
          Toast.show({
            type: "success",
            text1: "Success",
            text2: result.message || "The order has been created successfully.",
          });
        }
      } else {
        throw new Error(result.message || "Unable to receive payment URL");
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      Toast.show({
        type: "error",
        text1: "Payment Error",
        text2: error.message || "Unable to create the order.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    if (navState.url.includes("fe-capstone-iots-mobile://checkout/result")) {
      setShowWebView(false);
      router.push({
        pathname: "/Checkout/CheckProcessOrder",
        params: { urlResponse: navState.url },
      });
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.imageUrl || "https://via.placeholder.com/64" }}
        style={styles.cartItemImage}
      />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.productName}</Text>
        <Text style={styles.cartItemPrice}>
          {(item.price ?? 0).toLocaleString("vi-VN")} VND x {item.quantity}
        </Text>
        <Text style={styles.cartItemTotal}>
          Tổng: {(item.totalPrice ?? 0).toLocaleString("vi-VN")} VND
        </Text>
      </View>
    </View>
  );

  const renderWebView = () => {
    if (Platform.OS === "web") {
      return (
        <Modal visible={showWebView} animationType="slide">
          <View style={styles.webViewFallback}>
            <Text style={styles.webViewText}>
              Vui lòng sử dụng ứng dụng trên thiết bị di động để thanh toán
            </Text>
            <Button
              mode="contained"
              onPress={() => {
                Linking.openURL(paymentUrl);
                setShowWebView(false);
              }}
              style={styles.webViewButton}
            >
              Mở trình duyệt để thanh toán
            </Button>
            <Button
              mode="outlined"
              onPress={() => setShowWebView(false)}
              style={styles.webViewButton}
            >
              Back
            </Button>
          </View>
        </Modal>
      );
    }

    return (
      <Modal visible={showWebView} animationType="slide">
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handleNavigationStateChange}
            style={{ flex: 1 }}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            )}
          />
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Thanh toán</Text>

        <Card style={styles.section}>
          <Card.Title
            title="Selected products"
            titleStyle={styles.sectionTitle}
          />
          <Card.Content>
            {cartItems.length > 0 ? (
              <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No products selected</Text>
            )}
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        <Card style={styles.section}>
          <Card.Title
            title="Thông tin liên hệ"
            titleStyle={styles.sectionTitle}
          />
          <Card.Content>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        <Card style={styles.section}>
          <Card.Title
            title="Shipping address"
            titleStyle={styles.sectionTitle}
          />
          <Card.Content>
            <AddressForm
              onAddressChange={handleAddressChange}
              defaultValues={{
                provinceId: selectedProvinceId || undefined,
                districtId: selectedDistrictId || undefined,
                wardId: selectedWardId || undefined,
                addressId: selectedAddressId || undefined,
                address: address,
              }}
            />
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        <Card style={styles.section}>
          <Card.Title
            title="Shipping method"
            titleStyle={styles.sectionTitle}
          />
          <Card.Content>
            <RadioButton.Group
              onValueChange={setDeliverOption}
              value={deliverOption}
            >
              <View style={styles.radioContainer}>
                <RadioButton value="none" />
                <Text style={styles.radioLabel}>Normal shipping</Text>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton value="xteam" />
                <Text style={styles.radioLabel}>Fast shipping</Text>
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        <Card style={styles.section}>
          <Card.Title title="Notes" titleStyle={styles.sectionTitle} />
          <Card.Content>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        <Card style={styles.section}>
          <Card.Title title="Summary" titleStyle={styles.sectionTitle} />
          <Card.Content>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Price:</Text>
              <Text style={styles.summaryValue}>
                {totalPrice?.toLocaleString("vi-VN") ?? "0"} VND
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping fee:</Text>
              <Text style={styles.summaryValue}>
                {shippingFee?.toLocaleString("vi-VN") ?? "0"} VND
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total payment:</Text>
              <Text style={[styles.summaryValue, styles.summaryTotal]}>
                {(totalPrice + shippingFee)?.toLocaleString("vi-VN") ?? "0"} VND
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleCreateOrder}
          loading={loading}
          disabled={loading || cartItems.length === 0}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Xác nhận thanh toán
        </Button>
      </View>

      {renderWebView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cartItem: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  cartItemPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  divider: {
    marginVertical: 8,
    backgroundColor: "#ddd",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 4,
  },
  button: {
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  webViewFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  webViewText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  webViewButton: {
    marginVertical: 10,
    width: "80%",
  },
});

export default Checkout;
