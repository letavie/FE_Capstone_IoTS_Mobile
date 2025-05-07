import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import Toast, { ToastShowParams } from "react-native-toast-message";
import {
  fetchHistoryOrder,
  changeFeedbackStatus,
  getTrackingGhtk,
  changeCancelledStatus,
  changeCancelledCashPayment,
} from "@/services/slices/historyOrderApi";
import { useThemeColors } from "@/hooks/useThemeColors";
import OrderTabs from "../../components/orders_history/OrderTabs";
import OrderCard from "../../components/orders_history/OrderCard";
import TrackingModal from "../../components/orders_history/TrackingModal";
import CancelOrderModal from "../../components/orders_history/CancelOrderModal";
import FeedbackForm from "../../components/orders_history/FeedbackForm";

// Define types for the order data
interface OrderItem {
  orderItemId: number;
  imageUrl: string;
  nameProduct: string;
  quantity: number;
  price: number;
  orderItemStatus?: number;
  warrantyEndDate?: string;
  productType?: number;
}

interface SellerGroup {
  orderId: number;
  sellerId: number;
  sellerName: string;
  storeId: string;
  orderItemStatus: number;
  trackingId?: string;
  items: OrderItem[];
  sellerRole: number;
}

interface Order {
  orderId: number;
  applicationSerialNumber: string;
  createDate: string;
  orderStatusId: string;
  shippingFee: number;
  totalPrice: number;
  orderDetailsGrouped: SellerGroup[];
}

interface HistoryOrdersResponse {
  totalCount: number;
  dataHistoryOrder: Order[];
}

interface TrackingInfo {
  labelId?: string;
  statusText?: string;
  created?: string;
  deliverDate?: string;
  customerFullname?: string;
  customerTel?: string;
  address?: string;
}

interface CancelOrderInfo {
  orderId: number | null;
  sellerId: number | null;
  visible: boolean;
  formData: {
    contactNumber: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  touched: {
    contactNumber: boolean;
    accountName: boolean;
    accountNumber: boolean;
    bankName: boolean;
  };
}

export default function HistoryOrders() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedSellerGroup, setSelectedSellerGroup] =
    useState<SellerGroup | null>(null);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [cancelOrderInfo, setCancelOrderInfo] = useState<CancelOrderInfo>({
    orderId: null,
    sellerId: null,
    visible: false,
    formData: {
      contactNumber: "",
      accountName: "",
      accountNumber: "",
      bankName: "",
    },
    touched: {
      contactNumber: false,
      accountName: false,
      accountNumber: false,
      bankName: false,
    },
  });
  const [warrantyModal, setWarrantyModal] = useState<{
    visible: boolean;
    orderItemId: number | null;
  }>({
    visible: false,
    orderItemId: null,
  });
  const [historyOrders, setHistoryOrders] = useState<HistoryOrdersResponse>({
    totalCount: 0,
    dataHistoryOrder: [],
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = useCallback(
    async (keyword: string = searchKeyword) => {
      setLoading(true);
      try {
        const response = await fetchHistoryOrder({
          pageIndex: 1,
          pageSize: 100,
          statusFilter: statusFilter ? parseInt(statusFilter) : undefined,
          searchKeyword: keyword,
        });
        setHistoryOrders({
          totalCount: response.data.totalCount,
          dataHistoryOrder: response.data.data.map((order: Order) => ({
            ...order,
            orderDetailsGrouped: order.orderDetailsGrouped.map(
              (group: SellerGroup) => ({
                ...group,
                sellerRole: group.sellerRole ?? 0,
              })
            ),
          })),
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            error instanceof Error ? error.message : "Failed to fetch orders.",
        });
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, searchKeyword]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleTabChange = useCallback((key: string) => {
    setStatusFilter(key === "0" ? "" : key);
    setSearchKeyword("");
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchKeyword(value);
      fetchOrders(value);
    },
    [fetchOrders]
  );

  const handleFeedbackClick = useCallback((group: SellerGroup) => {
    setSelectedSellerGroup(group);
  }, []);

  const handleCloseFeedback = useCallback(() => {
    setSelectedSellerGroup(null);
  }, []);

  const handleWarrantyRequestClick = useCallback((orderItemId: number) => {
    setWarrantyModal({ visible: true, orderItemId });
  }, []);

  const handleCloseWarrantyModal = useCallback(() => {
    setWarrantyModal({ visible: false, orderItemId: null });
  }, []);

  const handleCancelClick = useCallback((orderId: number, sellerId: number) => {
    setCancelOrderInfo({
      orderId,
      sellerId,
      visible: true,
      formData: {
        contactNumber: "",
        accountName: "",
        accountNumber: "",
        bankName: "",
      },
      touched: {
        contactNumber: false,
        accountName: false,
        accountNumber: false,
        bankName: false,
      },
    });
  }, []);

  const handleCancelOrder = useCallback(async () => {
    setCancelOrderInfo((prev) => ({
      ...prev,
      touched: {
        contactNumber: true,
        accountName: true,
        accountNumber: true,
        bankName: true,
      },
    }));

    const { contactNumber, accountName, accountNumber, bankName } =
      cancelOrderInfo.formData;
    if (!contactNumber || !accountName || !accountNumber || !bankName) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all required fields",
      });
      return;
    }

    try {
      const { orderId, formData } = cancelOrderInfo;
      if (orderId === null) throw new Error("Order ID is missing.");
      await changeCancelledStatus({
        orderId,
        ...formData,
      });
      setCancelOrderInfo({ ...cancelOrderInfo, visible: false });
      fetchOrders();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Order cancelled successfully.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error instanceof Error ? error.message : "Failed to cancel order.",
      });
    }
  }, [cancelOrderInfo, fetchOrders]);

  const handleCancelCashPayment = useCallback(
    (orderId: number) => {
      Alert.alert(
        "Cancel Order",
        "Are you sure you want to cancel this order?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Confirm",
            onPress: async () => {
              try {
                await changeCancelledCashPayment({ orderId });
                fetchOrders();
                Toast.show({
                  type: "success",
                  text1: "Success",
                  text2: "Order cancelled successfully.",
                });
              } catch (error) {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2:
                    error instanceof Error
                      ? error.message
                      : "Failed to cancel order.",
                });
              }
            },
          },
        ]
      );
    },
    [fetchOrders]
  );

  const handleCancelFormChange = useCallback(
    (name: keyof CancelOrderInfo["formData"], value: string) => {
      setCancelOrderInfo((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          [name]: value,
        },
      }));
    },
    []
  );

  const handleCancelFormBlur = useCallback(
    (field: keyof CancelOrderInfo["touched"]) => {
      setCancelOrderInfo((prev) => ({
        ...prev,
        touched: {
          ...prev.touched,
          [field]: true,
        },
      }));
    },
    []
  );

  const handleTrackClick = useCallback(async (trackingId: string) => {
    try {
      const result = await getTrackingGhtk({ trackingId });
      setTrackingInfo(result);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error instanceof Error
            ? error.message
            : "Failed to fetch tracking info.",
      });
    }
  }, []);

  const handleCloseTrackingModal = useCallback(() => {
    setTrackingInfo(null);
  }, []);

  const handleChangeToFeedback = useCallback(
    (orderId: number, sellerId: number) => {
      Alert.alert(
        "Confirm Received Order",
        "Are you sure you have received this order?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Confirm",
            onPress: async () => {
              try {
                await changeFeedbackStatus({ orderId, sellerId });
                fetchOrders();
                Toast.show({
                  type: "success",
                  text1: "Success",
                  text2: "Order status updated to Pending Feedback.",
                });
              } catch (error) {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2:
                    error instanceof Error
                      ? error.message
                      : "Failed to update order status.",
                });
              }
            },
          },
        ]
      );
    },
    [fetchOrders]
  );

  const renderOrderCard = useCallback(
    ({ item }: { item: Order }) => (
      <OrderCard
        order={item}
        onFeedbackClick={handleFeedbackClick}
        onReceivedClick={handleChangeToFeedback}
        onCancelCashPayment={handleCancelCashPayment}
        onTrackClick={handleTrackClick}
        onCancelClick={handleCancelClick}
        onWarrantyRequestClick={handleWarrantyRequestClick}
      />
    ),
    [
      handleFeedbackClick,
      handleChangeToFeedback,
      handleCancelCashPayment,
      handleTrackClick,
      handleCancelClick,
      handleWarrantyRequestClick,
    ]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={[styles.headerText, { color: colors.foreground }]}>
          Order History
        </Text>
      </View> */}

      {/* Sticky Tabs and Search */}
      <View
        style={[
          styles.tabsContainer,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        <OrderTabs
          statusFilter={statusFilter}
          onChange={handleTabChange}
          totalCount={historyOrders.totalCount}
        />
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              {
                borderColor: colors.border,
                backgroundColor: colors.input,
                color: colors.foreground,
              },
            ]}
            placeholder="Search by order code"
            placeholderTextColor={colors.mutedForeground}
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            onSubmitEditing={() => handleSearch(searchKeyword)}
          />
        </View>
      </View>

      {/* Order List */}
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : historyOrders.dataHistoryOrder?.length > 0 ? (
        <FlatList
          data={historyOrders.dataHistoryOrder}
          keyExtractor={(item) => item.orderId.toString()}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContent}
          initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            There are no orders in this category.
          </Text>
        </View>
      )}

      {/* Toast Messages */}
      {/* Modals */}
      {selectedSellerGroup && selectedSellerGroup.orderId && (
        <FeedbackForm
          visible={!!selectedSellerGroup}
          onClose={handleCloseFeedback}
          sellerGroup={selectedSellerGroup}
          fetchHistoryOrder={fetchOrders}
        />
      )}

      <TrackingModal
        trackingInfo={trackingInfo}
        onClose={handleCloseTrackingModal}
      />

      <CancelOrderModal
        visible={cancelOrderInfo.visible}
        formData={cancelOrderInfo.formData}
        touched={cancelOrderInfo.touched}
        onChange={handleCancelFormChange}
        onBlur={handleCancelFormBlur}
        onCancel={() =>
          setCancelOrderInfo({ ...cancelOrderInfo, visible: false })
        }
        onConfirm={handleCancelOrder}
      />

      {/* Placeholder for WarrantyRequestModal */}
      {warrantyModal.visible && <View />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    elevation: 4, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
